import React from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography } from '@mui/material';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  bgColor?: string;
  patternImage?: string;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  title = "Sobre Nossa Imobiliária",
  subtitle = "logot realizando sonhos imobiliários",
  bgColor = "linear-gradient(135deg, #C7B080 0%, #A69268 100%)",
  patternImage = "/images/fundo.webp"
}) => {
  return (
    <Box 
      className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center"
      sx={{ 
        background: bgColor,
      }}    
    >
      <Box 
        className="absolute inset-0 z-0 opacity-10" 
        sx={{
          backgroundImage: `url("${patternImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <Container maxWidth="lg" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <Typography 
            variant="h1" 
            component="h1"
            className="font-montserrat text-re-text-invert"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 800,
              mb: 2,
              textShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            {title}
          </Typography>
          
          <Typography 
            variant="h5" 
            component="h2"
            className="font-poppins text-white"
            sx={{
              fontSize: { xs: '1rem', md: '1.25rem' },
              fontWeight: 400,
              maxWidth: '800px',
              mx: 'auto',
              opacity: 0.9,
              lineHeight: 1.5
            }}
          >
            {subtitle}
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroBanner; 