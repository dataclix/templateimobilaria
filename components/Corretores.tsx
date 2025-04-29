import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { url } from '@/components/globals/variavels';
import { Typography, Button, Card, CardContent, Box, Avatar } from '@mui/material';
import Image from 'next/image';
import { FaWhatsapp } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export interface Corretor {
  id: string;
  nome: string | null;
  celular: string | null;
  foto: string | null;
  creci: string | null;
  total: number;
}

interface CorretorCardProps {
  corretor: Corretor;
  index: number;
}

const CorretorCard: React.FC<CorretorCardProps> = ({ corretor, index }) => {
  // Nova função que usa um número placeholder
  const handleWhatsapp = () => {
    const numeroGenerico = corretor.celular || '00000000000';
    const mensagem = encodeURIComponent('Olá! Gostaria de falar sobre imóveis.');
    const shareUrl = `https://api.whatsapp.com/send?phone=55${numeroGenerico}&text=${mensagem}`;
    window.open(shareUrl, '_blank');
  };

  const formatName = (fullName: string | null): string => {
    if (!fullName) return 'Corretor';
    const trimmedName = fullName.trim();
    const nameParts = trimmedName.split(' ');
    return nameParts.length > 1
      ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}`
      : trimmedName;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        y: { 
          type: "spring", 
          stiffness: 300, 
          damping: 15 
        }
      }}
      className="h-full"
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          width: '100%',
          maxWidth: 300,
          borderRadius: '16px',
          overflow: 'visible',
          bgcolor: '#F4F6F6',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          margin: '0 auto',
          textAlign: 'center',
          p: 3,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '6px',
            background: 'linear-gradient(90deg, #E67E22 0%, #2C3E50 100%)',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px'
          }
        }}
      >
        <Box sx={{ mb: 3, position: 'relative' }}>
          <Avatar
            src={corretor.foto || '/images/default-avatar.png'}
            alt={corretor.nome || 'Corretor'}
            sx={{
              width: 110,
              height: 110,
              margin: '0 auto',
              border: `3px solid #E67E22`,
              boxShadow: '0 4px 12px rgba(230,126,34,0.18)',
            }}
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.4, type: 'spring' }}
            style={{
              position: 'absolute',
              bottom: -5,
              right: 0,
              left: 0,
              marginLeft: 'auto',
              marginRight: 'auto',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: '#E67E22',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              border: '2px solid white'
            }}
          >
            {index + 1}
          </motion.div>
        </Box>
        <CardContent
          sx={{
            p: 0,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{ 
              fontWeight: '600', 
              color: '#2C3E50', 
              mb: 0.5, 
              fontFamily: 'Montserrat, sans-serif' 
            }}
          >
            {formatName(corretor.nome)}
          </Typography>
          <Typography
            variant="body2"
            sx={{ 
              color: '#34495E', 
              fontWeight: '500', 
              mb: 0.5, 
              fontFamily: 'Poppins, sans-serif' 
            }}
          >
            Especialista Imobiliário
          </Typography>
          <Typography
            variant="caption"
            sx={{ 
              color: '#7F8C8D', 
              display: 'block', 
              mb: 2, 
              height: '20px', 
              fontFamily: 'Poppins, sans-serif' 
            }}
          >
            {corretor.creci ? `CRECI: ${corretor.creci}` : ''}
          </Typography>
        </CardContent>
        <Box sx={{ mt: 'auto' }}>
          <Button
            variant="contained"
            onClick={handleWhatsapp}
            startIcon={<FaWhatsapp />}
            sx={{
              borderRadius: '8px',
              bgcolor: '#E67E22',
              color: 'white',
              fontWeight: '500',
              textTransform: 'none',
              px: 3,
              py: 1,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#2C3E50',
                boxShadow: '0 4px 10px rgba(230,126,34,0.3)',
              },
            }}
          >
            Entrar em Contato
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
};

const Corretores: React.FC = () => {
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const buscarCorretores = async () => {
      setIsLoading(true);
      try {
        if (!url) {
          console.error('A variável url está indefinida!');
          setIsLoading(false);
          return;
        }
        const response = await axios.get<Corretor[]>(`${url}website/corretores`);
        const corretoresFiltrados = response.data.filter(corretor =>
          corretor.nome !== null && corretor.nome.trim() !== ''
        );
        setCorretores(corretoresFiltrados);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error:', error.message, error.code, error.config, error.response);
        } else if (error?.name === 'AbortError') {
          console.error('AbortError: A requisição foi abortada.', error);
        } else {
          console.error('Erro desconhecido ao buscar corretores:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    buscarCorretores();
  }, []);

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, sm: 4 },
        bgcolor: '#F8F9FA',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Remove or comment out decorative background circles/balls */}
      {/* <Box
        sx={{
          position: 'absolute',
          left: { xs: '-150px', md: '-100px' },
          bottom: '0px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,213,75,0.1) 0%, rgba(46, 63, 66, 0.05) 70%, transparent 100%)',
          zIndex: 0
        }}
      /> */}
      {/* <Box
        sx={{
          position: 'absolute',
          right: { xs: '-150px', md: '-100px' },
          top: '0px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,213,75,0.1) 0%, rgba(46, 63, 66, 0.05) 70%, transparent 100%)',
          zIndex: 0
        }}
      /> */}

      <Box
        className="container mx-auto"
        sx={{
          maxWidth: '1200px',
          position: 'relative',
          zIndex: 1
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <Typography
            variant="overline"
            component="span"
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#E67E22',
              letterSpacing: '1.2px',
              display: 'block',
              mb: 1,
              fontFamily: 'Montserrat, sans-serif'
            }}
          >
            TIME DE ESPECIALISTAS
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#2C3E50',
              mb: 2,
              fontFamily: 'Montserrat, sans-serif'
            }}
          >
            Conheça Nossa Equipe
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#34495E',
              maxWidth: '700px',
              fontSize: '1.125rem',
              margin: '0 auto',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            Profissionais experientes e dedicados, prontos para ajudar você a encontrar o imóvel ideal.
          </Typography>
        </motion.div>

        <Box
          className="relative w-full flex justify-center items-center overflow-visible px-8"
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1280: {
                slidesPerView: 3,
              },
            }}
            className="w-full py-8 swiper-corretores"
          >
            {corretores.map((corretor, index) => (
              <SwiperSlide key={corretor.id} className="pb-16">
                <Box sx={{ py: 2 }}>
                  <CorretorCard corretor={corretor} index={index} />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>
    </Box>
  );
};

<style jsx global>{`
  .swiper-button-next, .swiper-button-prev {
    color: #2C3E50cc;
    background: #fff;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    top: 50% !important;
    transform: translateY(-50%);
  }
  .swiper-button-next:after, .swiper-button-prev:after {
    font-size: 1.5rem !important;
    font-weight: bold;
  }
`}</style>

export default Corretores;