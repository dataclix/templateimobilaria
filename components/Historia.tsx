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
          sx={{ color: 're-text-main' }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            maxWidth: '800px',
            mx: 'auto',
            color: 're-text-secondary'
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
          sx={{ backgroundColor: 're-accent' }}
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
                Nossa imobiliária foi fundada com o objetivo de transformar a experiência de quem busca comprar, vender ou alugar imóveis em nossa região de atuação.
              </Typography>
              <Typography variant="body1" paragraph className="text-re-text-secondary font-poppins">
                Apostamos em inovação, atendimento digital e soluções ágeis para facilitar a vida dos nossos clientes. Acreditamos que o novo pode ser simples, transparente e eficiente.
              </Typography>
              <Typography variant="body1" paragraph className="text-re-text-secondary font-poppins">
                Nossa história é construída dia após dia, com o propósito de criar conexões verdadeiras, realizar sonhos e construir relações de confiança desde o primeiro contato.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Historia; 