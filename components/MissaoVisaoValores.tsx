import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Grid, Paper, Box } from '@mui/material';

interface MissaoVisaoValoresProps {
  title?: string;
  subtitle?: string;
}

const MissaoVisaoValores: React.FC<MissaoVisaoValoresProps> = ({
  title = "Missão, Visão e Valores",
  subtitle = "Pilares que fundamentam nossa atuação no mercado imobiliário e norteiam todas as nossas decisões."
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

      <Grid container spacing={4} alignItems="stretch">
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <Paper 
              elevation={3}
              sx={{ 
                p: 4, 
                height: { xs: 240, md: 260 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 4,
                border: '1px solid rgba(46, 125, 50, 0.2)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Typography 
                variant="h5" 
                component="h3" 
                className="mb-4 font-semibold text-center"
                sx={{ color: '#2e7d32', mb: 2 }}
              >
                Missão
              </Typography>
              <Box sx={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <Typography variant="body1" align="center" sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'center'
                }}>
                  Conectar pessoas a novos lares e oportunidades, proporcionando uma experiência imobiliária inovadora, ágil e humana.
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Paper 
              elevation={3}
              sx={{ 
                p: 4, 
                height: { xs: 240, md: 260 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 4,
                border: '1px solid rgba(46, 125, 50, 0.2)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Typography 
                variant="h5" 
                component="h3" 
                className="mb-4 font-semibold text-center"
                sx={{ color: '#2e7d32', mb: 2 }}
              >
                Visão
              </Typography>
              <Box sx={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <Typography variant="body1" align="center" sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'center'
                }}>
                  Ser reconhecida como a imobiliária mais inovadora e próxima do cliente em São João del Rei e região.
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper 
              elevation={3}
              sx={{ 
                p: 4, 
                height: { xs: 240, md: 260 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 4,
                border: '1px solid rgba(46, 125, 50, 0.2)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Typography 
                variant="h5" 
                component="h3" 
                className="mb-4 font-semibold text-center"
                sx={{ color: '#2e7d32', mb: 2 }}
              >
                Valores
              </Typography>
              <Box sx={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 0.5 }}>
                <Typography variant="body1" align="center" sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'center'
                }}>
                  • Inovação
                </Typography>
                <Typography variant="body1" align="center" sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'center'
                }}>
                  • Proximidade
                </Typography>
                <Typography variant="body1" align="center" sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'center'
                }}>
                  • Transparência
                </Typography>
                <Typography variant="body1" align="center" sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'center'
                }}>
                  • Agilidade
                </Typography>
                <Typography variant="body1" align="center" sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'center'
                }}>
                  • Respeito
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MissaoVisaoValores; 