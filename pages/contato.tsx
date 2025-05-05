import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Container,
  Grid,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Paper,
  IconButton
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SubjectIcon from '@mui/icons-material/Subject';
import MessageIcon from '@mui/icons-material/Message';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { urlSite } from '@/components/globals/variavels';

// Interfaces
interface ContactItem {
  label: string;
  value: string;
  link?: string;
  icon: React.ReactNode;
}

interface ContactSection {
  category: string;
  title: string;
  content: ContactItem[];
}

// Dados de Contato
const contactInfo: ContactSection[] = [
  {
    category: "Nosso Endereço",
    title: "Localização",
    content: [
      {
        label: "Endereço",
        value: "Avenida Tiradentes, 475\nCentro\nSão João del Rei - MG, CEP: 36307-330",
        icon: <LocationOnIcon sx={{ color: 'var(--re-accent)' }} />
      }
    ]
  },
  {
    category: "Canais de Atendimento",
    title: "Telefones",
    content: [
      {
        label: "Telefone Fixo",
        value: "(32) 3371-8800",
        icon: <LocalPhoneIcon sx={{ color: 'var(--re-accent)' }} />
      },
      {
        label: "WhatsApp",
        value: "(32) 9 9942-8800",
        link: "https://wa.me/5532999428800",
        icon: <WhatsAppIcon sx={{ color: 'var(--re-accent)' }} />
      }
    ]
  },
  {
    category: "Outros Contatos",
    title: "Contatos",
    content: [
      {
        label: "E-mail",
        value: "contato@reimoveis.com",
        link: "mailto:contato@reimoveis.com",
        icon: <EmailIcon sx={{ color: 'var(--re-accent)' }} />
      }
    ]
  },
  {
    category: "Redes Sociais",
    title: "Redes",
    content: [
      {
        label: "Instagram",
        value: "@refinanceira",
        link: "https://www.instagram.com/refinanceira/",
        icon: <InstagramIcon sx={{ color: 'var(--re-accent)' }} />
      }
    ]
  }
];

// SEO Enhancement: Structured Data
const canonicalUrl = `${urlSite}/contato`;

const structuredDataContact = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'RE Imóveis',
  description: 'Entre em contato com a RE Imóveis. Endereço, telefones (WhatsApp e Fixo), email e redes sociais.',
  url: urlSite,
  logot: `${urlSite}/images/reimoveis.webp`,
  image: `${urlSite}/images/og-image.jpg`,
  telephone: [
    '+553233718800',
    '+5532999428800'
  ],
  email: 'contato@reimoveis.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Avenida Tiradentes, 475',
    addressLocality: 'São João del Rei',
    addressRegion: 'MG',
    postalCode: '36307-330',
    addressCountry: 'BR'
  },
  sameAs: [
    'https://www.instagram.com/refinanceira/'
  ],
  areaServed: {
    '@type': 'Place',
    name: 'Região atendida'
  },
  hasMap: 'https://www.google.com/maps/place/Avenida+Tiradentes,+475+-+Centro,+São+João+del+Rei+-+MG,+36307-330',
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Início",
        "item": urlSite
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Contato"
      }
    ]
};

// Animações
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8,
      ease: [0.6, 0.05, 0.01, 0.9]
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

interface ContactFormState {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}

const Contato: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const initialFormState: ContactFormState = {
    nome: '',
    email: '',
    assunto: '',
    mensagem: '',
  };
  
  const [formState, setFormState] = useState<ContactFormState>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de envio
    setTimeout(() => {
      setSnackbarMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setFormState(initialFormState);
      setLoading(false);
    }, 2000);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box className="min-h-screen flex flex-col font-nunito bg-white">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataContact) }}
          key="realestateagent-contact-jsonld"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          key="breadcrumb-contact-jsonld"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <NextSeo
        title="Contato - RE Imóveis | Fale Conosco"
        description="Entre em contato com a RE Imóveis. Encontre nosso endereço, telefones (WhatsApp e Fixo), email e redes sociais. Estamos prontos para ajudar!"
        canonical={canonicalUrl}
        openGraph={{
          url: canonicalUrl,
          title: "Contato - RE Imóveis",
          description: "Precisa falar conosco? Acesse nossos canais de atendimento: WhatsApp, email, telefone, endereço e redes sociais.",
          images: [
            {
              url: `${urlSite}/images/og-image.jpg`,
              width: 1200,
              height: 630,
              alt: 'Entre em Contato com a RE Imóveis',
              type: 'image/jpeg',
            },
            {
              url: `${urlSite}/images/reimoveis.webp`,
              width: 800,
              height: 600,
              alt: 'logot da RE Imóveis',
              type: 'image/webp',
            },
          ],
          site_name: 'RE Imóveis',
          locale: 'pt_BR',
          type: 'profile',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
          { name: 'robots', content: 'index, follow' },
          { name: 'keywords', content: 'contato RE Imóveis, telefone RE Imóveis, whatsapp RE Imóveis, endereço RE Imóveis, email RE Imóveis, RE Imóveis contato' },
          { httpEquiv: 'content-type', content: 'text/html; charset=utf-8' },
        ]}
      />

      <Navbar />

      {/* Hero Section */}
      <Box 
        className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center"
        sx={{ 
          background: 'linear-gradient(135deg, var(--re-base) 0%, #1a2c38 100%)',
        }}
      >
        <Box 
          className="absolute inset-0 z-0" 
          sx={{
            backgroundImage: 'url("/images/imobiliara.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'soft-light',
            backgroundColor: 'rgba(199, 176, 128, 0.7)',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(199, 176, 128, 0.6) 0%, rgba(44, 62, 80, 0.8) 100%)',
              mixBlendMode: 'normal',
            }
          }}
        />
        
        <Container maxWidth="lg" className="relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center"
          >
            <Typography 
              variant="h1" 
              component="h1"
              sx={{
                color: 'white',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                mb: 2,
                textShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              Fale Conosco
            </Typography>
            
            <Typography 
              variant="h5" 
              component="h2"
              sx={{
                color: 'white',
                fontSize: { xs: '1rem', md: '1.25rem' },
                fontWeight: 400,
                maxWidth: '800px',
                mx: 'auto',
                opacity: 0.9,
                lineHeight: 1.5
              }}
            >
              Estamos prontos para atender suas necessidades imobiliárias em toda a região.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Main Content */}
      <Box 
        className="relative z-10 -mt-10 md:-mt-16 pb-24"
        sx={{ 
          background: 'linear-gradient(to bottom, var(--re-bg-alt), var(--re-bg))',
        }}
      >
        <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 10 }, mb: 10 }}>
          <Paper 
            elevation={10}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
            }}
          >
            <Grid container>
              {/* Left Side - Contact Info */}
              <Grid item xs={12} md={5} 
                sx={{ 
                  background: 'linear-gradient(135deg, var(--re-base) 0%, #1a2c38 100%)',
                  color: 'white',
                  position: 'relative',
                }}
              >
                <Box 
                  className="p-6 md:p-10 h-full" 
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="relative z-10"
                  >
                    <motion.div variants={fadeInUp}>
                      <Typography variant="h4" fontWeight={700} mb={4} sx={{ color: 'var(--re-accent)' }}>
                        Informações de Contato
                      </Typography>
                      
                      <Typography variant="body1" sx={{ color: '#C7B080', opacity: 0.85, mb: 5 }}>
                        Utilize qualquer um dos nossos canais de atendimento abaixo para nos contatar. Estamos disponíveis para atendê-lo.
                      </Typography>
                    </motion.div>

                    <Box sx={{ mt: 4 }}>
                      {/* Contact Cards */}
                      <motion.div variants={fadeInUp} className="mb-6">
                        <Box 
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2
                          }}
                        >
                          <Box 
                            sx={{ 
                              backgroundColor: 'rgba(199, 176, 128, 0.2)',
                              borderRadius: '50%',
                              width: 42,
                              height: 42,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2
                            }}
                          >
                            <LocationOnIcon sx={{ color: 'var(--re-accent)' }} />
                          </Box>
                          
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'var(--re-accent)' }}>
                              Endereço
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#C7B080', opacity: 0.9, whiteSpace: 'pre-line' }}>
                              {contactInfo[0].content[0].value}
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>

                      <motion.div variants={fadeInUp} className="mb-6">
                        <Box 
                          component="a"
                          href="tel:3233718800"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                            textDecoration: 'none',
                            color: '#C7B080',
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          <Box 
                            sx={{ 
                              backgroundColor: 'rgba(199, 176, 128, 0.2)',
                              borderRadius: '50%',
                              width: 42,
                              height: 42,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2
                            }}
                          >
                            <LocalPhoneIcon sx={{ color: 'var(--re-accent)' }} />
                          </Box>
                          
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'var(--re-accent)' }}>
                              Telefone Fixo
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'var(--re-accent)', opacity: 0.9 }}>
                              {contactInfo[1].content[0].value}
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>

                      <motion.div variants={fadeInUp} className="mb-6">
                        <Box 
                          component="a"
                          href={contactInfo[1].content[1].link}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                            textDecoration: 'none',
                            color: '#C7B080',
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          <Box 
                            sx={{ 
                              backgroundColor: 'rgba(199, 176, 128, 0.2)',
                              borderRadius: '50%',
                              width: 42,
                              height: 42,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2
                            }}
                          >
                            <WhatsAppIcon sx={{ color: 'var(--re-accent)' }} />
                          </Box>
                          
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'var(--re-accent)' }}>
                              WhatsApp
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'var(--re-accent)', opacity: 0.9 }}>
                              {contactInfo[1].content[1].value}
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>

                      <motion.div variants={fadeInUp} className="mb-6">
                        <Box 
                          component="a"
                          href={contactInfo[2].content[0].link}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                            textDecoration: 'none',
                            color: '#C7B080',
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          <Box 
                            sx={{ 
                              backgroundColor: 'rgba(199, 176, 128, 0.2)',
                              borderRadius: '50%',
                              width: 42,
                              height: 42,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2
                            }}
                          >
                            <EmailIcon sx={{ color: 'var(--re-accent)' }} />
                          </Box>
                          
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'var(--re-accent)' }}>
                              Email
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'var(--re-accent)', opacity: 0.9 }}>
                              {contactInfo[2].content[0].value}
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>
                    </Box>

                    {/* Social Media */}
                    <Box sx={{ mt: 8 }}>
                      <motion.div variants={fadeInUp}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#C7B080', mb: 2 }}>
                          Redes Sociais
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <IconButton 
                            component="a"
                            href={contactInfo[3].content[0].link}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ 
                              backgroundColor: 'rgba(199, 176, 128, 0.2)',
                              '&:hover': {
                                backgroundColor: 'var(--re-accent)',
                              }
                            }}
                          >
                            <InstagramIcon sx={{ color: 'white' }} />
                          </IconButton>
                        </Box>
                      </motion.div>
                    </Box>
                  </motion.div>

                  {/* Background Pattern */}
                  <Box 
                    className="absolute bottom-0 right-0 opacity-10 w-full h-full"
                    sx={{
                      backgroundImage: 'url("/images/imobiliara.webp")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      mixBlendMode: 'overlay',
                      backgroundColor: 'rgba(199, 176, 128, 0.05)',
                    }}
                  />
                </Box>
              </Grid>
              
              {/* Right Side - Contact Form */}
              <Grid item xs={12} md={7}>
                <Box className="p-6 md:p-12">
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                  >
                    <Typography variant="h4" fontWeight={700} mb={1} color="text.primary">
                      Envie uma mensagem
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" mb={4}>
                      Preencha o formulário abaixo para enviar uma mensagem diretamente para nossa equipe.
                    </Typography>
                    
                    <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Nome completo"
                            name="nome"
                            value={formState.nome}
                            onChange={handleFormChange}
                            variant="outlined"
                            required
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'var(--re-accent)',
                                },
                              },
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formState.email}
                            onChange={handleFormChange}
                            variant="outlined"
                            required
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailOutlinedIcon sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'var(--re-accent)',
                                },
                              },
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Assunto"
                            name="assunto"
                            value={formState.assunto}
                            onChange={handleFormChange}
                            variant="outlined"
                            required
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SubjectIcon sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'var(--re-accent)',
                                },
                              },
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Mensagem"
                            name="mensagem"
                            value={formState.mensagem}
                            onChange={handleFormChange}
                            variant="outlined"
                            multiline
                            rows={4}
                            required
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                  <MessageIcon sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'var(--re-accent)',
                                },
                              },
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            fullWidth
                            sx={{
                              py: 1.5,
                              backgroundColor: 'var(--re-accent)',
                              color: 'white',
                              borderRadius: 2,
                              fontWeight: 600,
                              '&:hover': {
                                backgroundColor: 'var(--re-base)',
                              },
                              '&:disabled': {
                                backgroundColor: 'rgba(199, 176, 128, 0.6)',
                                color: 'white',
                              },
                            }}
                            endIcon={loading ? null : <ArrowForwardIcon />}
                          >
                            {loading ? (
                              <>
                                <CircularProgress size={24} thickness={5} sx={{ mr: 1, color: 'white' }} />
                                Enviando...
                              </>
                            ) : (
                              'Enviar Mensagem'
                            )}
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </motion.div>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Map Section */}
          <Box sx={{ mt: 10 }}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <Typography variant="h4" fontWeight={700} mb={4} textAlign="center" color="text.primary">
                Nossa Localização
              </Typography>
              
              <Paper 
                elevation={6}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  height: '450px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
                }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.4141632650485!2d-44.26134132474044!3d-21.13590998054028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa1c8903f414ff9%3A0x5fe82e32d9dd5ce0!2sAv.%20Tiradentes%2C%20475%20-%20Centro%2C%20S%C3%A3o%20Jo%C3%A3o%20del%20Rei%20-%20MG%2C%2036307-346!5e0!3m2!1spt-BR!2sbr!4v1744911083619!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa de localização da RE Imóveis"
                />
              </Paper>
            </motion.div>
          </Box>
          
          {/* CRECI Info */}
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <Typography variant="h5" fontWeight={700} sx={{ color: 'var(--re-accent)' }}>
                RE Imóveis
              </Typography>
              <Typography variant="subtitle1" fontWeight={600} color="text.secondary" sx={{ mt: 1 }}>
                CRECI/PJ: 00000
              </Typography>
            </motion.div>
          </Box>
        </Container>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default Contato;