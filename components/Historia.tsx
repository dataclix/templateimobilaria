import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Paper, Grid, Box } from '@mui/material';

interface HistoriaProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
}

const Historia: React.FC<HistoriaProps> = ({
  title = "Nossa História",
  description = "Uma trajetória de crescimento, superação e conquistas.",
  imageSrc = "/images/historiaf.webp",
  imageAlt = "História da Imobiliária"
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
          className="mb-6 font-bold"
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
          {description}
        </Typography>
      </motion.div>

      <Paper 
        elevation={3}
        sx={{ 
          p: { xs: 3, md: 6 }, 
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          className="absolute top-0 left-0 w-2 h-full" 
          sx={{ backgroundColor: '#2e7d32' }}
        />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box 
              sx={{ 
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={imageSrc}
                alt={imageAlt}
                className="rounded-lg shadow-md"
                style={{ 
                  objectFit: 'cover', 
                  width: '100%', 
                  height: 'auto', 
                  borderRadius: '12px', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Box>
          
              <Typography variant="body1" paragraph className="text-re-text-secondary font-poppins">
                Fundada recentemente, a RE Imóveis surge com o objetivo de transformar a experiência de quem busca comprar, vender ou alugar imóveis em São João del Rei e região.
              </Typography>
              <Typography variant="body1" paragraph className="text-re-text-secondary font-poppins">
                Inspirada pela proximidade com a RE Financeira, nossa imobiliária aposta em inovação, atendimento digital e soluções ágeis para facilitar a vida dos nossos clientes. Acreditamos que o novo pode ser simples, transparente e eficiente.
              </Typography>
              <Typography variant="body1" paragraph className="text-re-text-secondary font-poppins">
                Nossa história está apenas começando, mas já nasce com o propósito de criar conexões verdadeiras, realizar sonhos e construir relações de confiança desde o primeiro contato.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Historia; 