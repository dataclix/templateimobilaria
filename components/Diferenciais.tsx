import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Grid, Paper, Box } from '@mui/material';
import { FaCheckCircle } from 'react-icons/fa';

interface Diferencial {
  title: string;
  description: string;
}

interface DiferenciaisProps {
  title?: string;
  subtitle?: string;
  items?: Diferencial[];
}

const defaultDiferenciais: Diferencial[] = [
  {
    title: 'Atendimento Personalizado',
    description: 'Entendemos que cada cliente tem necessidades únicas, por isso oferecemos um atendimento exclusivo e direcionado.'
  },
  {
    title: 'Profissionais Qualificados',
    description: 'Nossa equipe é composta por corretores com registro no CRECI e especialização em diferentes segmentos do mercado.'
  },
  {
    title: 'Amplo Portfólio',
    description: 'Disponibilizamos uma variedade de imóveis em diversas categorias, desde residenciais até comerciais e rurais.'
  },
  {
    title: 'Transparência',
    description: 'Trabalhamos com total clareza em todos os processos, garantindo segurança jurídica em todas as transações.'
  },
  {
    title: 'Tecnologia Avançada',
    description: 'Utilizamos ferramentas digitais modernas para facilitar a busca e a visualização dos imóveis, economizando seu tempo.'
  },
  {
    title: 'Conhecimento Local',
    description: 'Somos especialistas na região, conhecendo profundamente as características de cada bairro e localidade.'
  }
];

const Diferenciais: React.FC<DiferenciaisProps> = ({
  title = "Por que escolher nossa imobiliária?",
  subtitle = "Conheça os diferenciais que fazem de nossa empresa a melhor escolha para seus negócios imobiliários.",
  items = defaultDiferenciais
}) => {
  return (
    <Box sx={{ mt: 16 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <Typography 
          variant="h3" 
          component="h2" 
          className="mb-4 font-bold"
          sx={{ color: '#25383f' }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            maxWidth: '800px',
            mx: 'auto',
            color: '#4a5568'
          }}
        >
          {subtitle}
        </Typography>
      </motion.div>

      <Grid container spacing={4}>
        {items.map((diferencial, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Paper 
                elevation={2}
                sx={{ 
                  p: 3, 
                  height: '100%',
                  borderRadius: 4,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(46, 125, 50, 0.15)'
                  }
                }}
              >
                <Box display="flex" alignItems="flex-start" mb={2}>
                  <FaCheckCircle style={{ color: '#2e7d32', fontSize: 28, marginRight: 12, marginTop: 4 }} />
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    className="font-semibold"
                    sx={{ color: '#25383f' }}
                  >
                    {diferencial.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  {diferencial.description}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Diferenciais; 