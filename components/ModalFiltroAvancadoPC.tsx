import React, { useState, useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { FiltroProps, filtrosAtom } from '@/pages/imoveis';
import axios from 'axios';
import { url } from './globals/variavels';
import { IoMdClose } from 'react-icons/io';
import { openFiltroModalPCAtom } from './Filtro';
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
    styled
} from '@mui/material';

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
}));

export default function ModalFiltroAvancadoPC() {
    const [filtros, setFiltros] = useAtom(filtrosAtom);
    const initialFiltros = useAtomValue(filtrosAtom);
    const [filtrosModal, setFiltrosModal] = useState<FiltroProps | undefined>(initialFiltros);
    const [openFiltro, setOpenFiltro] = useAtom(openFiltroModalPCAtom);
    const [atributos, setAtributos] = useState<Atributos[]>();
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        const fetchAtributosData = async () => {
            try {
                const response = await axios.get(`${url}website/atributos`);
                setAtributos(response.data.sort((a: any, b: any) => a.nome.localeCompare(b.nome)));
            } catch (error) {
                console.error('Erro ao buscar atributos:', error);
            }
        };

        fetchAtributosData();
    }, []);

    const [minPrice, setMinPrice] = useState(filtros?.valorMin || 0);
    const [maxPrice, setMaxPrice] = useState(filtros?.valorMax || 100000000000);

    const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value === '' ? undefined : Number(event.target.value);
        setMinPrice(value === undefined ? 0 : value);
        setFiltrosModal((prevModal) => ({ ...prevModal, valorMin: value }));
    };

    const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value === '' ? undefined : Number(event.target.value);
        setMaxPrice(value === undefined ? 100000000000 : value);
        setFiltrosModal((prevModal) => ({ ...prevModal, valorMax: value }));
    };

    useEffect(() => {
        const buscarImoveis = async () => {
            try {
                const response = await axios.post(`${url}website/imovel/filtrar/count`, filtrosModal);
                setTotal(response.data.total);
            } catch (error) {
                console.log('Erro ao buscar imóveis:', error);
            }
        };
        buscarImoveis();
    }, [filtrosModal]);

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
        setFiltros(filtrosModal || filtros);
        setOpenFiltro(false);
    };

    const handleClearFilters = () => {
        setFiltrosModal(initialFiltros);
        setMinPrice(0);
        setMaxPrice(100000000000);
        setTotal(0);
    };

    const options: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

    const handleSelectChange = (field: string, value: number | undefined) => {
        setFiltrosModal((prevModal) => ({ ...prevModal, [field]: value }));
    };

    return (
        <div>
            <Dialog open={openFiltro} onClose={() => setOpenFiltro(false)} fullWidth maxWidth="md">
                <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
                    <Typography variant="h5" fontWeight="bold">Filtros Avançados</Typography>
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenFiltro(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <IoMdClose size={24} color="black" />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 2, overflowY: 'auto', maxHeight: '600px' }} >
                    <Box p={2}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>Faixa de preço</Typography>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12} sm={6}>
                                <Typography component="label" htmlFor="minPrice" className="block text-sm">Mínimo</Typography>
                                <NumberInput
                                    id="minPrice"
                                    type="number"
                                    value={minPrice}
                                    onChange={handleMinPriceChange}
                                    InputProps={{ inputProps: { min: 0 } }}
                                    className="w-full"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography component="label" htmlFor="maxPrice" className="block text-sm">Máximo</Typography>
                                <NumberInput
                                    id="maxPrice"
                                    type="number"
                                    value={maxPrice}
                                    onChange={handleMaxPriceChange}
                                    InputProps={{ inputProps: { min: 0 } }}
                                    className="w-full"
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box p={2}>
                        <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>Quartos, Banheiros e Garagens</Typography>

                        <Typography variant="subtitle1" mt={2}>Quartos</Typography>
                        <Box display="flex" gap={1} mt={1}>
                            <Button
                                variant={filtrosModal?.quartos === undefined ? 'contained' : 'outlined'}
                                onClick={() => handleSelectChange('quartos', undefined)}
                            >
                                Qualquer
                            </Button>
                            {options.map((numQuartos: number) => (
                                <Button
                                    key={numQuartos}
                                    variant={filtrosModal?.quartos === numQuartos ? 'contained' : 'outlined'}
                                    onClick={() => handleSelectChange('quartos', numQuartos)}
                                >
                                    {numQuartos}+
                                </Button>
                            ))}
                        </Box>

                        <Typography variant="subtitle1" mt={2}>Banheiros</Typography>
                        <Box display="flex" gap={1} mt={1}>
                            <Button
                                variant={filtrosModal?.banheiros === undefined ? 'contained' : 'outlined'}
                                onClick={() => handleSelectChange('banheiros', undefined)}
                            >
                                Qualquer
                            </Button>
                            {options.map((numBanheiros: number) => (
                                <Button
                                    key={numBanheiros}
                                    variant={filtrosModal?.banheiros === numBanheiros ? 'contained' : 'outlined'}
                                    onClick={() => handleSelectChange('banheiros', numBanheiros)}
                                >
                                    {numBanheiros}+
                                </Button>
                            ))}
                        </Box>

                        <Typography variant="subtitle1" mt={2}>Garagens</Typography>
                        <Box display="flex" gap={1} mt={1}>
                            <Button
                                variant={filtrosModal?.garagens === undefined ? 'contained' : 'outlined'}
                                onClick={() => handleSelectChange('garagens', undefined)}
                            >
                                Qualquer
                            </Button>
                            {options.map((numGaragens: number) => (
                                <Button
                                    key={numGaragens}
                                    variant={filtrosModal?.garagens === numGaragens ? 'contained' : 'outlined'}
                                    onClick={() => handleSelectChange('garagens', numGaragens)}
                                >
                                    {numGaragens}+
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    <Box p={2}>
                        <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>Comodidades</Typography>
                        <Grid container spacing={1} className="mt-4">
                            {atributos?.map((atributo) => (
                                <Grid item xs={12} sm={6} md={4} key={atributo.id}>
                                    <FormControlLabel
                                        control={<Checkbox value={atributo.id} />}
                                        label={atributo.nome}
                                        onChange={onChangeCheckbox}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ py: 2, px: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={handleClearFilters} color="primary">Remover Filtros</Button>
                    <Button onClick={onFinishModal} variant="contained" color="primary">Mostrar {total} imóveis</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}