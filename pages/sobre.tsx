import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Avatar, 
  Divider,
  Card, 
  CardContent,
  useMediaQuery,
  useTheme
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { urlSite } from '@/components/globals/variavels';

// Layout components
import HeroBanner from '@/components/HeroBanner';
import MissaoVisaoValores from '@/components/MissaoVisaoValores';
import Historia from '@/components/Historia';
import Diferenciais from '@/components/Diferenciais';
import Corretores from '@/components/Corretores';
import Depoimentos from '@/components/Depoimentos';
import CallAction from '@/components/CallAction';

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

// SEO Enhancement: Structured Data
const canonicalUrl = `${urlSite}/sobre`;

// Schema.org structured data
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  'name': 'Imobiliária',
  'description': 'Desde 2005, somos referência em soluções imobiliárias. Com uma equipe de profissionais especializados, oferecemos os melhores imóveis para compra, venda e locação.',
  'url': urlSite,
  'logot': `${urlSite}/images/reimoveis.webp`,
  'image': `${urlSite}/images/og-image.jpg`,
  'telephone': [
    '+553299999999',
    '+553299999999'
  ],
  'email': 'contato@imobiliaria.com',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': 'Rua Exemplo, 123',
    'addressLocality': 'Cidade Exemplo',
    'addressRegion': 'MG',
    'postalCode': '99999-999',
    'addressCountry': 'BR'
  },
  'foundingDate': '2005',
  'founder': {
    '@type': 'Person',
    'name': 'Nome do Fundador',
  },
  'areaServed': {
    '@type': 'Place',
    'name': 'Região atendida'
  },
  'sameAs': [
    'https://www.instagram.com/imobiliaria/',
    'https://www.facebook.com/imobiliaria/'
  ]
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
      "name": "Sobre Nós"
    }
  ]
};

// Dados da equipe
const teamMembers = [
  {
    name: 'Marcos Zanfer',
    role: 'Diretor | CRECI-MG 25478',
    image: '/images/team/diretor.webp',
    description: 'Fundador da Zanfer Imóveis, com mais de 20 anos de experiência no mercado imobiliário de São João del-Rei.'
  },
  {
    name: 'Ana Cláudia',
    role: 'Gerente Comercial | CRECI-MG 35921',
    image: '/images/team/gerente.webp',
    description: 'Especialista em vendas de alto padrão, trabalha há 15 anos no mercado imobiliário.'
  },
  {
    name: 'Carlos Eduardo',
    role: 'Consultor de Locação | CRECI-MG 42689',
    image: '/images/team/consultor.webp',
    description: 'Atua no mercado de locação há 10 anos, com foco em residências e imóveis comerciais.'
  }
];

// Dados dos diferenciais
const diferenciais = [
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
    description: 'Somos especialistas em São João del-Rei e região, conhecendo profundamente as características de cada bairro e localidade.'
  }
];

// Depoimentos
const testimonials = [
  {
    name: 'Rodrigo Almeida',
    position: 'Comprador',
    testimonial: 'A Zanfer Imóveis foi fundamental na compra do meu primeiro apartamento. O atendimento foi excepcional do início ao fim.',
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
    testimonial: 'Aluguei meu ponto comercial com toda a segurança e tranquilidade. Recomendo os serviços da Zanfer para todos.',
    image: '/images/testimonials/client3.webp'
  }
];

const Sobre: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box className="min-h-screen flex flex-col font-poppins bg-re-accent">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          key="organization-jsonld"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          key="breadcrumb-jsonld"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <NextSeo
        title="Sobre a Imobiliária | Sua Imobiliária de Confiança"
        description="Conheça a história, missão e valores da nossa Imobiliária, referência em compra, venda e locação de imóveis desde 2005."
        canonical={canonicalUrl}
        openGraph={{
          url: canonicalUrl,
          title: "Sobre a Imobiliária | Referência Imobiliária",
          description: "Desde 2005, oferecemos soluções imobiliárias com excelência e atendimento personalizado.",
          images: [
            {
              url: `${urlSite}/images/og-image.jpg`,
              width: 1200,
              height: 630,
              alt: 'Imobiliária - Sua Imobiliária de confiança',
              type: 'image/jpeg',
            },
            {
              url: `${urlSite}/images/reimoveis.webp`,
              width: 800,
              height: 600,
              alt: 'logot da Imobiliária',
              type: 'image/webp',
            },
          ],
          site_name: 'Imobiliária',
          locale: 'pt_BR',
          type: 'profile',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
          { name: 'robots', content: 'index, follow' },
          { name: 'keywords', content: 'imobiliária, sobre, história imobiliária, equipe imobiliária, diferenciais imobiliária, comprar imóvel, alugar imóvel' },
          { httpEquiv: 'content-type', content: 'text/html; charset=utf-8' },
        ]}
      />

      <Navbar />

      {/* Hero Banner Section */}
      <HeroBanner 
        title="Sobre Nossa Imobiliária" 
        subtitle="Desde 2005 realizando sonhos imobiliários e transformando vidas através de negócios sólidos e seguros" 
      />

      {/* Main Content */}
      <Box 
        className="relative z-10 -mt-16 pb-24"
        sx={{ 
          background: 'linear-gradient(to bottom, #f2f7f2, #ffffff)',
          pt: { xs: 10, md: 16 }
        }}
      >
        <Container maxWidth="lg">
          {/* Quem Somos */}
          <Paper 
            elevation={10}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
            }}
          >
            <Grid container>
              <Grid item xs={12} md={6} 
                sx={{ 
                  position: 'relative',
                  minHeight: { xs: '300px', md: 'auto' }
                }}
              >
                <Box 
                  sx={{ 
                    position: { xs: 'relative', md: 'absolute' },
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: { xs: '300px', md: '100%' },
                    width: '100%'
                  }}
                >
                  <Image
                    src="/images/imobiliara.webp"
                    alt="Escritório da Imobiliária"
                    fill
                    style={{ objectFit: 'cover' }}
                    quality={90}
                    priority
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box className="p-6 md:p-12 bg-re-bg-alt rounded-lg shadow-lg">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <Typography 
                      variant="h3" 
                      component="h2" 
                      className="mb-6 text-re-text-main font-montserrat"
                    >
                      Quem Somos
                    </Typography>
                    
                    <Typography variant="body1" paragraph className="text-re-text-secondary font-poppins">
                      A RE Imóveis nasceu para inovar o mercado imobiliário de São João del Rei e região, trazendo uma proposta moderna, transparente e próxima do cliente. Nossa missão é conectar pessoas aos melhores imóveis, com soluções ágeis e atendimento humano em todas as etapas.
                    </Typography>
                    
                    <Typography variant="body1" paragraph className="text-re-text-secondary font-poppins">
                      Localizada na Avenida Tiradentes, 475 - Centro, a RE Imóveis compartilha o mesmo endereço da RE Financeira, atuando de forma integrada para facilitar a vida de quem busca realizar sonhos, investir ou encontrar novas oportunidades.
                    </Typography>
                    
                    <Typography variant="body1" paragraph className="text-re-text-secondary font-poppins">
                      Nossa equipe é formada por profissionais preparados, apaixonados pelo que fazem e atentos às tendências do setor. Mesmo sendo uma empresa jovem, acreditamos que o futuro se constrói com confiança, tecnologia e foco total na experiência do cliente.
                    </Typography>

                    <Box 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        mt: 4,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: 'var(--tw-color-re-bg-alt, #F9FAFB)',
                        border: '1px solid var(--tw-color-re-border, #E5E7EB)',
                        boxShadow: '0px 2px 5px rgba(0,0,0,0.03)'
                      }}
                    >
                      <LocationOnIcon sx={{ color: 'var(--tw-color-re-accent, #C7B080)', mr: 2, fontSize: 28 }} />
                      <Typography variant="body2" sx={{ color: 'var(--tw-color-re-text-main, #2D3F42)' }}>
                        <strong>Endereço:</strong> Avenida Tiradentes, 475 - Centro, São João del Rei - MG, CEP: 36307-330
                      </Typography>
                    </Box>
                  </motion.div>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Missão, Visão e Valores */}
          <MissaoVisaoValores />

          {/* Nossa História */}
          <Historia />

        </Container>

        {/* Nossa Equipe - fora do Container para largura total */}
        <div
          style={{
            width: '100vw',
            position: 'relative',
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw',
            paddingLeft: 0,
            paddingRight: 0,
            overflow: 'visible'
          }}
        >
          <div style={{
            paddingLeft: 0,
            paddingRight: 0
          }}>
            <Corretores />
          </div>
        </div>

        {/* CTA - Call to Action */}
        <div className="mx-0 container-">
          <CallAction />
        </div>
      </Box>

      <Footer />
      <style jsx global>{`
        .swiper-corretores {
          overflow: visible !important;
        }
        .swiper-corretores .swiper-wrapper {
          overflow: visible !important;
        }
        .swiper-corretores .swiper-button-next,
        .swiper-corretores .swiper-button-prev {
          width: 32px !important;
          height: 32px !important;
          min-width: 32px !important;
          min-height: 32px !important;
          max-width: 32px !important;
          max-height: 32px !important;
          background: #fff !important;
          border: 2px solid #00D54B !important;
          border-radius: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 1 !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          z-index: 20;
        }
        .swiper-corretores .swiper-button-next:after,
        .swiper-corretores .swiper-button-prev:after {
          color: #00D54B !important;
          font-size: 1.4rem !important;
          font-weight: bold !important;
        }
        .swiper-corretores .swiper-button-next {
          right: -24px !important;
        }
        .swiper-corretores .swiper-button-prev {
          left: -24px !important;
        }
      `}</style>
    </Box>
  );
};

export default Sobre;
