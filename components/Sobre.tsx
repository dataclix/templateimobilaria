import React, { type FC, memo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import type { Variants } from 'framer-motion';
import { FaUsers, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa'; // Alterado ícone para mais clareza
import { Box, Typography, Grid, styled, Button, useMediaQuery, useTheme } from '@mui/material';
import router from 'next/router';

// Dynamically import heavy components
const MotionComponent = dynamic(() =>
  import('framer-motion').then(mod => ({ default: mod.motion.div })),
  { ssr: false }
);

// Types for testimonials (mantido)
interface Testimonial {
  icon: JSX.Element;
  title: string;
  description: string;
}

// Pre-defined animation variants (mantido)
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

// --- INÍCIO: CONTEÚDO ATUALIZADO ---
// Testimonial data (Atualizado para informações mais concretas)
const testimonials: Testimonial[] = [
  {
    icon: <FaMapMarkerAlt className="w-6 h-6 text-re-accent" />, // Ícone de localização
    title: "Especialistas no Mercado de São João del Rei",
    description: "Profundo conhecimento da cidade e suas oportunidades imobiliárias."
  },
  {
    icon: <FaCheckCircle className="w-6 h-6 text-re-accent" />, // Ícone de check/confiança
    title: "Confiança e Tradição desde 2013",
    description: "Mais de 15 anos construindo relações sólidas na região."
  }
];
// --- FIM: CONTEÚDO ATUALIZADO ---

// Styled components (mantido)
const StyledMotionDiv = styled(MotionComponent)({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  backgroundColor: 'var(--tw-color-re-bg)',
  padding: '1rem',
  borderRadius: '0.5rem',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  marginBottom: '1rem',
  zIndex: 20,
});

// Create wrapper for MotionDiv that accepts sx prop (mantido)
const AnimatedBox: FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variants?: Variants;
  initial?: string;
  whileInView?: string;
  transition?: {
    duration: number;
    delay?: number;
  };
  viewport?: {
    once: boolean;
  };
}> = ({ children, className, style, variants, initial, whileInView, transition, viewport }) => (
  <MotionComponent
    variants={variants}
    initial={initial}
    whileInView={whileInView}
    transition={transition}
    viewport={viewport}
    className={className}
    style={style}
  >
    {children}
  </MotionComponent>
);

// Memoized Testimonial component (mantido)
const TestimonialItem: FC<{ testimonial: Testimonial; index: number }> = memo(({ testimonial, index }) => (
  <StyledMotionDiv
    variants={fadeInRight}
    initial="hidden"
    whileInView="visible"
    transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
    viewport={{ once: true }}
  >
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#e6f7ec" // Fundo levemente esverdeado para o ícone
      color="#00b937"
      width={48}
      height={48}
      borderRadius="50%"
      sx={{ fontSize: '1.5rem', flexShrink: 0 }} // Evitar que o ícone encolha
    >
      {testimonial.icon}
    </Box>
    <Box> {/* Wrapper para o texto */}
      <Typography variant="subtitle1" fontWeight="semibold" color="textPrimary" className="font-montserrat text-re-text-main">
        {testimonial.title}
      </Typography>
      {/* Descrição opcional pode ser adicionada aqui se necessário */}
      {/* <Typography variant="body2" color="textSecondary">{testimonial.description}</Typography> */}
    </Box>
  </StyledMotionDiv>
));

TestimonialItem.displayName = 'TestimonialItem';

// Main component
const AboutUs: FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box className="w-full relative overflow-hidden mt-10 md:mt-20">
      {/* Full width orange banner (mantido) */}
      <Box
        className="absolute z-10 w-screen"
        bgcolor="#ff6a00"
        sx={{
          height: { xs: '160px', md: '160px' },
          top: { xs: '240px', md: '280px', lg: '160px' },
          left: '50%',
          transform: 'translateX(-50%)',
          display: { xs: 'none', md: 'block' }
        }}
      />

      <Box className="w-full max-w-7xl mx-auto relative px-4 sm:px-6 lg:px-8">
        <Grid container spacing={{ xs: 6, md: 8, lg: 10 }} className="min-h-[650px]">
          {/* Left side with image and testimonials (Estrutura mantida) */}
          <Grid item xs={12} lg={6} className="relative">
            <Suspense fallback={<Box className="h-[400px] md:h-[500px] lg:h-full w-full bg-gray-200 animate-pulse rounded-tr-xl rounded-bl-3xl" />}>
              <Box
                sx={{
                  height: { xs: '400px', md: '500px', lg: '100%' },
                  width: { xs: '100%', lg: '85%' },
                  position: 'relative',
                  marginLeft: { xs: 0, md: '2.5rem', lg: '5rem' },
                  zIndex: 20
                }}
                className="z-20 relative mx-auto"
              >
                <AnimatedBox
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  style={{ width: '100%', height: '100%', position: 'relative' }}
                >
                  <Box
                    sx={{
                      width: '100%', height: '100%', position: 'relative',
                      borderTopRightRadius: '0.75rem', borderBottomLeftRadius: '1.5rem',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src="/images/lugar.webp"
                      alt="Escritório Zanfer Imóveis em São João del Rei" // Alt text mais específico
                      className="object-cover w-full h-full"
                      style={{ objectFit: 'cover' }}
                    />
                    <Box className="absolute inset-0 bg-gradient-to-r from-preto/30 to-transparent" />
                  </Box>
                </AnimatedBox>

                {/* Testimonials positioned over the image (Estrutura mantida) */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: { xs: '-60px', sm: '-40px', md: '-20px' },
                    right: { xs: 0, sm: '-20px', md: '-40px', lg: '-60px' },
                    width: { xs: '90%', sm: '80%', md: '85%' },
                    zIndex: 30,
                  }}
                >
                  {/* Mapeia os testimonials atualizados */}
                  {testimonials.map((testimonial, index) => (
                    <TestimonialItem key={index} testimonial={testimonial} index={index} />
                  ))}
                </Box>
              </Box>
            </Suspense>
          </Grid>

          {/* Right side with content (Estrutura mantida) */}
          <Grid
            item
            xs={12}
            lg={6}
            sx={{
              display: 'flex', flexDirection: 'column',
              mt: { xs: '0px', sm: '100px', md: '120px', lg: '160px' },
              position: 'relative', zIndex: 20, pl: { lg: 4 }
            }}
          >
            <Box className="relative z-20">
              {/* Orange banner content area (Estrutura mantida) */}
              <Box
                sx={{
                  height: { xs: 'auto', md: '160px' }, display: 'flex',
                  flexDirection: 'column', justifyContent: 'center',
                  padding: 4, color: { xs: 'text.primary', md: 'white' },
                  bgcolor: { xs: 'transparent', md: 'transparent' }
                }}
              >
                <AnimatedBox
                  variants={fadeInUp} initial="hidden" whileInView="visible"
                  transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}
                >
                  {/* --- INÍCIO: CONTEÚDO ATUALIZADO --- */}
                  <Typography variant="h4" fontWeight="bold" className="font-montserrat text-re-text-main">Sua Referência em Imóveis em São João del Rei</Typography>
                  {/* --- FIM: CONTEÚDO ATUALIZADO --- */}
                </AnimatedBox>
              </Box>

              {/* Content area (Estrutura mantida) */}
              <Box p={2} flexGrow={1}>
                <AnimatedBox
                  variants={fadeInUp} initial="hidden" whileInView="visible"
                  transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}
                  style={{ marginBottom: "2rem" }}
                >
                  {/* --- INÍCIO: CONTEÚDO ATUALIZADO --- */}
                  <Typography variant="body1" color="textSecondary" paragraph className="font-poppins text-re-text-secondary">
                    Desde 2013, a Zanfer Imóveis se dedica a conectar pessoas aos melhores imóveis em São João del Rei e região. Seja para comprar, vender ou alugar, nossa equipe oferece um atendimento personalizado, baseado em anos de experiência e profundo conhecimento do mercado local.
                  </Typography>
                  <Typography variant="body1" color="textSecondary" className="font-poppins text-re-text-secondary">
                    Nossa missão é garantir segurança, transparência e a melhor negociação para você realizar seu sonho imobiliário.
                  </Typography>
                  {/* --- FIM: CONTEÚDO ATUALIZADO --- */}
                </AnimatedBox>

                {/* Bullet points (Estrutura mantida, texto atualizado) */}
                <Box className="space-y-3" mb={4}>
                  {/* --- INÍCIO: CONTEÚDO ATUALIZADO --- */}
                  <AnimatedBox
                    variants={fadeInUp} initial="hidden" whileInView="visible"
                    transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}
                    className="flex items-center"
                  >
                    <Box className="text-re-accent mr-1 flex"> {/* Ícone check */}
                      <FaCheckCircle />
                    </Box>
                    <Typography variant="body1" color="textSecondary" className="font-poppins text-re-text-secondary">Orientação completa em todas as fases da compra, venda ou locação.</Typography>
                  </AnimatedBox>

                  <AnimatedBox
                    variants={fadeInUp} initial="hidden" whileInView="visible"
                    transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}
                    className="flex items-center"
                  >
                     <Box className="text-re-accent mr-1 flex"> {/* Ícone check */}
                      <FaCheckCircle />
                    </Box>
                    <Typography variant="body1" color="textSecondary" className="font-poppins text-re-text-secondary">Ampla carteira de imóveis residenciais e comerciais na região.</Typography>
                  </AnimatedBox>

                  <AnimatedBox
                    variants={fadeInUp} initial="hidden" whileInView="visible"
                    transition={{ duration: 0.6, delay: 0.5 }} viewport={{ once: true }}
                    className="flex items-center"
                  >
                     <Box className="text-re-accent mr-1 flex"> {/* Ícone check */}
                      <FaCheckCircle />
                    </Box>
                    <Typography variant="body1" color="textSecondary" className="font-poppins text-re-text-secondary">Avaliações precisas e assessoria documental para sua segurança.</Typography>
                  </AnimatedBox>
                  {/* --- FIM: CONTEÚDO ATUALIZADO --- */}
                </Box>

                {/* Botão (Estrutura mantida) */}
                <AnimatedBox
                  variants={fadeInUp} initial="hidden" whileInView="visible"
                  transition={{ duration: 0.6, delay: 0.6 }} viewport={{ once: true }}
                  style={{ marginTop: 'auto' }}
                >
                  <Button
                    variant="contained"
                    className="bg-re-accent text-re-text-invert hover:bg-re-base px-4 py-1.5 rounded-lg font-medium font-poppins"
                    onClick={() => router.push('/imoveis')} // Mantém a navegação
                  >
                    Encontre Seu Imóvel Ideal
                  </Button>
                </AnimatedBox>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default memo(AboutUs);