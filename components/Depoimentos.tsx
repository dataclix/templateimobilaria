import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Grid, Card, CardContent, Avatar, Box, Divider } from '@mui/material';
import { FormatQuote as FormatQuoteIcon } from '@mui/icons-material';

interface Depoimento {
  name: string;
  position: string;
  testimonial: string;
  image: string;
}

interface DepoimentosProps {
  title?: string;
  subtitle?: string;
  items?: Depoimento[];
}

const defaultDepoimentos: Depoimento[] = [
  {
    name: 'Rodrigo Almeida',
    position: 'Comprador',
    testimonial: 'A imobiliária foi fundamental na compra do meu primeiro apartamento. O atendimento foi excepcional do início ao fim.',
    image: '/images/testimonials/client1.webp'
  },
  {
    name: 'Luciana Gonçalves',
    position: 'Vendedora',
    testimonial: 'Consegui vender minha casa em tempo recorde graças ao excelente trabalho de divulgação e captação de clientes.',
    image: '/images/testimonials/client2.webp'
  },
  {
    name: 'Fernando Costa',
    position: 'Locatário',
    testimonial: 'Aluguei meu ponto comercial com toda a segurança e tranquilidade. Recomendo os serviços da imobiliária para todos.',
    image: '/images/testimonials/client3.webp'
  }
];

const Depoimentos: React.FC<DepoimentosProps> = ({
  title = "O que dizem nossos clientes",
  subtitle = "A satisfação de nossos clientes é o nosso maior patrimônio.",
  items = defaultDepoimentos
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
        {items.map((depoimento, index) => (
          <Grid item xs={12} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: -20,
                      left: 20,
                      backgroundColor: '#2e7d32',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: '0 5px 15px rgba(46, 125, 50, 0.3)'
                    }}
                  >
                    <FormatQuoteIcon />
                  </Box>
                  
                  <Typography 
                    variant="body1" 
                    paragraph
                    sx={{ 
                      pt: 2,
                      pb: 2,
                      fontStyle: 'italic',
                      color: '#4a5568'
                    }}
                  >
                    &ldquo;{depoimento.testimonial}&rdquo;
                  </Typography>
                  
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box display="flex" alignItems="center">
                    <Avatar 
                      src={depoimento.image} 
                      alt={depoimento.name}
                      sx={{ width: 50, height: 50, mr: 2 }}
                    />
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        component="p" 
                        className="font-semibold"
                        sx={{ color: '#25383f' }}
                      >
                        {depoimento.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {depoimento.position}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Depoimentos; 