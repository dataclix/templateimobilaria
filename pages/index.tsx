import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { NextSeo } from 'next-seo';
import { atom, useAtom } from 'jotai';
import { Skeleton, Box } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Component Imports
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: true, loading: () => <Skeleton variant="rectangular" height={60} width="100%" /> });
const Banner = dynamic(() => import('@/components/Bannner'), { ssr: true, loading: () => <Skeleton variant="rectangular" height={400} width="100%" /> });
const Categorias = dynamic(() => import('@/components/Categorias'), { ssr: true });
const Card = dynamic(() => import('@/components/Card'), { ssr: true, loading: () => <Skeleton variant="rectangular" height={300} /> });
const Sobre = dynamic(() => import('@/components/Sobre'), { ssr: false, loading: () => <Skeleton variant="rectangular" height={400} width="100%" /> });
const Corretores = dynamic(() => import('@/components/Corretores'), { ssr: true, loading: () => <Skeleton variant="rectangular" height={400} width="100%" /> });
const CallAction = dynamic(() => import('@/components/CallAction'), { ssr: false, loading: () => <Skeleton variant="rectangular" height={200} width="100%" /> });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false, loading: () => <Skeleton variant="rectangular" height={200} width="100%" /> });

// Globals e Tipos
import { url, urlSite } from '@/components/globals/variavels';
import { ImovelResumo } from '@/components/Card';
import Bannner2 from '@/components/Bannner2';
import Servicos from '@/components/Servicos';

// Constantes
const INITIAL_SKIP = 0;
const TAKE_COUNT = 12;

// Interfaces
interface Imoveis {
  imoveis: ImovelResumo[];
  total: number;
}

export interface FiltroProps {
  idInterno?: string;
  idEstado?: number[];
  idCidade?: number[];
  idBairro?: number[];
  modalidade?: string[];
  idTipo?: number[];
  idSubtipo?: number[];
  valorMin?: number;
  valorMax?: number;
  garagens?: number;
  banheiros?: number;
  quartos?: number;
  atributos?: string[];
  categoria?: string;
  page?: number;
  pageSize?: number;
}

// Atoms
export const filtrosAtom = atom<FiltroProps>({});
export const filtroSelecionadoAtom = atom(0);
export const termoBuscaAtom = atom('');
export const modalidadeAtom = atom('VENDA');

// Enum Categoria
enum Categoria {
  DESTAQUE = '5312002e-f39a-4ac1-837b-8053861d78e4'
}

// --- SEO Enhancement: Structured Data ---
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Imobiliária',
  description: 'Imobiliária especialista em compra, venda e aluguel de imóveis. Encontre casas, apartamentos, terrenos e mais.',
  url: urlSite,
  logo: `${urlSite}/images/reimoveis.webp`,
  image: `${urlSite}/images/reimoveis.webp`,
  telephone: '+553233715400',
  email: 'contato@imobiliaria.com.br',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rua Arthur Bernardes, 130',
    addressLocality: 'São João del-Rei',
    addressRegion: 'MG',
    postalCode: '36307-356',
    addressCountry: 'BR'
  },
  sameAs: [
    // "https://www.facebook.com/imobiliaria",
    // "https://www.instagram.com/imobiliaria/"
  ],
  areaServed: {
    '@type': 'Place',
    name: 'São João del-Rei'
  },
  priceRange: '$$$',
  hasMap: 'https://www.google.com/maps/'
};


const Home: React.FC = () => {
  // States
  const [isLoading, setIsLoading] = useState(true);
  const [modalidade, setModalidade] = useAtom(modalidadeAtom);
  const [imoveisMereceDestaque, setImoveisMereceDestaque] = useState<Imoveis>({ total: 0, imoveis: [] });
  const [imoveisAluguel, setImoveisAluguel] = useState<Imoveis>({ total: 0, imoveis: [] });
  const [imoveisVenda, setImoveisVenda] = useState<Imoveis>({ total: 0, imoveis: [] });

  // fetchProperties
  const fetchProperties = async (modalidadeType?: string[], categoriaType?: Categoria) => {
    try {
      if (!url) {
        console.error('A variável url está indefinida!');
        return { total: 0, imoveis: [] };
      }
      const requestConfig = {
        headers: { 'Content-Type': 'application/json' }
      };
      const payload: FiltroProps = {
        modalidade: modalidadeType,
        ...(categoriaType && { categoria: categoriaType }),
        page: 1,
        pageSize: TAKE_COUNT
      };
      const response = await axios.post(
        `${url}website/imovel/filtrar/skip/${INITIAL_SKIP}/take/${TAKE_COUNT}`,
        payload,
        requestConfig
      );
      const total = response.data && typeof response.data.total === 'number' ? response.data.total : 0;
      const imoveis = response.data && Array.isArray(response.data.imoveis) ? response.data.imoveis : [];
      return { total: total, imoveis: imoveis };
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message, error.code, error.config, error.response);
      } else if (error?.name === 'AbortError') {
        console.error('AbortError: A requisição foi abortada.', error);
      } else {
        console.error(`Erro desconhecido ao buscar imóveis (${modalidadeType?.join(', ')} ${categoriaType ? 'cat:'+categoriaType : ''}):`, error);
      }
      return { total: 0, imoveis: [] };
    }
  };

  // useEffect
  useEffect(() => {
    const loadProperties = async () => {
      setIsLoading(true);
      try {
        const [destaque, aluguel, venda] = await Promise.all([
          fetchProperties(['VENDA', 'ALUGUEL'], Categoria.DESTAQUE),
          fetchProperties(['ALUGUEL']),
          fetchProperties(['VENDA'])
        ]);
        setImoveisMereceDestaque(destaque);
        setImoveisAluguel(aluguel);
        setImoveisVenda(venda);
      } catch (error) {
        console.error("Erro ao carregar imóveis:", error);
         setImoveisMereceDestaque({ total: 0, imoveis: [] });
         setImoveisAluguel({ total: 0, imoveis: [] });
         setImoveisVenda({ total: 0, imoveis: [] });
      } finally {
        setIsLoading(false);
      }
    };
    loadProperties();
  }, []);

  // renderPropertySwiper - Modernizado para usar cores verdes e o novo design
  const renderPropertySwiper = (title: string, properties: Imoveis, sectionId: string) => (
    <section className="py-14 relative bg-re-bg" aria-labelledby={`${sectionId}-heading`}>
      <div className="sm:container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho redesenhado com estilo único */}
        <div className="mb-8 relative mx-[2%] sm:mx-[1%] md:mx-[1%] lg:mx-[1%]">
          {isLoading ? (
            <Box className="mb-6">
              <Skeleton variant="text" width={180} height={40} />
              <Skeleton variant="text" width={300} height={24} />
            </Box>
          ) : (
            <div className="border-l-4 border-[#2e7d32] pl-4 py-2">
              <div>
                <h2 id={`${sectionId}-heading`} className="text-2xl md:text-3xl font-bold relative text-re-text-main font-montserrat">
                  <span className="text-[#2e7d32]">{title}</span>
                  <div className="h-1 w-12 bg-[#4caf50] mt-1 rounded-full"></div>
                </h2>
                <p className="text-gray-600 mt-2 md:text-left max-w-xl text-re-text-secondary font-poppins">
                  Encontre o imóvel ideal para você e sua família, com as melhores condições do mercado
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={`relative properties-wrapper ${sectionId}-wrapper`} style={{ minHeight: '300px', zIndex: 1 }}>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={`skeleton-${sectionId}-${index}`} className="bg-white shadow-sm rounded-lg overflow-hidden">
                  <Skeleton variant="rectangular" height={200} style={{ width: '100%' }} />
                  <Box px={2} py={1}>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </Box>
                </div>
              ))}
            </div>
          ) : properties.imoveis.length > 0 ? (
            <>
              <Swiper
                className="swiper-imoveis"
                modules={[Navigation, Pagination]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                navigation
                pagination={{ clickable: true }}
                style={{ padding: '20px 0' }}
              >
                {properties.imoveis.slice(0, 12).map((imovel) => (
                  <SwiperSlide key={imovel.id}>
                    <div className="h-full mx-auto transition-all duration-300 ease-in-out flex justify-center">
                    <Card {...imovel} />
                  </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {properties.total > 12 && (
                <div className="mt-10 flex justify-center">
                  <Link href={`/imoveis?modalidade=${sectionId === 'aluguel' ? 'ALUGUEL' : 'VENDA'}`} legacyBehavior>
                    <a className="bg-re-accent text-re-text-invert hover:bg-re-base py-2.5 px-8 text-sm rounded-lg transition-colors duration-300 shadow-md inline-flex items-center">
                      Ver mais imóveis
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 ml-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 5l7 7-7 7" 
                        />
                      </svg>
                    </a>
                  </Link>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </section>
  );


  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <link rel="preload" href="/images/fundo.png" as="image" />
        <link rel="preload" href="/images/reimoveis.webp" as="image" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          key="realestateagent-jsonld"
        />
      </Head>

      <Suspense fallback={<Skeleton variant="rectangular" height={60} width="100%" />}>
        <Navbar />
      </Suspense>

      {/* SEO Enhancement: NextSeo Otimizado */}
      <NextSeo
        title="Imobiliária | Imóveis - Venda e Aluguel"
        description="Sua imobiliária especializada. Encontre casas, apartamentos, terrenos e outros imóveis para comprar ou alugar. Especialistas na região."
        openGraph={{
          url: urlSite,
          title: 'Imobiliária - Imóveis para Venda e Aluguel',
          description: 'Especialistas em compra, venda e aluguel de imóveis. Encontre seu imóvel ideal conosco!',
          images: [
            {
              url: `${urlSite}/images/og-image.jpg`,
              width: 1200,
              height: 630,
              alt: 'Imóveis - Imobiliária',
              type: 'image/jpeg',
            },
            {
              url: `${urlSite}/images/reimoveis.webp`,
              width: 800,
              height: 600,
              alt: 'Logo da Imobiliária',
              type: 'image/webp',
            },
          ],
          site_name: 'Imobiliária',
          locale: 'pt_BR',
          type: 'website',
        }}
        canonical={urlSite}
        twitter={{
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
          { name: 'theme-color', content: '#2e7d32' },
          { name: 'robots', content: 'index, follow' },
          { name: 'keywords', content: 'imóveis, imobiliária, casas à venda, apartamentos aluguel, terrenos, comprar imóvel, alugar imóvel' },
          { httpEquiv: 'content-type', content: 'text/html; charset=utf-8' },
        ]}
      />

      {/* H1 Visually Hidden para SEO */}
      <h1 className="sr-only">
        Imobiliária - Imóveis à Venda e para Aluguel
      </h1>

   
      
      {/* Filtro de busca - Elemento essencial para conversão */}
      <Suspense fallback={<Skeleton variant="rectangular" height={1200} width="100%" />}>
        <Banner />
      </Suspense>

      {/* Categorias de imóveis - Facilita navegação por tipo */}
      <Categorias/>
      
      {/* Serviços oferecidos - Apresenta diferenciais */}
      <Servicos/>

      {/* Listagem de imóveis */}
      <div className="px-[2%] sm:px-[0%] 2xl:px-[5%] 3xl:px-[10%]" style={{ minHeight: '300px' }}>
        {renderPropertySwiper('Imóveis para Venda', imoveisVenda, 'venda')}
        {renderPropertySwiper('Imóveis para Aluguel', imoveisAluguel, 'aluguel')}
      </div>
      
      {/* Equipe de corretores - Humaniza a experiência */}
      <Corretores />
      
      {/* Call to Action - Incentiva contato direto */}
      <Suspense fallback={<Skeleton variant="rectangular" height={200} width="100%" />}>
        <CallAction />
      </Suspense>
      
      {/* Rodapé */}
      <Suspense fallback={<Skeleton variant="rectangular" height={200} width="100%" />}>
        <Footer />
      </Suspense>

      {/* Estilos Globais */}
      <style jsx global>{`
        .properties-wrapper {
          padding: 28px 0;
          margin-bottom: 50px;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 640px) {
          .properties-wrapper {
            padding: 0 30px;
          }
        }
        /* Classe para H1 oculto visualmente mas acessível a leitores de tela e SEO */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        /* Novas classes para aplicar a nova paleta e fontes */
        /* Removido qualquer definição de bg-re-base, bg-re-accent, text-re-text-main, text-re-text-secondary, bg-re-bg, bg-re-bg-alt para não sobrescrever Tailwind */
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        /* Swiper exclusivo dos imóveis: botões para fora e centralização dos cards */
        .swiper-imoveis .swiper-button-next,
        .swiper-imoveis .swiper-button-prev {
          top: 50% !important;
          transform: translateY(-50%);
          background: #fff;
          color: #00D54B;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          box-shadow: 0 2px 8px rgba(0,213,75,0.10);
          z-index: 10;
        }
        .swiper-imoveis .swiper-button-next {
          right: -18px;
        }
        .swiper-imoveis .swiper-button-prev {
          left: -18px;
        }
        .swiper-imoveis .swiper-wrapper {
          align-items: center;
        }
        /* Swiper global: diminuir botões next/prev em todo o site */
        .swiper-button-next, .swiper-button-prev {
          width: 32px !important;
          height: 32px !important;
          min-width: 32px !important;
          min-height: 32px !important;
          max-width: 32px !important;
          max-height: 32px !important;
        }
        /* Desce apenas as bolinhas do swiper-imoveis, sem afetar overflow dos cards */
        .swiper-imoveis .swiper-pagination {
          position: relative !important;
          bottom: auto !important;
          margin-top: 32px !important;
          z-index: 2;
        }
      `}</style>
    </div>
  );
};

export default Home;