import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { FaHome, FaKey, FaBuilding, FaMoneyBillWave } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface ServicoCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const ServicoCard: React.FC<ServicoCardProps> = ({ icon, title, description }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <motion.div
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <Box 
                className="p-8 rounded-xl shadow-md transition-all duration-300 bg-re-bg-alt"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    height: '100%',
                    position: 'relative',
                    backgroundColor: '#F5F5F5',
                    color: '#2E2E2E',
                    overflow: 'hidden',
                    boxShadow: isHovered 
                        ? '0 16px 30px rgba(199,176,128,0.15)' 
                        : '0 6px 15px rgba(0,0,0,0.05)',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        background: 'linear-gradient(90deg, #C7B080 0%, #2E2E2E 100%)',
                        opacity: isHovered ? 1 : 0.7,
                        transition: 'opacity 0.3s ease',
                    }
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Box 
                    className="mb-6 relative z-10 p-3 rounded-full"
                    sx={{ 
                        fontSize: '2.5rem',
                        color: '#C7B080',
                        backgroundColor: isHovered ? 'rgba(199,176,128,0.08)' : 'transparent',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {icon}
                </Box>
                <Typography 
                    variant="h5" 
                    component="h3" 
                    className="mb-4 font-montserrat font-bold relative z-10"
                    sx={{ 
                        color: '#2E2E2E',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        position: 'relative',
                        paddingBottom: '0.75rem',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: isHovered ? '40px' : '25px',
                            height: '2px',
                            backgroundColor: '#C7B080',
                            transition: 'all 0.3s ease'
                        }
                    }}
                >
                    {title}
                </Typography>
                <Typography 
                    variant="body1" 
                    className="relative z-10 font-poppins"
                    sx={{ 
                        color: '#7D7D7D',
                        lineHeight: 1.6,
                        fontSize: '0.95rem'
                    }}
                >
                    {description}
                </Typography>
            </Box>
        </motion.div>
    );
};

const Servicos: React.FC = () => {
    const servicos: ServicoCardProps[] = [
        {
            icon: <FaMoneyBillWave style={{ color: '#C7B080' }} />, 
            title: "Financiamento Imobiliário",
            description: "Temos várias linhas de crédito para você comprar seu imóvel. Confira com nossos especialistas e encontre a melhor opção para o seu perfil."
        },
        {
            icon: <FaKey style={{ color: '#C7B080' }} />,
            title: "Alugar uma casa",
            description: "Alugue uma linda casa para você e sua família, a melhor escolha para um lar aconchegante onde você pode construir memórias."
        },
        {
            icon: <FaBuilding style={{ color: '#C7B080' }} />,
            title: "Compre uma casa",
            description: "Compre a casa perfeita por um ótimo preço. Qualidade premium garantida com as melhores opções para investimento."
        }
    ];

    return (
        <Box className="w-full py-20 bg-re-bg-alt">
            <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography 
                        variant="overline" 
                        component="span" 
                        className="text-sm font-semibold tracking-wider font-poppins text-re-base"
                        sx={{ display: 'block', marginBottom: '0.75rem' }}
                    >
                        O QUE OFERECEMOS PARA VOCÊ
                    </Typography>
                    <Typography 
                        variant="h3" 
                        component="h2" 
                        className="text-4xl font-bold mb-4 font-montserrat text-re-base"
                    >
                        Nossos serviços
                    </Typography>
                    <Typography 
                        variant="subtitle1" 
                        className="max-w-2xl mx-auto font-poppins text-re-text-main"
                        sx={{ fontSize: '1.125rem', lineHeight: 1.6, textAlign: 'center' }}
                    >
                        A sua casa de sonho está aqui para ser a solução ideal para você e sua família
                    </Typography>
                </motion.div>

                <Grid container spacing={6}>
                    {servicos.map((servico, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <ServicoCard {...servico} />
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default Servicos; 