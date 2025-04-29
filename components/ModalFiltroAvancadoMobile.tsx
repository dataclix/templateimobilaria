import React, { useState, useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { FiltroProps, filtrosAtom, filtroSelecionadoAtom, modalidadeAtom, termoBuscaAtom } from '@/pages/imoveis';
import axios from 'axios';
import { url } from './globals/variavels';
import { IoMdClose } from 'react-icons/io';
import { openFiltroModalMobileAtom } from './Filtro';
import { Bairro, Cidade } from './FiltroBanner';
import { FaSearch } from 'react-icons/fa';
import Router from 'next/router';
import { toast } from 'react-toastify';
import { removeAccents } from './globals/TratamentosDeStrings';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    Grid,
    Box,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    styled,
    FormControl,
    Select,
    MenuItem,
    InputAdornment
} from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';

export interface Atributos {
    id: string;
    nome: string;
}

const NumberInput = styled(TextField)(({ theme }) => ({
    '& input[type=number]': {
        textAlign: 'center',
        MozAppearance: 'textfield',
    },
    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
        WebkitAppearance: 'none',
        margin: 0,
    },
    '& .MuiInputBase-input': {
        padding: '8px', // Adjust padding as needed
    },
}));

export default function ModalFiltroAvancadoMobile() {
    const [filtros, setFiltros] = useAtom(filtrosAtom);
    const initialFiltros = useAtomValue(filtrosAtom);
    const [openFiltroModal, setOpenFiltroModal] = useAtom(openFiltroModalMobileAtom);
    const [filtrosModal, setFiltrosModal] = useState<FiltroProps | undefined>(initialFiltros);
    const [atributos, setAtributos] = useState<Atributos[]>();
    const [total, setTotal] = useState<number>(0);
    const [cidades, setCidades] = useState<Cidade[]>([]);
    const [bairros, setBairros] = useState<Bairro[]>([]);
    const [filtroSelecionado, setFiltroSelecionado] = useAtom(filtroSelecionadoAtom);
    const [cidadeSelecionada, setCidadeSelecionada] = useState<number[]>([]);
    const [bairroSelecionado, setBairroSelecionado] = useState<number[]>([]);
    const [termoBusca, setTermoBusca] = useAtom(termoBuscaAtom);
    const [modalidade, setModalidade] = useAtom(modalidadeAtom);

    useEffect(() => {
        const fetchCidades = async () => {
            try {
                const response = await axios.post(`${url}website/cidades/filtrar/tem-imovel`, {
                    modalidade: modalidade
                });
                const response2 = await axios.post(`${url}website/bairros/filtrar`, {

                    modalidade: [modalidade],
                    idCidade: [0]
                })
                setCidades(response.data.sort((a: any, b: any) => b.imoveis - a.imoveis));
                setBairros(response2.data.sort((a: any, b: any) => b.imoveis - a.imoveis));
                const response3 = await axios.get(`${url}website/atributos`)
                setAtributos(response3.data.sort((a: any, b: any) => a.nome.localeCompare(b.nome)));
            } catch (error) {
                console.log('Erro ao buscar cidades:', error);
            }
        };

        fetchCidades();
    }, [modalidade]);
    useEffect(() => {
        const fetchBairros = async () => {
            if (cidadeSelecionada) {
                try {
                    if (cidadeSelecionada.length === 0) {
                        const response = await axios.post(`${url}website/bairros/filtrar`, {
                            idCidade: [0],
                            modalidade: [modalidade]
                        });
                        setBairros(response.data.sort((a: any, b: any) => b.imoveis - a.imoveis));
                    } else {
                        const response = await axios.post(`${url}website/bairros/filtrar`, {
                            modalidade: [modalidade],
                            idCidade: cidadeSelecionada
                        });
                        setBairros(response.data.sort((a: any, b: any) => b.imoveis - a.imoveis));
                    }


                } catch (error) {
                    console.error('Erro ao buscar bairros:', error);
                }
            }
        };

        fetchBairros();
    }, [cidadeSelecionada, modalidade]);
    const handleCidadeChangeFitro = (event: any) => {
        const selectedValues: number[] = event.target.value;
         setCidadeSelecionada(selectedValues);
        setFiltrosModal((prevModal) => ({ ...prevModal, idCidade: selectedValues, idBairro: undefined }));
        setBairroSelecionado([]);
    };

    const handleBairroChangeFitro = (event: any) => {
        const selectedValues: number[] = event.target.value;
        setBairroSelecionado(selectedValues);
         setFiltrosModal((prevModal) => ({ ...prevModal, idBairro: selectedValues }));
    };

    const [minPrice, setMinPrice] = useState<number | undefined>(filtros?.valorMin);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(filtros?.valorMax);

    const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value === '' ? undefined : Number(event.target.value);
        setMinPrice(value);
        setFiltrosModal((prevModal) => ({ ...prevModal, valorMin: value }));
    };

    const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value === '' ? undefined : Number(event.target.value);
        setMaxPrice(value);
        setFiltrosModal((prevModal) => ({ ...prevModal, valorMax: value }));
    };

    const handleTermoBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTermoBusca(e.target.value);
    };
    useEffect(() => {
        const buscarImoveis = async () => {
            setTermoBusca('')

            try {
                const response = await axios.post(
                    `${url}website/imovel/filtrar/count`, {
                    idInterno: filtrosModal?.idInterno,
                    idEstado: filtrosModal?.idEstado,
                    idCidade: filtrosModal?.idCidade,
                    idBairro: filtrosModal?.idBairro,
                    modalidade: [modalidade],
                    idTipo: filtrosModal?.idTipo,
                    idSubtipo: filtrosModal?.idSubtipo,
                    valorMin: filtrosModal?.valorMin,
                    valorMax: filtrosModal?.valorMax,
                    garagens: filtrosModal?.garagens,
                    banheiros: filtrosModal?.banheiros,
                    quartos: filtrosModal?.quartos,
                    atributos: filtrosModal?.atributos,
                    categoria: filtrosModal?.categoria,
                }
                );
                setTotal(response.data.total)
            } catch (error) {
                console.log('Erro ao buscar imóveis:', error);
            } finally {
            }
        };
        buscarImoveis();

    }, [filtrosModal, modalidade])

    const onChangeCheckbox = (event: React.SyntheticEvent, checked: boolean) => {
        const target = event.target as HTMLInputElement;
        const { value } = target;
        setFiltrosModal((prevModal) => {
            let currentAtributos = prevModal?.atributos || [];

            if (checked) {
                // Add the value if checked
                currentAtributos = [...currentAtributos, value];
            } else {
                // Remove the value if unchecked
                currentAtributos = currentAtributos.filter(item => item !== value);
            }

            return { ...prevModal, atributos: currentAtributos };
        });
    };

    const onFinishModal = () => {
        if (filtrosModal) {
            setFiltros(filtrosModal)
        } else {
            setFiltros(filtros)
        }

        setOpenFiltroModal(false)
    };
    const options: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
    const handleBuscarImoveis = async () => {
        if (termoBusca !== '' && termoBusca !== undefined && termoBusca !== null) {
            axios.post(
                `${url}website/imovel/filtrar/skip/0/take/125`, {
                idInterno: termoBusca
            }
            ).then((resposta) => {
                console.log(resposta.data.imoveis)
                if (resposta.data.imoveis.length > 0) {
                    Router.push('/imovel/' + resposta.data.imoveis[0].idInterno)
                } else {
                    toast.error('Não foi encontrado imóvel com este código!')
                    setTermoBusca('')
                }
            })
            setFiltroSelecionado(0)
        }

    };
    const filterOption = (input: string, option?: { label: string; value: number }) => {
        if (!option) {
            return false; // ou true, dependendo do seu requisito para opções indefinidas
        }

        const optionLabel = removeAccents(option.label);
        return optionLabel.toLowerCase().includes(removeAccents(input.toLowerCase()));
    };
    return (
        <Dialog open={openFiltroModal} onClose={() => setOpenFiltroModal(false)} fullWidth >
            <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>Filtros</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={() => setOpenFiltroModal(false)}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }}
            >
                <IoMdClose size={24} color="black" className="" />
            </IconButton>
            <DialogContent sx={{ height: "500px" }}>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Button
                        variant={modalidade === 'VENDA' ? "contained" : "outlined"}
                        onClick={() => { setModalidade('VENDA'); setFiltrosModal((prevModal) => ({ ...prevModal, modalidade: ['VENDA'] })); }}
                        sx={{ borderRadius: "20px 0 0 20px", backgroundColor: modalidade === 'VENDA' ? '#1b97b0' : 'inherit', color: modalidade === 'VENDA' ? "white" : "black", }}
                    >
                        Comprar
                    </Button>
                    <Button
                        variant={modalidade === 'ALUGUEL' ? "contained" : "outlined"}
                        onClick={() => { setModalidade('ALUGUEL'); setFiltrosModal((prevModal) => ({ ...prevModal, modalidade: ['ALUGUEL'] })); }}
                        sx={{ borderRadius: "0 20px 20px 0", backgroundColor: modalidade === 'ALUGUEL' ? '#1b97b0' : 'inherit', color: modalidade === 'ALUGUEL' ? "white" : "black", }}
                    >
                        Alugar
                    </Button>
                </Box>
                <Typography sx={{ mt: 2 }}>Buscar por código</Typography>
                <TextField
                    placeholder="Buscar por Código"
                    value={termoBusca}
                    onChange={handleTermoBuscaChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleBuscarImoveis}>
                                    <FaSearch />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: '100%', borderRadius: "20px", mt: 1 }}
                />

                <Typography sx={{ mt: 2 }}>Cidade</Typography>
                <FormControl fullWidth sx={{ mt: 1 }}>
                    <Select
                        multiple
                        value={cidadeSelecionada}
                        onChange={handleCidadeChangeFitro}
                        renderValue={(selected: number[]) =>
                             selected && selected?.length > 0
                                ? selected
                                      .map((value) => {
                                          const cidade = cidades.find((c) => c.id === value);
                                            return cidade ? cidade.nome : '';
                                        })
                                        .join(', ')
                                : "Selecione"
                            }
                         MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 200, // Adjust the maximum height as needed
                                },
                            },
                        }}
                        IconComponent={ArrowDropDown}
                    >
                        {cidades.map((cidade) => (
                            <MenuItem key={cidade.id} value={cidade.id}>
                                {cidade.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Typography sx={{ mt: 2 }}>Bairro</Typography>
                <FormControl fullWidth sx={{ mt: 1 }}>
                    <Select
                        multiple
                        value={bairroSelecionado}
                        onChange={handleBairroChangeFitro}
                        renderValue={(selected: number[]) =>
                            selected && selected?.length > 0
                                ? selected
                                      .map((value) => {
                                          const bairro = bairros.find((b) => b.id === value);
                                            return bairro ? `${bairro.nome} - ${bairro.cidade.nome}` : '';
                                        })
                                        .join(', ')
                                : "Selecione"
                        }
                       MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 200, // Adjust the maximum height as needed
                                },
                            },
                        }}
                        IconComponent={ArrowDropDown}
                    >
                        {bairros.map((bairro) => (
                            <MenuItem key={bairro.id} value={bairro.id}>
                                {bairro.nome} - {bairro.cidade.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Typography sx={{ mt: 2 }}>Faixa de preço</Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <TextField
                        label="Mínimo"
                        type="number"
                        value={minPrice !== undefined ? minPrice.toString() : ''}
                        onChange={handleMinPriceChange}
                        InputProps={{ inputProps: { min: 0 } }}
                        sx={{ width: "100%" }}
                    />
                    <TextField
                        label="Máximo"
                        type="number"
                        value={maxPrice !== undefined ? maxPrice.toString() : ''}
                        onChange={handleMaxPriceChange}
                        InputProps={{ inputProps: { min: 0 } }}
                        sx={{ width: "100%" }}
                    />
                </Box>

                <Typography sx={{ mt: 2 }}>Quartos, Banheiros e Garagens</Typography>
                <Box sx={{ mt: 1 }}>
                    <Typography>Quartos</Typography>
                    <Box sx={{ display: "flex", gap: 1, overflowX: 'auto', paddingBottom: 1 }}>
                        <Button variant={filtrosModal?.quartos === undefined ? "contained" : "outlined"} onClick={() => setFiltrosModal((prevModal) => ({ ...prevModal, quartos: undefined }))}>Qualquer</Button>
                        {options.map((numQuartos) => (
                            <Button key={numQuartos} variant={filtrosModal?.quartos === numQuartos ? "contained" : "outlined"} onClick={() => setFiltrosModal((prevModal) => ({ ...prevModal, quartos: numQuartos }))}>{numQuartos}+</Button>
                        ))}
                    </Box>
                </Box>

                <Box sx={{ mt: 1 }}>
                    <Typography>Banheiros</Typography>
                    <Box sx={{ display: "flex", gap: 1, overflowX: 'auto', paddingBottom: 1 }}>
                        <Button variant={filtrosModal?.banheiros === undefined ? "contained" : "outlined"} onClick={() => setFiltrosModal((prevModal) => ({ ...prevModal, banheiros: undefined }))}>Qualquer</Button>
                        {options.map((numBanheiros) => (
                            <Button key={numBanheiros} variant={filtrosModal?.banheiros === numBanheiros ? "contained" : "outlined"} onClick={() => setFiltrosModal((prevModal) => ({ ...prevModal, banheiros: numBanheiros }))}>{numBanheiros}+</Button>
                        ))}
                    </Box>
                </Box>

                <Box sx={{ mt: 1 }}>
                    <Typography>Garagens</Typography>
                    <Box sx={{ display: "flex", gap: 1, overflowX: 'auto', paddingBottom: 1 }}>
                        <Button variant={filtrosModal?.garagens === undefined ? "contained" : "outlined"} onClick={() => setFiltrosModal((prevModal) => ({ ...prevModal, garagens: undefined }))}>Qualquer</Button>
                        {options.map((numGaragens) => (
                            <Button key={numGaragens} variant={filtrosModal?.garagens === numGaragens ? "contained" : "outlined"} onClick={() => setFiltrosModal((prevModal) => ({ ...prevModal, garagens: numGaragens }))}>{numGaragens}+</Button>
                        ))}
                    </Box>
                </Box>

                <Typography sx={{ mt: 2 }}>Comodidades</Typography>
                <FormControl>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {atributos?.map((atributo) => (
                            <FormControlLabel
                                key={atributo.id}
                                control={
                                    <Checkbox
                                        value={atributo.id}
                                        onChange={onChangeCheckbox}
                                    />
                                }
                                label={atributo.nome}
                            />
                        ))}
                    </Box>
                </FormControl>
            </DialogContent>

            <DialogActions sx={{ py: 2, px: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => {
                    setFiltrosModal({
                        idEstado: undefined,
                        idCidade: undefined,
                        idBairro: undefined,
                        valorMin: undefined,
                        valorMax: undefined,
                        garagens: undefined,
                        banheiros: undefined,
                        quartos: undefined,
                        atributos: undefined,
                    }); setBairroSelecionado([]); setCidadeSelecionada([]); setModalidade('VENDA'); setMinPrice(0); setMaxPrice(100000000000); setTermoBusca('')
                }

                } color="primary">Remover Filtros</Button>
                <Button onClick={onFinishModal} variant="contained" color="primary">Mostrar {total} imóveis</Button>
            </DialogActions>
        </Dialog>
    )
}