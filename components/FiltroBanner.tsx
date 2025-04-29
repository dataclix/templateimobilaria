import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import axios from "axios";
import { toast } from "react-toastify";
import {
  filtrosAtom,
  filtroSelecionadoAtom,
  modalidadeAtom,
  termoBuscaAtom,
} from "@/pages/imoveis";
import { url } from "./globals/variavels";

import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Chip,
  Typography,
  Paper,
  InputAdornment,
  Button,
  Fade,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

export interface Cidade {
  id: number;
  nome: string;
  imoveis: number;
}

export interface Bairro {
  id: number;
  nome: string;
  imoveis: number;
  cidade: {
    nome: string;
  };
}

export type CidadeOption = {
  label: string;
  value: string | null;
  id?: number;
  imoveis?: number;
};

export type BairroOption = {
  label: string;
  value: string | null;
  id?: number;
  imoveis?: number;
};

export interface Categoria {
  key: number;
  label: string;
  idTipo?: number[];
  idSubTipo?: number[];
  categoria?: string;
}

interface SelectedLocation {
  id: number;
  nome: string;
  type: "cidade" | "bairro";
  cidade: string | null;
}

// --- MELHORIAS VISUAIS INSPIRADAS NO FILTRO LATERAL ---
const BannerContainer = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: '850px', // Reduz a largura máxima para um visual mais compacto
  margin: '0 auto', // Centraliza horizontalmente
  position: 'relative',
  zIndex: 10,
  paddingTop: '20px', // Adiciona espaço acima dos botões para separar do texto superior
}));

const TabButtonRow = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center', // Centraliza os botões
  gap: '0px', // Remove o espaço entre os botões
  position: 'relative',
  zIndex: 20, // Garante que os botões fiquem acima do papel
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
  backdropFilter: 'blur(8px)',
  overflow: 'hidden', 
  margin: '0 auto',
  backgroundColor: alpha(theme.palette.background.paper, 0.93),
  padding: '36px 16px 12px 16px', // Aumentado o padding top para comportar os botões
}));

const FormContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF', // Fundo branco da paleta
  borderRadius: '16px', // Mais arredondado
  overflow: 'hidden',
  boxShadow: '0 6px 20px rgba(0,0,0,0.06)', // Sombra mais suave
  border: '1.5px solid #e0e5ec', // Sutil
  borderTop: 'none', // Remove a borda superior
  borderTopLeftRadius: '16px', // Arredondamento superior esquerdo igual ao inferior
  borderTopRightRadius: '16px', // Arredondamento superior direito igual ao inferior
  marginTop: '-2px', // Ajusta para conectar perfeitamente com os botões
}));

const TabButton = styled(Button)<{ active?: boolean }>(({ theme, active }) => ({
  textTransform: 'none',
  borderRadius: '16px 16px 0 0', // Arredondado no topo, combinando com o container
  fontWeight: 600,
  fontSize: '1.05rem',
  padding: '15px 36px', // Mais padding para melhor visual
  color: active ? '#00D54B' : '#555555',
  backgroundColor: active ? '#FFFFFF' : 'rgba(255,255,255,0.84)',
  border: '1.5px solid #e0e5ec',
  borderBottom: active ? 'none' : '1.5px solid #e0e5ec', // Remove borda inferior quando ativo
  position: 'relative',
  zIndex: active ? 30 : 10, // Botão ativo fica em cima
  transition: 'all 0.2s',
  minWidth: '140px',
  marginTop: '5px', // Adiciona espaço para que os botões não fiquem tão juntos do container
  '&:hover': {
    backgroundColor: active ? '#FFFFFF' : 'rgba(255,255,255,0.95)',
    color: '#00D54B',
  },
  '&::after': active ? {
    content: '""',
    position: 'absolute',
    bottom: '-2px',
    left: '1px',
    right: '1px',
    height: '3px',
    backgroundColor: '#FFFFFF',
    zIndex: 35,
  } : {}
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 10, // Mais arredondado
    transition: 'all 0.3s',
    backgroundColor: 'rgba(244,246,246,0.82)', // bg-re-bg-alt
    fontSize: '0.98rem',
    '&:hover': {
      borderColor: '#00D54B',
      backgroundColor: 'rgba(244,246,246,0.95)',
    },
    '&.Mui-focused': {
      borderColor: '#00D54B',
      backgroundColor: '#F4F6F6',
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
    color: '#5A6C6F', // text-re-text-secondary
    fontSize: '1rem',
  },
  marginBottom: 8,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 10,
    transition: 'all 0.3s',
    backgroundColor: 'rgba(244,246,246,0.85)', // bg-re-bg-alt
    fontSize: '1rem',
    '&:hover': {
      borderColor: '#00D54B',
      backgroundColor: 'rgba(244,246,246,0.95)',
    },
    '&.Mui-focused': {
      borderColor: '#00D54B',
      backgroundColor: '#F4F6F6',
    },
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#00D54B', // Accent
  color: 'white',
  borderRadius: '10px',
  padding: '12px 28px', // Ajustado para ocupar menos espaço
  fontWeight: 700,
  boxShadow: '0 4px 16px rgba(0, 213, 75, 0.16)',
  transition: 'all 0.3s',
  marginLeft: '8px', // Adiciona um espaço entre o dropdown e o botão
  height: '56px', // Mantém a mesma altura do dropdown para alinhamento
  '&:hover': {
    backgroundColor: '#00b944', // Tom mais escuro do accent
    boxShadow: '0 6px 20px rgba(0, 213, 75, 0.20)',
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#F4F6F6', // bg-re-bg-alt
  color: '#2D3F42', // text-re-text-main
  fontWeight: 500,
  borderRadius: 8,
  '& .MuiChip-label': {
    paddingLeft: '7px',
    paddingRight: '10px',
  },
  '& .MuiChip-deleteIcon': {
    marginRight: '3px',
    fontSize: '1.08rem',
  },
}));

const GREEN_ICON = '#00D54B';

const CATEGORIAS: Categoria[] = [
  { key: 0, label: "Todos" },
  { key: 1, label: "Casa", idTipo: [2] },
  { key: 2, label: "Apartamento", idTipo: [1] },
  { key: 3, label: "Kitnet/Studio", idSubTipo: [4, 5] },
  { key: 4, label: "Ponto Comercial", idSubTipo: [6] },
  { key: 5, label: "Lote/Terreno", idSubTipo: [26, 27] },
  { key: 6, label: "Condomínio", idSubTipo: [47, 8, 48] },
  { key: 7, label: "Pousada", idSubTipo: [45, 32] },
  { key: 8, label: "Sítio", idSubTipo: [28] },
  { key: 9, label: "Fazenda", idSubTipo: [24] },
  { key: 10, label: "Hotel", idSubTipo: [17] },
  { key: 11, label: "Galpão", idSubTipo: [16] },
];

interface FiltroBannerProps {
  isMobile?: boolean;
}

const FiltroBanner: React.FC<FiltroBannerProps> = ({ isMobile = false }) => {
  const [modalidade, setModalidade] = useAtom(modalidadeAtom);
  const [termoBusca, setTermoBusca] = useAtom(termoBuscaAtom);
  const [, setFiltros] = useAtom(filtrosAtom);
  const [, setFiltroSelecionado] = useAtom(filtroSelecionadoAtom);

  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<SelectedLocation[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria>(CATEGORIAS[0]);
  const router = useRouter();

  const cidadesOptions = useMemo((): CidadeOption[] => [
    { label: "Todas as Cidades", value: null, id: 0, imoveis: cidades.reduce((acc, c) => acc + c.imoveis, 0) },
    ...cidades.map((cidade) => ({
      label: cidade.nome,
      value: cidade.id.toString(),
      id: cidade.id,
      imoveis: cidade.imoveis,
    })),
  ], [cidades]);

  const bairrosOptions = useMemo((): BairroOption[] => [
    { label: "Todos os Bairros", value: null, id: 0, imoveis: bairros.reduce((acc, b) => acc + b.imoveis, 0) },
    ...bairros.map((bairro) => ({
      label: `${bairro.nome} - ${bairro.cidade.nome}`,
      value: bairro.id.toString(),
      id: bairro.id,
      imoveis: bairro.imoveis,
    })),
  ], [bairros]);

  const categoriasOptions = useMemo(
    () =>
      CATEGORIAS.map((categoria) => ({
        label: categoria.label,
        value: categoria.key.toString(),
      })),
    []
  );

  const fetchCidadesEBairrosIniciais = useCallback(async (currentModalidade: string) => {
    try {
      const cidadesRes = await axios.post(`${url}website/cidades/filtrar/tem-imovel`, { modalidade: currentModalidade });
      const cidadesOrdenadas: Cidade[] = cidadesRes.data.sort((a: Cidade, b: Cidade) => b.imoveis - a.imoveis);
      setCidades(cidadesOrdenadas);

      const bairrosRes = await axios.post(`${url}website/bairros/filtrar`, { idCidade: [0], modalidade: [currentModalidade] });
      const bairrosOrdenados: Bairro[] = bairrosRes.data.sort((a: Bairro, b: Bairro) => b.imoveis - a.imoveis);
      setBairros(bairrosOrdenados);
    } catch (error) {
      console.error("Erro ao buscar dados iniciais:", error);
      toast.error("Falha ao carregar localizações.");
    }
  }, []);

  useEffect(() => {
    fetchCidadesEBairrosIniciais(modalidade);
  }, [modalidade, fetchCidadesEBairrosIniciais]);

  const fetchBairrosPorCidades = useCallback(async (cityIds: number[], currentModalidade: string) => {
    const idCidadeParam = cityIds.length > 0 ? cityIds : [0];

    if (idCidadeParam.length > 0) {
        try {
        const response = await axios.post(`${url}website/bairros/filtrar`, {
            idCidade: idCidadeParam,
            modalidade: [currentModalidade],
        });
        const bairrosOrdenados: Bairro[] = response.data.sort((a: Bairro, b: Bairro) => b.imoveis - a.imoveis);
        setBairros(bairrosOrdenados);
        } catch (error) {
        const msg = cityIds.length > 0 ? "Falha ao carregar bairros para cidades selecionadas." : "Falha ao carregar bairros.";
        console.error(`Erro ao buscar bairros (cidades: ${cityIds.join(", ")}):`, error);
        toast.error(msg);
        setBairros([]);
        }
    } else {
        // Se não há cidades selecionadas, decide-se o que fazer com a lista de bairros
        // Pode-se limpar ou recarregar a lista inicial
        fetchCidadesEBairrosIniciais(modalidade); // Recarrega todos bairros como exemplo
    }
  }, [fetchCidadesEBairrosIniciais, modalidade]);

  useEffect(() => {
    const selectedCityIds = selectedLocations
      .filter((loc) => loc.type === "cidade")
      .map((loc) => loc.id);
    fetchBairrosPorCidades(selectedCityIds, modalidade);
  }, [selectedLocations, modalidade, fetchBairrosPorCidades]);

  const handleBuscarImoveis = useCallback(async () => {
    if (termoBusca && termoBusca.trim() !== "") {
      if (!/^\d+$/.test(termoBusca.trim())) {
        toast.warn("Código inválido. Use apenas números.");
        setTermoBusca("");
        return;
      }
      try {
        const response = await axios.post(`${url}website/imovel/filtrar/skip/0/take/20`, {
          idInterno: termoBusca.trim(),
        });
        if (response.data.imoveis && response.data.imoveis.length > 0) {
          router.push("/imovel/" + response.data.imoveis[0].idInterno);
          setTermoBusca("");
          setSelectedLocations([]);
          setCategoriaSelecionada(CATEGORIAS[0]);
          setFiltroSelecionado(0);
        } else {
          toast.info("Não foi encontrado imóvel com este código.");
          setTermoBusca("");
        }
      } catch (error) {
        console.error("Erro na busca por código:", error);
        toast.error("Erro ao buscar imóvel pelo código.");
      }
    } else {
      const cityNormal = selectedLocations
          .filter((loc) => loc.type === "cidade")
          .map((loc) => loc.id);

      const cityBairro = selectedLocations
          .filter((loc) => loc.type === "bairro" && loc.cidade !== null)
          .map((loc) => {
              const cityMatch = cidades.find(c => c.nome === loc.cidade);
              if (!cityMatch) {
                  console.warn(`Não foi possível encontrar o ID da cidade para o nome: ${loc.cidade}`);
                  return null;
              }
              return cityMatch.id;
          })
          .filter((id): id is number => id !== null)
          .filter((valor, index, self) => self.indexOf(valor) === index);

      const cityIds = Array.from(new Set([...cityNormal, ...cityBairro]));

      const bairroIds = selectedLocations
          .filter((loc) => loc.type === "bairro")
          .map((loc) => loc.id);

      const filtrosParaApi = {
        idInterno: undefined,
        modalidade: [modalidade],
        idBairro: bairroIds.length > 0 ? bairroIds : undefined,
        idCidade: cityIds.length > 0 ? cityIds : undefined,
        idTipo: categoriaSelecionada && categoriaSelecionada.key !== 0 ? categoriaSelecionada.idTipo : undefined,
        idSubtipo: categoriaSelecionada && categoriaSelecionada.key !== 0 ? categoriaSelecionada.idSubTipo : undefined,
      };

      console.log("Aplicando Filtros (handleBuscarImoveis):", filtrosParaApi);
      setFiltros(filtrosParaApi);
      setFiltroSelecionado(categoriaSelecionada?.key ?? 0);
      router.push("/imoveis");
    }
  }, [
      termoBusca,
      modalidade,
      selectedLocations,
      categoriaSelecionada,
      router,
      setFiltros,
      setFiltroSelecionado,
      setTermoBusca,
      cidades
  ]);

  const handleLocationSelect = (option: CidadeOption | BairroOption | null, type: "cidade" | "bairro") => {
    if (!option || option.value === null || option.id === 0 || !option.id) {
      console.log("handleLocationSelect: Ignored selection (null, undefined, or 'Todos')", option);
      return;
    }

    let nomeLocal: string = option.label;
    let nomeCidade: string | null = null;

    if (type === "bairro" && option.label.includes(" - ")) {
      const parts = option.label.split(" - ");
      nomeLocal = parts[0].trim();
      nomeCidade = parts[1].trim();
    } else if (type === "cidade") {
      nomeLocal = option.label;
    }

    const newLocation: SelectedLocation = {
      id: option.id,
      nome: nomeLocal,
      type,
      cidade: nomeCidade,
    };

    const locationExists = selectedLocations.some(
      (loc) => loc.id === newLocation.id && loc.type === type
    );

    if (!locationExists) {
      console.log("handleLocationSelect: Adding new location", newLocation);
      setSelectedLocations((prevLocations) => [...prevLocations, newLocation]);
    } else {
      console.log("handleLocationSelect: Location already selected", newLocation);
    }
  };

  const removeLocation = (locationToRemove: SelectedLocation) => {
    setSelectedLocations((prevLocations) =>
      prevLocations.filter((loc) => !(loc.id === locationToRemove.id && loc.type === locationToRemove.type))
    );
  };

  const handleCategoriaChange = (value: string) => {
    const selectedKey = Number(value);
    const categoria = CATEGORIAS.find((c) => c.key === selectedKey);
    if (categoria) {
      setCategoriaSelecionada(categoria);
    }
  };

  const handleModalidadeChange = useCallback(
    (value: string) => {
      setModalidade(value);
      setSelectedLocations([]);
      setCategoriaSelecionada(CATEGORIAS[0]);
      setTermoBusca("");
    },
    [setModalidade, setTermoBusca]
  );

  if (isMobile) {
    return (
      <BannerContainer>
        <TabButtonRow>
          <TabButton
            active={modalidade === "VENDA"}
            onClick={() => handleModalidadeChange("VENDA")}
            aria-label="Comprar"
          >
            Comprar
          </TabButton>
          <TabButton
            active={modalidade === "ALUGUEL"}
            onClick={() => handleModalidadeChange("ALUGUEL")}
            aria-label="Alugar"
          >
            Alugar
          </TabButton>
        </TabButtonRow>
        
        <FormContainer>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleBuscarImoveis();
            }}
            className="p-4"
          >
            <div className="flex flex-col gap-3">
              <StyledTextField
                fullWidth
                placeholder="pesquisar por ID do imóvel"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                variant="outlined"
                size="small"
              />

              <div className="flex space-x-2">
                <StyledFormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="categoria-select-label-mobile">Tipo de casa</InputLabel>
                  <Select
                    labelId="categoria-select-label-mobile"
                    id="categoria-select-mobile"
                    value={categoriaSelecionada?.key?.toString() ?? "0"}
                    label="Tipo de casa"
                    onChange={(e) => handleCategoriaChange(e.target.value)}
                  >
                    {categoriasOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Typography variant="body2">{option.label}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>

                <SearchButton variant="contained" type="submit" size="medium">
                  Buscar
                </SearchButton>
              </div>

              <div className="flex space-x-2">
                <StyledFormControl fullWidth variant="outlined" size="small">
                  <Select
                    id="cidade-select-mobile"
                    value=""
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      const selectedOption = cidadesOptions.find((opt) => opt.value === selectedValue);
                      if (selectedOption !== undefined) {
                        handleLocationSelect(selectedOption, "cidade");
                      }
                    }}
                    displayEmpty
                    renderValue={() => "Selecione uma cidade"}
                  >
                    <MenuItem value="" disabled>Selecione uma cidade</MenuItem>
                    {cidadesOptions.filter((opt) => opt.id !== 0).map((option) => (
                      <MenuItem key={`city-mob-${option.id}`} value={option.value || ""}>
                        <Typography variant="body2">{option.label}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>

                <StyledFormControl fullWidth variant="outlined" size="small">
                  <Select
                    id="bairro-select-mobile"
                    value=""
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      const selectedOption = bairrosOptions.find((opt) => opt.value === selectedValue);
                      if (selectedOption !== undefined) {
                        handleLocationSelect(selectedOption, "bairro");
                      }
                    }}
                    disabled={bairros.length === 0 || bairrosOptions.length <= 1}
                    displayEmpty
                    renderValue={() => "Selecione um bairro"}
                  >
                    <MenuItem value="" disabled>Selecione um bairro</MenuItem>
                    {bairrosOptions.filter((opt) => opt.id !== 0).map((option) => (
                      <MenuItem key={`bairro-mob-${option.id}`} value={option.value || ""}>
                        <Typography variant="body2">{option.label}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </div>

              {selectedLocations.length > 0 && (
                <div className="p-2 bg-gray-100 rounded-lg border border-gray-200 mt-2">
                  <div className="flex flex-wrap gap-1">
                    {selectedLocations.map((location) => (
                      <StyledChip
                        key={`mob-${location.type}-${location.id}`}
                        label={location.nome}
                        onDelete={() => removeLocation(location)}
                        size="small"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Box>
        </FormContainer>
      </BannerContainer>
    );
  }

  return (
    <BannerContainer>
      <TabButtonRow>
        <TabButton
          active={modalidade === "VENDA"}
          onClick={() => handleModalidadeChange("VENDA")}
          aria-label="Comprar"
        >
          Comprar
        </TabButton>
        <TabButton
          active={modalidade === "ALUGUEL"}
          onClick={() => handleModalidadeChange("ALUGUEL")}
          aria-label="Alugar"
        >
          Alugar
        </TabButton>
      </TabButtonRow>
      
      <FormContainer>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleBuscarImoveis();
          }}
          className="p-6"
        >
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-12 md:col-span-7">
              <StyledTextField
                fullWidth
                placeholder="pesquisar por ID do imóvel"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                variant="outlined"
              />
            </div>

            <div className="col-span-8 md:col-span-3">
              <StyledFormControl fullWidth variant="outlined">
                <InputLabel id="categoria-select-label">Tipo de casa</InputLabel>
                <Select
                  labelId="categoria-select-label"
                  id="categoria-select"
                  value={categoriaSelecionada?.key?.toString() ?? "0"}
                  label="Tipo de casa"
                  onChange={(e) => handleCategoriaChange(e.target.value)}
                >
                  {categoriasOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </div>

            <div className="col-span-4 md:col-span-2">
              <SearchButton fullWidth variant="contained" type="submit" size="large">
                Buscar
              </SearchButton>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <StyledFormControl fullWidth variant="outlined">
              <Select
                id="cidade-select"
                value=""
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  const selectedOption = cidadesOptions.find((opt) => opt.value === selectedValue);
                  if (selectedOption !== undefined) {
                    handleLocationSelect(selectedOption, "cidade");
                  }
                }}
                displayEmpty
                renderValue={() => "Selecione uma cidade"}
              >
                <MenuItem value="" disabled>Selecione uma cidade</MenuItem>
                {cidadesOptions.filter((opt) => opt.id !== 0).map((option) => (
                  <MenuItem key={`city-${option.id}`} value={option.value || ""}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>

            <StyledFormControl fullWidth variant="outlined">
              <Select
                id="bairro-select"
                value=""
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  const selectedOption = bairrosOptions.find((opt) => opt.value === selectedValue);
                  if (selectedOption !== undefined) {
                    handleLocationSelect(selectedOption, "bairro");
                  }
                }}
                disabled={bairros.length === 0 || bairrosOptions.length <= 1}
                displayEmpty
                renderValue={() => "Selecione um bairro"}
              >
                <MenuItem value="" disabled>Selecione um bairro</MenuItem>
                {bairrosOptions.filter((opt) => opt.id !== 0).map((option) => (
                   <MenuItem key={`bairro-${option.id}`} value={option.value || ""}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </div>

          {selectedLocations.length > 0 && (
            <Fade in={true}>
              <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {selectedLocations.map((location) => (
                    <StyledChip
                      key={`${location.type}-${location.id}`}
                      label={location.nome}
                      onDelete={() => removeLocation(location)}
                      size="medium"
                    />
                  ))}
                </div>
              </div>
            </Fade>
          )}
        </Box>
      </FormContainer>
    </BannerContainer>
  );
};

export default FiltroBanner;