import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { url } from "./globals/variavels"; // Assuming this path is correct
import { useAtom } from "jotai";
import { filtrosAtom, modalidadeAtom, FiltroProps } from "../pages/imoveis"; // Assuming this path is correct
import { motion } from "framer-motion";
import { SelectChangeEvent } from "@mui/material";

// Importação dos componentes de UI do filtro
import FiltroHeader from "./ui/FiltroHeader";
import FiltroLocalizacao from "./ui/FiltroLocalizacao";
import FiltroTipoImovel from "./ui/FiltroTipoImovel";
import FiltroPreco from "./ui/FiltroPreco";
import FiltroCodigo from "./ui/FiltroCodigo";
import FiltroFooter from "./ui/FiltroFooter";

// Keep necessary MUI imports
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  InputAdornment,
  Typography,
  IconButton,
} from "@mui/material";

// Keep MUI Icons
import {
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  MeetingRoom as MeetingRoomIcon,
  Storefront as StorefrontIcon,
  Landscape as LandscapeIcon,
  Domain as DomainIcon,
  Hotel as HotelIcon,
  Agriculture as AgricultureIcon,
  LocalHotel as LocalHotelIcon,
  Warehouse as WarehouseIcon,
  HomeWork as HomeWorkIcon,
  KeyboardArrowDown,
  CleaningServices as CleaningServicesIcon,
  Search as SearchIcon,
  Sell as SellIcon, // Keep SellIcon for "Comprar"
  LocationCity as LocationCityIcon,
} from '@mui/icons-material';

// --- Interfaces (Keep As Is) ---
interface Cidade {
  id: number;
  nome: string;
  imoveis: number;
}

interface Bairro {
  id: number;
  nome: string;
  imoveis: number;
  cidade: { nome: string };
}

interface Atributos {
  id: string;
  nome: string;
}

interface SelectOption {
  label: string;
  value: string;
  id?: number;
}

interface SelectedLocation {
  id: number;
  nome: string;
  type: "cidade" | "bairro";
}

// --- Helper Function (Keep As Is) ---
export const filterOption = (input: string, option?: SelectOption): boolean => {
  return option?.label?.toLowerCase().includes(input.toLowerCase()) ?? false;
};

// --- Component ---
const FiltroLateral: React.FC = () => {
  // --- State and Hooks ---
  const [filtros, setFiltros] = useAtom(filtrosAtom); // Global atom state
  const [modalidade, setModalidade] = useAtom(modalidadeAtom); // Global atom state for modality
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Local state for UI elements - these will NOT update the global atom directly anymore (except for modality)
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [atributos, setAtributos] = useState<Atributos[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<SelectedLocation[]>([]);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | undefined>(undefined);
  const [localIdInterno, setLocalIdInterno] = useState<string | undefined>(undefined);

  // --- Memos and Data (Keep As Is) ---
  const categorias = useMemo(() => [
    { key: "0", label: "Todos os imóveis" },
    { key: "1", label: "Casa", idTipo: [2] },
    { key: "2", label: "Apartamento", idTipo: [1] },
    { key: "3", label: "Kitnet/Studio", idSubTipo: [4, 41] },
    { key: "4", label: "Ponto Comercial", idSubTipo: [37, 39, 40, 46] },
    { key: "5", label: "Lote/Terreno", idSubTipo: [27, 26] },
    { key: "6", label: "Condomínio", idSubTipo: [47, 8, 48] },
    { key: "7", label: "Pousada", idSubTipo: [45, 32] },
    { key: "8", label: "Sítio", idSubTipo: [28] },
    { key: "9", label: "Fazenda", idSubTipo: [24] },
    { key: "10", label: "Hotel", idSubTipo: [17] },
    { key: "11", label: "Galpão", idSubTipo: [16] },
    { key: "12", label: "Alto Padrão", categoria: "9cf0af77-2562-4048-b5eb-c3ee04c4768d" },
    { key: "13", label: "Em Alta", categoria: "258d4c6c-d894-4046-a0b6-8bf202f13dd9" },
    { key: "14", label: "Histórico", categoria: "63c8aa4f-636a-4420-9190-9a64f1c89eff" },
    { key: "15", label: "Lançamento", categoria: "fd7fd27c-0a2e-4a3d-b649-fc7e6a8a9a73" },
    { key: "16", label: "Merece Destaque", categoria: "c06c52b0-ec47-4f03-9fbb-05815de92981" },
    { key: "17", label: "Para Investir", categoria: "c769b98c-ece4-4f5f-93bf-85375bfda38f" },
  ], []);

  // --- Effects ---

  // Effect 1: Load initial data and hydrate based on modality and global filters
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      setIsLoading(true);
      try {
        // Fetch based on current atom modality
        const responseCidades = await axios.post(`${url}website/cidades/filtrar/tem-imovel`, { modalidade: modalidade });
        setCidades(responseCidades.data.sort((a: Cidade, b: Cidade) => b.imoveis - a.imoveis));

        const responseAtributos = await axios.get(`${url}website/atributos`);
        setAtributos(responseAtributos.data.sort((a: Atributos, b: Atributos) => a.nome.localeCompare(b.nome)));

        // --- Hydrate local state from global 'filtros' atom ---
        // (Only hydrate if modality hasn't just changed, otherwise resets take precedence)
        // Check if the atom's modality matches the current one; if not, resets were likely just done.
        if (!filtros || !filtros.modalidade || filtros.modalidade[0] === modalidade) {
            setMinPrice(filtros?.valorMin);
            setMaxPrice(filtros?.valorMax);
            setLocalIdInterno(filtros?.idInterno);

            let foundCategoriaKey: string | undefined = undefined;
            if (filtros?.categoria) {
                foundCategoriaKey = categorias.find(cat => cat.categoria === filtros.categoria)?.key;
            } else if (filtros?.idTipo?.[0]) {
                foundCategoriaKey = categorias.find(cat => cat.idTipo?.includes(filtros.idTipo![0]))?.key;
            } else if (filtros?.idSubtipo?.[0]) {
                foundCategoriaKey = categorias.find(cat => cat.idSubTipo?.includes(filtros.idSubtipo![0]))?.key;
            }
            setCategoriaSelecionada(foundCategoriaKey === "0" ? undefined : foundCategoriaKey);

            const initialSelectedLocations: SelectedLocation[] = [];
            if (filtros?.idCidade && responseCidades.data) {
            filtros.idCidade.forEach(id => {
                const cidade = responseCidades.data.find((c: Cidade) => c.id === id);
                if (cidade && !initialSelectedLocations.some(loc => loc.id === id && loc.type === 'cidade')) {
                initialSelectedLocations.push({ id: cidade.id, nome: cidade.nome, type: "cidade" });
                }
            });
            }
            // Set selected locations state. Bairro hydration happens in the next effect.
            setSelectedLocations(initialSelectedLocations);
        } else {
             // If modalities don't match, it means handleModalidadeChange just ran and reset things.
             // Ensure local state reflects the reset initiated there.
             setSelectedLocations([]);
             setCategoriaSelecionada(undefined);
             setMinPrice(undefined);
             setMaxPrice(undefined);
             setLocalIdInterno(undefined);
        }


      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        setCidades([]);
        setAtributos([]);
      } finally {
         // setIsLoading(false); // Defer to the bairro loading effect
      }
    };

    carregarDadosIniciais();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalidade]); // Re-run ONLY when modality atom changes

  // Effect 2: Load Bairros based on locally selected cities and hydrate selected bairros
  useEffect(() => {
      const carregarBairros = async () => {
          const selectedCityIds = selectedLocations.filter(loc => loc.type === "cidade").map(loc => loc.id);

          if (selectedCityIds.length > 0) {
              setIsLoading(true);
              try {
                  const response = await axios.post(`${url}website/bairros/filtrar`, {
                      idCidade: selectedCityIds,
                      modalidade: [modalidade] // Use current modality
                  });
                  const fetchedBairros = response.data.sort((a: Bairro, b: Bairro) => b.imoveis - a.imoveis);
                  setBairros(fetchedBairros);

                  // Hydrate selected bairros from 'filtros' atom after bairros are fetched
                  let updatedLocations = [...selectedLocations]; // Start with current local state
                  let needsUpdate = false;
                  if (filtros?.idBairro) {
                      filtros.idBairro.forEach(idBairro => {
                          const bairro = fetchedBairros.find((b: Bairro) => b.id === idBairro);
                          if (bairro && !updatedLocations.some(loc => loc.id === idBairro && loc.type === 'bairro')) {
                              updatedLocations.push({ id: bairro.id, nome: `${bairro.nome} - ${bairro.cidade.nome}`, type: 'bairro' });
                              needsUpdate = true;
                          }
                      });
                  }
                  // Ensure uniqueness after potential hydration additions
                  const uniqueLocations = new Map<string, SelectedLocation>();
                    updatedLocations.forEach(loc => uniqueLocations.set(`${loc.type}-${loc.id}`, loc));
                  const finalLocations = Array.from(uniqueLocations.values());

                  // Only update state if it actually changed
                  if (needsUpdate || finalLocations.length !== selectedLocations.length) {
                     setSelectedLocations(finalLocations);
                  }


              } catch (error) {
                  console.error("Erro ao buscar bairros:", error);
                  setBairros([]);
              } finally {
                  setIsLoading(false);
              }
          } else {
              setBairros([]);
              const cityOnlyLocations = selectedLocations.filter(loc => loc.type === 'cidade');
              if (selectedLocations.length !== cityOnlyLocations.length) {
                  setSelectedLocations(cityOnlyLocations);
              }
              setIsLoading(false);
          }
      };

      // Only run if cities are potentially selected or have been loaded
      if (selectedLocations.some(l => l.type === 'cidade') || cidades.length > 0 || filtros?.idCidade) {
         carregarBairros();
      } else {
          setIsLoading(false); // Ensure loading is off if no cities are relevant
      }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocations, modalidade, cidades, filtros?.idBairro]); // Depend on selectedLocations, modality, loaded cities, and atom's bairro IDs for hydration trigger

  // --- Options Memoization (Keep As Is) ---
  const cidadeOptions: SelectOption[] = useMemo(() => [
      { label: "Adicionar cidade", value: "" },
      ...cidades.map(c => ({ label: c.nome, value: c.id.toString(), id: c.id }))
  ], [cidades]);

  const bairroOptions: SelectOption[] = useMemo(() => [
      { label: "Adicionar bairro", value: "" },
      ...bairros.map(b => ({ label: `${b.nome} (${b.cidade.nome})`, value: b.id.toString(), id: b.id }))
  ], [bairros]);

  const categoriaOptions: SelectOption[] = useMemo(() =>
      categorias.map(cat => ({ label: cat.label, value: cat.key })),
  [categorias]);

  // --- Handlers ---

  // MODIFIED: handleModalidadeChange updates atoms and resets state IMMEDIATELY
  const handleModalidadeChange = (newModalidade: string) => {
      if (newModalidade !== modalidade) {
          setIsLoading(true); // Indicate loading start

          // 1. Update modality atom immediately
          setModalidade(newModalidade);

          // 2. Reset local UI state immediately
          setSelectedLocations([]);
          setCategoriaSelecionada(undefined);
          setMinPrice(undefined);
          setMaxPrice(undefined);
          setLocalIdInterno(undefined);
          setBairros([]); // Clear local lists
          setCidades([]); // Clear local lists (will be refetched by effect 1)

          // 3. Update the global filtrosAtom immediately to reflect reset state
          setFiltros((prev: FiltroProps) => ({
              ...(prev || {}), // Keep existing unrelated filters (like advanced)
              modalidade: [newModalidade], // Set new modality
              // Clear filters dependent on modality
              idCidade: undefined,
              idBairro: undefined,
              idTipo: undefined,
              idSubtipo: undefined,
              categoria: undefined,
              valorMin: undefined, // Reset price in atom
              valorMax: undefined,
              idInterno: undefined, // Reset code in atom
          }));

          // Note: setIsLoading(false) will be handled by the useEffects after data reloads.
      }
  };


  // --- Handlers for other filters (Update only LOCAL state) ---

  const handleLocationSelect = (e: SelectChangeEvent<string>, type: "cidade" | "bairro") => {
    const selectedValue = e.target.value;
    if (!selectedValue) return;
    const option = (type === "cidade" ? cidadeOptions : bairroOptions).find(opt => opt.value === selectedValue);
    if (option?.id !== undefined) {
      const newLocation: SelectedLocation = { id: option.id, nome: option.label, type };
      if (!selectedLocations.some(loc => loc.id === newLocation.id && loc.type === type)) {
        setSelectedLocations(prev => [...prev, newLocation]); // Update LOCAL state
      }
    }
  };

  const removeLocation = (locationToRemove: SelectedLocation) => {
    let updatedLocations = selectedLocations.filter(loc => !(loc.id === locationToRemove.id && loc.type === locationToRemove.type));
    if (locationToRemove.type === 'cidade') {
        const cityNomeToRemove = cidades.find(c => c.id === locationToRemove.id)?.nome;
        if (cityNomeToRemove) {
            updatedLocations = updatedLocations.filter(loc => {
                if (loc.type === 'bairro') {
                    const bairroData = bairros.find(b => b.id === loc.id);
                    return bairroData?.cidade.nome !== cityNomeToRemove;
                }
                return true;
            });
        }
    }
    setSelectedLocations(updatedLocations); // Update LOCAL state
  };

  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    const numericValue = parseInt(value, 10);
    const finalValue = isNaN(numericValue) || numericValue < 0 ? undefined : numericValue;
    if (field === 'min') setMinPrice(finalValue); // Update LOCAL state
    else setMaxPrice(finalValue); // Update LOCAL state
  };

  const handleCategoriaChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setCategoriaSelecionada(value === "0" ? undefined : value); // Update LOCAL state
  };

  const handleCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalIdInterno(e.target.value || undefined); // Update LOCAL state
  };

  // --- Clear and Apply Filters ---

  const clearFilters = () => {
    setIsLoading(true);
    setFiltros({}); // Clear the global filter atom
    setModalidade("VENDA"); // Reset modality atom (triggers effect 1)

    // Reset local state as well
    setSelectedLocations([]);
    setCategoriaSelecionada(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setLocalIdInterno(undefined);
    setBairros([]);
    setCidades([]);

    if (router && window.location.pathname !== '/imoveis') { // Avoid redundant navigation
      router.push("/imoveis");
    }
    // Loading state handled by effects
  };

  // Apply Filters (Reads local state, updates atom, triggers search/navigation)
  const handleApplyFilters = async () => {
    setIsLoading(true);

    // 1. Read local state + current modality from atom
    const cityIds = selectedLocations.filter(loc => loc.type === "cidade").map(loc => loc.id);
    const bairroIds = selectedLocations.filter(loc => loc.type === "bairro").map(loc => loc.id);
    const selectedCategoriaData = categorias.find(c => c.key === categoriaSelecionada);
    const idInternoToSearch = localIdInterno;

    // 2. Construct final filter object, preserving advanced filters from atom
    const finalFilters: FiltroProps = {
      ...(filtros || {}), // Spread existing to keep advanced filters etc.
      modalidade: [modalidade], // Use current modality from atom
      idCidade: cityIds.length > 0 ? cityIds : undefined,
      idBairro: bairroIds.length > 0 ? bairroIds : undefined,
      valorMin: minPrice,
      valorMax: maxPrice,
      idTipo: categoriaSelecionada === undefined ? undefined : selectedCategoriaData?.idTipo,
      idSubtipo: categoriaSelecionada === undefined ? undefined : selectedCategoriaData?.idSubTipo,
      categoria: categoriaSelecionada === undefined ? undefined : selectedCategoriaData?.categoria,
      idInterno: idInternoToSearch,
    };

    // 3. Special Case: Search by Code
    if (idInternoToSearch) {
      try {
        const response = await axios.post(`${url}website/imovel/filtrar/skip/0/take/1`, { idInterno: idInternoToSearch, modalidade: [modalidade] });
        if (response.data.imoveis?.length > 0) {
          router.push(`/imovel/${response.data.imoveis[0].idInterno}`);
          setIsLoading(false);
          return; // Stop processing
        } else {
          console.warn("Nenhum imóvel encontrado com esse código:", idInternoToSearch);
          finalFilters.idInterno = undefined;
          setLocalIdInterno(undefined);
        }
      } catch (error) {
        console.error("Erro ao buscar imóvel por código:", error);
        finalFilters.idInterno = undefined;
        setLocalIdInterno(undefined);
      }
    }

    // 4. Update the global filter atom
    setFiltros(finalFilters);

    // 5. Navigate if not already on the results page
    if (router && window.location.pathname !== '/imoveis') {
        router.push("/imoveis");
    }

    setIsLoading(false);
  };

  // --- Formatting (Keep As Is) ---
  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined || value === null) return "";
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  };

  // --- MUI Component Styling (Keep As Is) ---
  const muiInputBaseSx = { backgroundColor: 'var(--color-re-bg-alt)', borderRadius: '0.5rem', fontSize: '0.875rem', color: 'var(--color-re-text-main)', border: '1px solid var(--color-re-accent)', boxShadow: 'none', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-re-accent)', borderWidth: '1px' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-re-accent)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-re-accent)', borderWidth: '1.5px' }, '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'var(--color-re-text-secondary)', fontSize: '1rem' } };
  const muiInputLabelSx = { fontSize: '0.8rem', color: 'var(--color-re-text-secondary)', '&.Mui-focused': { color: 'var(--color-re-accent)' } };
  const muiMenuItemSx = { fontSize: '0.8rem', paddingTop: '4px', paddingBottom: '4px', '&:hover': { backgroundColor: 'rgba(0, 213, 75, 0.08)' }, '&.Mui-selected': { backgroundColor: 'rgba(0, 213, 75, 0.12)', fontWeight: 500 }, '&.Mui-disabled': { opacity: 0.5 } };

  // --- Render JSX (No changes needed here from the previous version) ---
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="bg-re-bg rounded-lg border border-re-bg-alt shadow-sm flex flex-col h-full max-h-[calc(100vh-100px)] md:sticky md:top-20">

        {/* 1. Header com título removido e substituído pelos botões de modalidade */}
        <div className="p-2 border-b border-re-bg-alt">
          <div className="flex gap-1">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleModalidadeChange("VENDA")}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium flex items-center justify-center gap-1 transition-all duration-200 ease-in-out ${
                modalidade === 'VENDA'
                ? 'bg-re-accent text-re-text-invert shadow-md'
                : 'bg-re-bg-alt text-re-text-secondary border border-re-text-tertiary hover:border-re-text-secondary hover:bg-re-text-tertiary/10'
              }`}
            >
              <SellIcon style={{ fontSize: '0.8rem' }} />
              Comprar
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleModalidadeChange("ALUGUEL")}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium flex items-center justify-center gap-1 transition-all duration-200 ease-in-out ${
                modalidade === 'ALUGUEL'
                ? 'bg-re-accent text-re-text-invert shadow-md'
                : 'bg-re-bg-alt text-re-text-secondary border border-re-text-tertiary hover:border-re-text-secondary hover:bg-re-text-tertiary/10'
              }`}
            >
              <HomeIcon style={{ fontSize: '0.8rem' }} />
              Alugar
            </motion.button>
          </div>
        </div>

        {/* 2. Scrollable Content Area - com ordem reorganizada */}
        <div className="flex-grow overflow-y-auto p-2 space-y-1.5 custom-scrollbar">

          {/* Section: Localização movida para o início */}
          <div className="space-y-1.5 bg-re-bg-alt/30 p-2 rounded-lg border border-re-bg-alt">
            <label className="text-xs font-semibold text-re-text-main mb-1 block">
              Localização
            </label>
            {/* Cidade Select com múltipla seleção */}
            <FormControl size="small" fullWidth variant="outlined" sx={{ mb: 1 }}>
              <Select
                labelId="cidade-label"
                multiple
                value={selectedLocations.filter(loc => loc.type === "cidade").map(loc => loc.id.toString())}
                onChange={(e) => {
                  const selectedValues = typeof e.target.value === 'string' 
                    ? e.target.value.split(',') 
                    : e.target.value;
                  
                  // Remover cidades que foram desmarcadas
                  const currentCityIds = selectedLocations
                    .filter(loc => loc.type === "cidade")
                    .map(loc => loc.id.toString());

                  const removedCityIds = currentCityIds.filter(id => !selectedValues.includes(id));
                  
                  // Remover as cidades desmarcadas e seus bairros
                  if (removedCityIds.length > 0) {
                    removedCityIds.forEach(cityId => {
                      const cityToRemove = selectedLocations.find(
                        loc => loc.type === 'cidade' && loc.id.toString() === cityId
                      );
                      if (cityToRemove) {
                        removeLocation(cityToRemove);
                      }
                    });
                  }
                  
                  // Adicionar novas cidades selecionadas
                  const newCityIds = selectedValues.filter(id => !currentCityIds.includes(id));
                  newCityIds.forEach(cityId => {
                    const cityOption = cidadeOptions.find(opt => opt.value === cityId);
                    if (cityOption?.id !== undefined) {
                      const newLocation = { 
                        id: cityOption.id, 
                        nome: cityOption.label, 
                        type: "cidade" as const
                      };
                      setSelectedLocations(prev => [...prev, newLocation]);
                    }
                  });
                }}
                displayEmpty
                renderValue={(selected) => {
                  const selectedCities = selectedLocations.filter(loc => 
                    loc.type === "cidade" && selected.includes(loc.id.toString())
                  );
                  return selectedCities.length > 0 
                    ? (
                      <div className="flex flex-wrap gap-1">
                        {selectedCities.map((city) => (
                          <span key={city.id} className="bg-re-accent/10 text-re-accent px-1.5 py-0.5 rounded text-xs font-medium">
                            {city.nome}
                          </span>
                        ))}
                      </div>
                    ) 
                    : <span style={{ color: 'var(--color-re-text-secondary)', fontSize: '0.8rem' }}>Selecione uma cidade</span>;
                }}
                IconComponent={KeyboardArrowDown}
                sx={{ ...muiInputBaseSx, minHeight: '32px', borderRadius: '6px' }}
                MenuProps={{ 
                  PaperProps: { 
                    sx: { 
                      maxHeight: 300, 
                      marginTop: '4px',
                      '& .MuiMenuItem-root': muiMenuItemSx,
                      '& .MuiCheckbox-root': {
                        color: 'var(--color-re-text-secondary)',
                        '&.Mui-checked': {
                          color: 'var(--color-re-accent)',
                        },
                      },
                    } 
                  } 
                }}
              >
                {cidadeOptions.slice(1).map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{
                    ...muiMenuItemSx,
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    <div className="flex items-center w-full">
                      <input 
                        type="checkbox"
                        checked={selectedLocations.some(l => l.type === 'cidade' && l.id === option.id)}
                        className="mr-2 h-3.5 w-3.5 accent-re-accent"
                        readOnly
                      />
                      <span>{option.label}</span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Bairro Select com múltipla seleção */}
            <FormControl size="small" fullWidth variant="outlined">
              <Select
                labelId="bairro-label"
                multiple
                value={selectedLocations.filter(loc => loc.type === "bairro").map(loc => loc.id.toString())}
                onChange={(e) => {
                  const selectedValues = typeof e.target.value === 'string' 
                    ? e.target.value.split(',') 
                    : e.target.value;
                  
                  // Remover bairros que foram desmarcados
                  const currentBairroIds = selectedLocations
                    .filter(loc => loc.type === "bairro")
                    .map(loc => loc.id.toString());

                  const removedBairroIds = currentBairroIds.filter(id => !selectedValues.includes(id));
                  
                  if (removedBairroIds.length > 0) {
                    removedBairroIds.forEach(bairroId => {
                      const bairroToRemove = selectedLocations.find(
                        loc => loc.type === 'bairro' && loc.id.toString() === bairroId
                      );
                      if (bairroToRemove) {
                        removeLocation(bairroToRemove);
                      }
                    });
                  }
                  
                  // Adicionar novos bairros selecionados
                  const newBairroIds = selectedValues.filter(id => !currentBairroIds.includes(id));
                  newBairroIds.forEach(bairroId => {
                    const bairroOption = bairroOptions.find(opt => opt.value === bairroId);
                    if (bairroOption?.id !== undefined) {
                      const newLocation = { 
                        id: bairroOption.id, 
                        nome: bairroOption.label, 
                        type: "bairro" as const
                      };
                      setSelectedLocations(prev => [...prev, newLocation]);
                    }
                  });
                }}
                disabled={selectedLocations.filter(loc => loc.type === "cidade").length === 0 || isLoading || bairros.length === 0}
                displayEmpty
                renderValue={(selected) => {
                  const selectedBairros = selectedLocations.filter(loc => 
                    loc.type === "bairro" && selected.includes(loc.id.toString())
                  );
                  return selectedBairros.length > 0 
                    ? (
                      <div className="flex flex-wrap gap-1">
                        {selectedBairros.map((bairro) => {
                          const bairroNome = bairros.find(b => b.id === bairro.id)?.nome || bairro.nome.split(' (')[0];
                          return (
                            <span key={bairro.id} className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs font-medium">
                              {bairroNome}
                            </span>
                          );
                        })}
                      </div>
                    ) 
                    : <span style={{ color: 'var(--color-re-text-secondary)', fontSize: '0.8rem' }}>Selecione um bairro</span>;
                }}
                IconComponent={KeyboardArrowDown}
                sx={{ ...muiInputBaseSx, minHeight: '32px', borderRadius: '6px' }}
                MenuProps={{ 
                  PaperProps: { 
                    sx: { 
                      maxHeight: 300, 
                      marginTop: '4px',
                      '& .MuiMenuItem-root': muiMenuItemSx,
                      '& .MuiCheckbox-root': {
                        color: 'var(--color-re-text-secondary)',
                        '&.Mui-checked': {
                          color: 'var(--color-re-accent)',
                        },
                      },
                    } 
                  } 
                }}
              >
                {bairroOptions.slice(1).map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{
                    ...muiMenuItemSx,
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    <div className="flex items-center w-full">
                      <input 
                        type="checkbox"
                        checked={selectedLocations.some(l => l.type === 'bairro' && l.id === option.id)}
                        className="mr-2 h-3.5 w-3.5 accent-re-accent"
                        readOnly
                      />
                      <span>{option.label}</span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Section: Tipo de Imóvel */}
          <div className="space-y-1.5 bg-re-bg-alt/30 p-2 rounded-lg border border-re-bg-alt">
            <label className="text-xs font-semibold text-re-text-main mb-1 block">
              Tipo de Imóvel
            </label>
            <FormControl size="small" fullWidth variant="outlined">
              <Select
                labelId="tipo-imovel-label"
                id="tipo-imovel-select"
                value={categoriaSelecionada ?? "0"}
                onChange={handleCategoriaChange}
                IconComponent={KeyboardArrowDown}
                sx={{ ...muiInputBaseSx, height: '32px', borderRadius: '6px' }}
                MenuProps={{ PaperProps: { sx: { maxHeight: 220, marginTop: '4px' } } }}
                displayEmpty
              >
                {categoriaOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={muiMenuItemSx}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Nova Seção: Quartos, Banheiros e Vagas - Reorganizada em linhas separadas */}
          <div className="space-y-2 bg-re-bg-alt/30 p-2 rounded-lg border border-re-bg-alt">
            {/* Quartos */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-re-text-main font-medium">Quartos</span>
                <div className="flex w-3/5 gap-1">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={`quarto-${num}`}
                      onClick={() => {
                        // Toggle selection
                        setFiltros(prev => ({
                          ...prev,
                          quartos: prev.quartos === num ? undefined : num
                        }))
                      }}
                      className={`flex-1 h-7 text-xs rounded ${
                        filtros.quartos === num
                          ? 'bg-re-accent text-white' 
                          : 'bg-white text-re-text-secondary border border-gray-200'
                      }`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Banheiros */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-re-text-main font-medium">Banheiros</span>
                <div className="flex w-3/5 gap-1">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={`banheiro-${num}`}
                      onClick={() => {
                        // Toggle selection
                        setFiltros(prev => ({
                          ...prev,
                          banheiros: prev.banheiros === num ? undefined : num
                        }))
                      }}
                      className={`flex-1 h-7 text-xs rounded ${
                        filtros.banheiros === num
                          ? 'bg-re-accent text-white' 
                          : 'bg-white text-re-text-secondary border border-gray-200'
                      }`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Vagas */}
            <div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-re-text-main font-medium">Vagas</span>
                <div className="flex w-3/5 gap-1">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={`vaga-${num}`}
                      onClick={() => {
                        // Toggle selection
                        setFiltros(prev => ({
                          ...prev,
                          garagens: prev.garagens === num ? undefined : num
                        }))
                      }}
                      className={`flex-1 h-7 text-xs rounded ${
                        filtros.garagens === num
                          ? 'bg-re-accent text-white' 
                          : 'bg-white text-re-text-secondary border border-gray-200'
                      }`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Faixa de Preço - Substituído pelo componente FiltroPreco */}
          <div className="bg-re-bg-alt/30 rounded-lg border border-re-bg-alt">
            <FiltroPreco
              minPrice={minPrice}
              maxPrice={maxPrice}
              modalidade={modalidade}
              handlePriceChange={handlePriceChange}
              formatCurrency={formatCurrency}
            />
          </div>

          {/* Section: Busca por Código movida para o final */}
          <div className="space-y-1.5 bg-re-bg-alt/30 p-2 rounded-lg border border-re-bg-alt">
            <label className="text-xs font-semibold text-re-text-main mb-1 block">
              Busca por Código
            </label>
            <TextField
              id="codigo-imovel"
              placeholder="Digite o código do imóvel"
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon style={{ fontSize: '0.9rem' }} /></InputAdornment>), sx: { ...muiInputBaseSx, height: '32px', borderRadius: '6px' } }}
              InputLabelProps={{ sx: muiInputLabelSx }}
              value={localIdInterno || ''}
              onChange={handleCodigoChange}
            />
          </div>

        </div> {/* End Scrollable Content Area */}

        {/* 3. Footer Actions com novo desenho do limpar filtros */}
        <div className="p-2 mt-auto border-t border-re-bg-alt bg-re-bg">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleApplyFilters}
            disabled={isLoading}
            className="w-full py-1.5 px-3 rounded-md text-xs font-medium bg-re-accent text-re-text-invert shadow-sm hover:bg-opacity-90 transition-all duration-200 ease-in-out flex items-center justify-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (<><svg className="animate-spin -ml-1 mr-1.5 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Buscando...</>) : (<><SearchIcon style={{ fontSize: '0.9rem' }} /> Aplicar Filtros</>)}
          </motion.button>
          
          {/* Botão de limpar filtros completamente redesenhado com cor diferente */}
          {( selectedLocations.length > 0 || minPrice !== undefined || maxPrice !== undefined || categoriaSelecionada !== undefined || localIdInterno !== undefined || Object.keys(filtros || {}).length > 1 || (Object.keys(filtros || {}).length === 1 && !filtros?.modalidade) ) && !isLoading && (
            <div className="flex justify-center mt-2">
              <button 
                onClick={clearFilters} 
                className="text-blue-600 text-[10px] font-medium bg-blue-50 hover:bg-blue-100 py-1 px-2 rounded-md flex items-center gap-1 transition-all mx-auto border border-blue-200"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                  <path d="M5 12h14M5 12l4-4m-4 4l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Limpar todos os filtros
              </button>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default FiltroLateral;

// CSS variables and custom scrollbar styles remain the same...
/*
:root { ... }
.custom-scrollbar { ... }
.MuiMenu-paper { ... }
*/