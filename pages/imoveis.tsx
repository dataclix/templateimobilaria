import React, { useState, useEffect, Suspense, startTransition, lazy } from "react";
import axios from "axios";
import Card from "@/components/Card";
import { url, urlSite } from "@/components/globals/variavels";
import { NextSeo } from "next-seo"; // <-- Já estava importado, agora será configurado
import { atom, useAtom } from "jotai";
import { Skeleton, Stack, Box } from "@mui/material"; // Mantido original
import FiltroLateral from "@/components/FiltroLateral";
import Filtro2 from "@/components/Filtro2"; // <-- Mantido como no seu código original
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Head from "next/head"; // <-- SEO: Importado

const Footer = lazy(() => import("../components/Footer"));

// Constantes (Mantidas como no seu código original)
const INITIAL_SKIP = 0;
const TAKE_COUNT = 21;

// Interfaces (Mantidas como no seu código original)
export interface ImovelResumo {
  id: string;
  idInterno: number;
  titulo: string;
  categoria: {
    nome: string;
    cor: string;
  };
  bairro: string;
  cidade: string;
  estado: string;
  estadoSigla: string;
  valor: number;
  quartos: number | null;
  banheiros: number | null;
  garagens: number | null;
  areaConstruida: number | null;
  areaTerreno: number | null;
  modalidade: string;
  fotos: string[];
  captador: {
    nome: string;
    foto?: string;
  };
  permuta: boolean;
  tipo: string;
  subtipo: string;

  exibirDetalhesEnderecoSite: boolean;
  numero: string;
  complemento: string | null;
  logradouro: string;
}

interface Imoveis {
  imoveis: ImovelResumo[];
  total: number;
}

export interface FiltroProps {
  idInterno?: string;
  idEstado?: number[];
  idCidade?: number[];
  idBairro?: number[];
  // Deixando como estava no original - pode ser string[] ou string
  modalidade?: string[] | string;
  idTipo?: number[];
  idSubtipo?: number[];
  valorMin?: number;
  valorMax?: number;
  garagens?: number;
  banheiros?: number;
  quartos?: number;
  atributos?: string[];
  categoria?: string;
}

// Atoms (Mantidos como no seu código original)
export const filtrosAtom = atom<FiltroProps>({});
export const filtroSelecionadoAtom = atom(0);
export const termoBuscaAtom = atom("");
export const modalidadeAtom = atom("VENDA");
export const openFiltroLateralAtom = atom(false);


const Imoveis: React.FC = () => {
  // States (Mantidos como no seu código original)
  const [imoveis, setImoveis] = useState<Imoveis>({ total: 0, imoveis: [] });
  const [skip, setSkip] = useState(INITIAL_SKIP);
  const [totalImoveis, setTotalImoveis] = useState(0);
  const [filtros, setFiltros] = useAtom(filtrosAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [modalidade, setModalidade] = useAtom(modalidadeAtom);
  const skeletonArray = Array.from({ length: TAKE_COUNT }, (_, index) => index);
  const router = useRouter();
  // Mantido query e adicionado asPath para canonical URL
  const { query, asPath } = router;

  // useEffect #1 (Query Sync - MANTIDO EXATAMENTE IGUAL AO ORIGINAL)
  useEffect(() => {
    // Adicionado router.isReady para segurança, mas lógica interna idêntica
    if (router.isReady && Object.keys(query).length > 0) {
      // Conversão direta mantida como no original
      setFiltros(query as FiltroProps);

      // Lógica de atualização da modalidade mantida como no original
      if (query.modalidade && typeof query.modalidade === 'string') {
        // Normalização para maiúsculas adicionada para robustez (sem impacto funcional se já for maiúsculo)
        const queryModalidade = query.modalidade.toUpperCase();
        if ((queryModalidade === 'VENDA' || queryModalidade === 'ALUGUEL')) {
          setModalidade(queryModalidade);
        }
      }
    }
    // Dependências originais mantidas + router.isReady
  }, [query, setFiltros, setModalidade, router.isReady]);

  // useEffect #2 (Data Fetching - MANTIDO EXATAMENTE IGUAL AO ORIGINAL)
  useEffect(() => {
    const buscarImoveis = async () => {
      setIsLoading(true);
      try {
        // Request mantido idêntico
        const response = await axios.post<Imoveis>(
          `${url}website/imovel/filtrar/skip/${skip}/take/${TAKE_COUNT}`,
          {
            idInterno: filtros?.idInterno,
            idEstado: filtros?.idEstado,
            idCidade: filtros?.idCidade,
            idBairro: filtros?.idBairro,
            modalidade: [modalidade], // Uso de [modalidade] mantido
            idTipo: filtros?.idTipo,
            idSubtipo: filtros?.idSubtipo,
            valorMin: filtros?.valorMin,
            valorMax: filtros?.valorMax,
            garagens: filtros?.garagens,
            banheiros: filtros?.banheiros,
            quartos: filtros?.quartos,
            atributos: filtros?.atributos,
            categoria: filtros?.categoria,
          }
        );

        // Ajuste de dados mantido idêntico
        const adjustedImoveis = response.data.imoveis.map((imovel) => ({
          ...imovel,
          tipo: imovel.tipo,
        }));

        // Atualização de estado mantida idêntica
        startTransition(() => {
          setImoveis((prevImoveis) => ({
            total: response.data.total,
            imoveis:
              skip === 0
                ? adjustedImoveis
                : [...prevImoveis.imoveis, ...adjustedImoveis],
          }));
          setTotalImoveis(response.data.total);
        });
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
        // Tratamento de erro mantido como no original (sem reset explícito no catch)
      } finally {
        setIsLoading(false);
      }
    };

    // Condição de execução mantida como no original (implícita pelo array de dependências)
    // Adicionado router.isReady para evitar busca antes da query ser processada
    if(router.isReady) {
      buscarImoveis();
    }
    // Dependências originais mantidas + router.isReady
  }, [filtros, modalidade, skip, router.isReady]);

  // carregarMaisImoveis (Mantido como no seu código original)
  const carregarMaisImoveis = () => {
    // Adicionado !isLoading para evitar cliques múltiplos
    if (!isLoading) {
      setSkip(skip + TAKE_COUNT);
    }
  };

  // --- SEO Content Generation (usado apenas nos metadados) ---
  const pageTitleBase = `Imóveis para ${modalidade === 'VENDA' ? 'Comprar' : 'Alugar'}`;
  const pageTitle = `${pageTitleBase} em São João del-Rei | Zanfer Imóveis`;
  const pageDescription = `Lista de imóveis para ${modalidade === 'VENDA' ? 'comprar' : 'alugar'} em São João del-Rei, MG. Encontre casas, apartamentos, terrenos e mais. Filtre sua busca na Zanfer Imóveis.`;
  const canonicalUrl = `${urlSite}${asPath}`;

  // --- Structured Data Generation ---
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
        "name": `Imóveis ${modalidade === 'VENDA' ? 'à Venda' : 'para Alugar'}`
      }
    ]
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": pageTitleBase,
    "description": `Lista de imóveis para ${modalidade === 'VENDA' ? 'venda' : 'aluguel'} em São João del-Rei filtrados.`,
    "url": canonicalUrl,
    "numberOfItems": totalImoveis,
    "itemListElement": (!isLoading && imoveis.imoveis.length > 0) ? imoveis.imoveis.map((imovel, index) => ({
      "@type": "ListItem",
      "position": skip + index + 1, // Posição absoluta aproximada
      "name": imovel.titulo || `${imovel.tipo} em ${imovel.bairro || imovel.cidade}`,
      "url": `${urlSite}/imovel/${imovel.idInterno || imovel.id}` // **VERIFICAR ESTRUTURA URL**
    })) : []
  };
  // --- Fim SEO Enhancements ---

  return (
    // Estrutura principal mantida
    <div className="bg-bege min-h-[100vh]">
      {/* --- SEO Enhancements Adicionados Aqui --- */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          key="breadcrumb-imoveis-jsonld"
        />
        {itemListSchema.itemListElement.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            key="itemlist-imoveis-jsonld"
          />
        )}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <NextSeo
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
        openGraph={{
          url: canonicalUrl,
          title: pageTitle,
          description: pageDescription,
          images: [
            { // Imagem OG Genérica - SUBSTITUA/VERIFIQUE
              url: `${urlSite}/images/og-image-listagem.jpg`,
              width: 1200,
              height: 630,
              alt: `Imóveis para ${modalidade === 'VENDA' ? 'Comprar' : 'Alugar'} em São João del-Rei - Zanfer Imóveis`,
              type: 'image/jpeg',
            },
            { // logot fallback
              url: `${urlSite}/images/zanfer-logot.webp`, // VERIFIQUE O CAMINHO
              width: 800,
              height: 600,
              alt: 'logot Zanfer Imóveis',
              type: 'image/webp',
            },
          ],
          site_name: 'Zanfer Imóveis',
          locale: 'pt_BR',
          type: 'website',
        }}
        twitter={{
          // handle: '@zanferimoveis', // SUBSTITUA
          // site: '@zanferimoveis',   // SUBSTITUA
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }, // Usando viewport padrão
          { name: 'robots', content: 'index, follow' },
          { name: 'keywords', content: `imóveis ${modalidade === 'VENDA' ? 'venda' : 'aluguel'} são joão del rei, ${modalidade === 'VENDA' ? 'comprar' : 'alugar'} imóvel são joão del rei, casas, apartamentos, terrenos, zanfer imóveis, imobiliária sjdr` },
          { httpEquiv: 'content-type', content: 'text/html; charset=utf-8' },
        ]}
      />

      {/* --- SEO: H1 Visually Hidden --- */}
      {/* Este H1 NÃO será visível na página */}
      <h1 className="sr-only">
        {pageTitleBase} em São João del-Rei - Lista de Imóveis Zanfer
      </h1>
      {/* --- Fim SEO Enhancements --- */}


      {/* Navbar mantida */}
      <Navbar />

      {/* Div target mantida */}
      <div id="target-section" className="relative bottom-16"></div>
      
      {/* Título da seção e contador de resultados */}
      <div className="w-full bg-white py-3   mt-20  ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-black font-poppins mx-auto text-center">
            {modalidade === 'VENDA' ? 'Imóveis à Venda' : 'Imóveis para Alugar'}
          </h2>
        </div>
      </div>

      {/* Grid principal - INVERTIDO (filtro à direita, imóveis à esquerda) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Coluna dos Imóveis (agora à esquerda - 3 colunas) */}
          <main className="col-span-1 lg:col-span-3 lg:order-1 order-2">
            {/* Cabeçalho de resultados */}
            {!isLoading && imoveis.imoveis.length > 0 && (
              <div className="mb-6 flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <span className="text-re-text-main">
                  Mostrando <span className="font-semibold">{Math.min(imoveis.imoveis.length, totalImoveis)}</span> de <span className="font-semibold">{totalImoveis}</span> {totalImoveis === 1 ? 'imóvel' : 'imóveis'}
                </span>
              </div>
            )}
            
            {/* Grid de cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mx-auto justify-items-center">
              {/* Lógica de Skeletons */}
              {isLoading && skip === 0 // Skeleton só na carga inicial
                ? skeletonArray.map((_, index) => (
                  <div className="w-full max-w-[300px]" key={`skeleton-${index}`}>
                    <div
                      className="bg-branco shadow-sm rounded-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 relative border border-gray-100 w-full"
                    >
                      <div className="relative z-5 px-4">
                        <Skeleton variant="rectangular" height={200} style={{ borderRadius: "4px" }} />
                        <Box className="absolute top-2 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 bg-opacity-90">
                          <Skeleton variant="text" width={80} />
                        </Box>
                      </div>
                      <Box px={3} pb={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                          <Skeleton variant="text" width={150} />
                          <Skeleton variant="text" width={60} />
                        </Stack>
                        <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
                          {Array.from({ length: 4 }, (_, i) => (
                            <Skeleton key={i} variant="circular" width={24} height={24} />
                          ))}
                        </Stack>
                        <Skeleton variant="text" width={200} />
                        <Skeleton variant="text" width={150} />
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
                          <Skeleton variant="text" width={100} />
                          <Stack direction="row" spacing={1}>
                            <Skeleton variant="circular" width={24} height={24} />
                            <Skeleton variant="circular" width={24} height={24} />
                          </Stack>
                        </Stack>
                      </Box>
                    </div>
                  </div>
                ))
                // Lógica de "Nenhum imóvel" encontrado - melhorada
                : !isLoading && imoveis.imoveis.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center bg-white rounded-lg p-10 shadow-sm border border-gray-200 w-full mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-center text-xl font-bold text-re-text-main mb-2">
                      Nenhum imóvel encontrado
                    </p>
                    <p className="text-center text-re-text-secondary mb-4">
                      Tente ajustar os filtros para encontrar mais opções
                    </p>
                    <button
                      onClick={() => {
                        setFiltros({});
                        router.push('/imoveis');
                      }}
                      className="bg-re-accent text-white py-2 px-4 rounded-lg hover:bg-re-accent/90 transition"
                    >
                      Limpar filtros
                    </button>
                  </div>
                ) : (
                  // Mapeamento dos cards de imóveis
                  imoveis.imoveis.map((imovel, index) => (
                    <div className="w-full max-w-[300px]" key={imovel.id || index}>
                      <Card {...imovel} />
                    </div>
                  ))
                )}
              {/* Feedback visual de carregamento para "Carregar Mais" */}
              {isLoading && skip > 0 && (
                Array.from({ length: 3 }, (_, index) => (
                  <div className="w-full max-w-[300px]" key={`loading-more-${index}`}>
                    <div className="bg-branco shadow-sm rounded-lg overflow-hidden opacity-50">
                      <Skeleton variant="rectangular" height={200} />
                      <Box px={2} py={1.5}>
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="60%" />
                      </Box>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Botão Carregar Mais */}
            {!isLoading && imoveis.imoveis.length > 0 && imoveis.imoveis.length < totalImoveis && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={carregarMaisImoveis}
                  disabled={isLoading}
                  className="bg-re-accent text-white py-2 px-6 rounded-lg font-medium transition duration-300 ease-in-out hover:bg-re-accent/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Carregando...
                    </>
                  ) : (
                    'Carregar mais imóveis'
                  )}
                </button>
              </div>
            )}
          </main>
          
          {/* Filtro Lateral (agora à direita - 1 coluna) */}
          <aside className="col-span-1 lg:order-2 order-1 lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
              <h3 className="text-lg font-semibold text-re-text-main mb-4 pb-2 border-b border-gray-200">Filtros</h3>
              <FiltroLateral />
            </div>
          </aside>
        </div>
      </div>

      {/* Footer mantido */}
      <Suspense fallback={<div>Carregando...</div>}>
        <Footer />
      </Suspense>

      {/* CSS para sr-only */}
      <style jsx global>{`
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
       `}</style>

    </div>
  );
};

export default Imoveis;