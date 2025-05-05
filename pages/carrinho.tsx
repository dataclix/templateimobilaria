import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { BiBath, BiCar, BiBed } from 'react-icons/bi';
import { RiRulerLine } from 'react-icons/ri';
import { FaStar, FaWhatsapp } from 'react-icons/fa';
import { FiShare, FiCamera, FiSend, FiFacebook, FiCopy } from 'react-icons/fi';
import Cookies from 'js-cookie';
import { FacebookShareButton, WhatsappShareButton } from 'react-share';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Download from 'yet-another-react-lightbox/plugins/download';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { Typography } from '@mui/material';

interface ImovelResumo {
  id: string;
  idInterno: number;
  titulo: string;
  tipo: { id: string; nome: string };
  subtipo: { id: string; nome: string };
  categoria: { nome: string; cor: string };
  bairro: string;
  cidade: string;
  estado: string;
  estadoSigla: string;
  valor: number;
  quartos: number | null;
  banheiros: number | null;
  garagens: number | null;
  areaConstruida: string | null;
  areaTerreno: string | null;
  modalidade: string;
  fotos: string[];
  captador: {
    foto: string | null;
    nome: string;
    celular: string;
    creci: string;
  };
}

interface FetchError {
  imovelId: string;
  error: Error | unknown;
}

const Carrinho: React.FC = () => {
  const [imoveisFavoritos, setImoveisFavoritos] = useState<ImovelResumo[]>([]);
  const [showMenuStates, setShowMenuStates] = useState<{ [imovelId: string]: boolean }>({});
  const [lightboxStates, setLightboxStates] = useState<{ [imovelId: string]: boolean }>({});
  const [currentSlideIndices, setCurrentSlideIndices] = useState<{ [imovelId: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchErrors, setFetchErrors] = useState<FetchError[]>([]);
  const [offlineIds, setOfflineIds] = useState<string[]>([]);

  const buscarDadosDosImoveis = async (): Promise<void> => {
    try {
      setLoading(true);
      const favoriteIds = getFavoriteIdsFromCookies();
      console.log('Buscando dados para os IDs:', favoriteIds);

      if (favoriteIds.length === 0) {
        setLoading(false);
        return;
      }

      const results = await Promise.allSettled(
        favoriteIds.map(async (id) => {
          try {
            const response = await axios.get<ImovelResumo>(
              `https://homeclixteste.dataclix.com.br:3312/website/imovel/resumo/${id}`,
              { timeout: 8000 }
            );
            return { id, data: response.data, status: 'fulfilled' };
          } catch (error) {
            console.error(`Erro ao buscar imóvel ID ${id}:`, error);
            setFetchErrors(prev => [...prev, { imovelId: id, error }]);
            setOfflineIds(prev => [...prev, id]);
            throw error;
          }
        })
      );

      const sucessfulResults = results
        .filter((result): result is PromiseFulfilledResult<{ id: string; data: ImovelResumo; status: string }> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value.data);

      setImoveisFavoritos(sucessfulResults);

      if (sucessfulResults.length === 0 && favoriteIds.length > 0) {
        console.warn('Nenhum imóvel foi carregado com sucesso');
      }
    } catch (error) {
      console.error('Erro geral ao buscar dados dos imóveis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (imovelId: string): void => {
    const favorites = Cookies.get('favorites');
    let favoriteList: string[] = favorites ? JSON.parse(favorites) : [];

    if (favoriteList.includes(imovelId)) {
      favoriteList = favoriteList.filter((favoriteId) => favoriteId !== imovelId);
    } else {
      favoriteList.push(imovelId);
    }

    Cookies.set('favorites', JSON.stringify(favoriteList), { expires: 7 });

    setImoveisFavoritos((prevFavorites) =>
      prevFavorites.filter((imovel) => imovel.id !== imovelId)
    );

    const event = new CustomEvent('updateFavoritesCount', {
      detail: favoriteList.length,
    });
    window.dispatchEvent(event);
  };

  const enviarFavoritosParaWhatsapp = (): void => {
    const idsFavoritos = imoveisFavoritos.map((imovel) => imovel.idInterno).join(', ');
    const mensagem = `Olá! Tenho interesse nos imóveis: ${idsFavoritos}`;
    const numeroWhatsapp = '5532998650909';
    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsapp}&text=${encodeURIComponent(
      mensagem
    )}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setFetchErrors([]);
      setOfflineIds([]);
      await buscarDadosDosImoveis();
    };

    loadData();

    const handleCookieChange = (): void => {
      loadData();
    };

    window.addEventListener('favorites-changed', handleCookieChange);

    return () => {
      window.removeEventListener('favorites-changed', handleCookieChange);
    };
  }, []);

  const getFavoriteIdsFromCookies = (): string[] => {
    const favorites = Cookies.get('favorites');
    return favorites ? JSON.parse(favorites) : [];
  };

  const handleToggleMenu = (imovelId: string): void => {
    setShowMenuStates((prevState) => ({
      ...prevState,
      [imovelId]: !prevState[imovelId],
    }));
  };

  const handleCopyLink = (shareUrl: string, imovelId: string): void => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Link copiado para a área de transferência!');
      setShowMenuStates((prevState) => ({
        ...prevState,
        [imovelId]: false,
      }));
    });
  };

  const openLightbox = (imovelId: string): void => {
    setCurrentSlideIndices((prev) => ({
      ...prev,
      [imovelId]: 0,
    }));
    setLightboxStates((prev) => ({
      ...prev,
      [imovelId]: true,
    }));
  };

  const closeLightbox = (imovelId: string): void => {
    setLightboxStates((prev) => ({
      ...prev,
      [imovelId]: false,
    }));
  };

  const formatPrice = (valor: number, modalidade: string): string => {
    const formattedPrice = valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    });

    if (modalidade === 'ALUGUEL') {
      return `${formattedPrice}/Mês`;
    }

    return formattedPrice;
  };

  const clearUnavailableProperties = (): void => {
    const favorites = getFavoriteIdsFromCookies();
    const filteredFavorites = favorites.filter(id => !offlineIds.includes(id));
    Cookies.set('favorites', JSON.stringify(filteredFavorites), { expires: 7 });

    const event = new CustomEvent('updateFavoritesCount', {
      detail: filteredFavorites.length,
    });
    window.dispatchEvent(event);

    setFetchErrors([]);
    setOfflineIds([]);
  };

  const retryLoadingProperties = (): void => {
    buscarDadosDosImoveis();
  };

  return (
    <div className="bg-branco min-h-screen flex flex-col">
      <Navbar />
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="relative mb-12 mt-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-branco px-6 py-3 text-lg font-extrabold text-gray-900 rounded-full shadow-sm border border-gray-200">
              Imóveis Selecionados <FaStar className="inline-block ml-2 text-re-accent" size={18} />
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-re-accent"></div>
            <p className="mt-4 text-gray-600">Carregando imóveis...</p>
          </div>
        ) : (
          <>
            {fetchErrors.length > 0 && (
              <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-amber-800 font-semibold mb-2">Atenção</h3>
                <p className="text-amber-700 mb-4">
                  Não foi possível carregar {fetchErrors.length} imóvel(is). Isso pode ocorrer devido a problemas temporários de conexão ou porque o imóvel não está mais disponível.
                </p>
                <div className="flex space-x-4">
                  <button 
                    onClick={retryLoadingProperties}
                    className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md transition-colors"
                  >
                    Tentar novamente
                  </button>
                  <button 
                    onClick={clearUnavailableProperties}
                    className="px-4 py-2 bg-branco border border-amber-300 hover:bg-amber-50 text-amber-800 rounded-md transition-colors"
                  >
                    Remover imóveis indisponíveis
                  </button>
                </div>
              </div>
            )}

            {imoveisFavoritos.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6">
                  {imoveisFavoritos.map((imovel) => {
                    const fotoPrincipal = imovel.fotos && imovel.fotos.length > 0 ? imovel.fotos[0] : '/images/semfoto.webp';
                    const shareUrl = `https://homeclix.com.br/${imovel.idInterno}`;

                    return (
                      <div
                        key={imovel.idInterno}
                        className="relative w-full min-w-[280px] max-w-[300px] h-[400px] overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-tr-xl rounded-bl-xl"
                      >
                        {/* Imagem do imóvel */}
                        <div className="relative w-full h-full">
                          <Image
                            src={fotoPrincipal}
                            alt={`Imóvel em ${imovel.bairro}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            quality={75}
                            className="object-cover rounded-tr-xl rounded-bl-xl"
                          />
                          {/* Camada opaca na parte inferior com altura fixa */}
                          <div className="absolute bottom-0 left-0 w-full bg-branco bg-opacity-70 p-4 text-preto rounded-tl-2xl h-32">
                            {/* Modalidade */}
                            <Typography
                              variant="caption"
                              className="text-xs font-semibold uppercase px-2 py-1 bg-branco/50 rounded-tr-md rounded-br-md text-re-accent"
                            >
                              {imovel.modalidade === 'VENDA' ? 'À Venda' : 'Alugar'}
                            </Typography>
                            {/* Tipo e Bairro */}
                            <Typography variant="h6" className="text-sm font-semibold mt-1">
                              <span className="text-gray-700 mr-1">{imovel.tipo.nome}</span>
                              {imovel.bairro}
                            </Typography>

                            {/* Características - Ordem: Quartos, Banheiros, Garagens, Área */}
                            <div className="flex flex-wrap gap-2 mt-2 text-xs h-10 overflow-hidden">
                              {imovel.quartos ? (
                                <span className="flex items-center">
                                  <BiBed className="mr-1" size={18} /> {imovel.quartos} Quarto{imovel.quartos > 1 ? 's' : ''}
                                </span>
                              ) : null}
                              {imovel.banheiros ? (
                                <span className="flex items-center">
                                  <BiBath className="mr-1" size={18} /> {imovel.banheiros} Banheiro{imovel.banheiros > 1 ? 's' : ''}
                                </span>
                              ) : null}
                              {imovel.garagens ? (
                                <span className="flex items-center">
                                  <BiCar className="mr-1" size={18} /> {imovel.garagens} Garagem{imovel.garagens > 1 ? 's' : ''}
                                </span>
                              ) : null}
                              {imovel.areaConstruida ? (
                                <span className="flex items-center">
                                  <RiRulerLine className="mr-1" size={18} /> {Math.trunc(parseInt(imovel.areaConstruida))} m²
                                </span>
                              ) : null}
                              {!imovel.quartos && !imovel.banheiros && !imovel.garagens && !imovel.areaConstruida && (
                                <span className="flex items-center opacity-0">
                                  <RiRulerLine className="mr-1" size={18} /> Espaço reservado
                                </span>
                              )}
                            </div>

                            {/* Código do imóvel no canto superior esquerdo */}
                            <div className="absolute top-[-28px] left-0">
                              <span className="px-2 py-1 bg-gray-800 text-branco text-xs font-medium rounded-tr-md rounded-br-md">
                                COD {imovel.idInterno}
                              </span>
                            </div>

                            {/* Preço no canto superior direito */}
                            <div className="absolute top-[-4px] right-0">
                              <span className="px-3 py-2 bg-re-accent text-branco text-lg font-medium rounded-tr-xl rounded-bl-xl">
                                {formatPrice(imovel.valor, imovel.modalidade)}
                              </span>
                            </div>
                          </div>

                          {/* Botões de Compartilhar, Galeria e Favoritar */}
                          <div className="absolute top-4 right-4 flex gap-2">
                            <button
                              onClick={() => handleToggleMenu(imovel.id)}
                              className="p-2 rounded-full bg-branco bg-opacity-70 text-gray-700 hover:bg-opacity-90 transition-colors"
                            >
                              <FiShare size={18} />
                            </button>
                            <button
                              onClick={() => openLightbox(imovel.id)}
                              className="p-2 rounded-full bg-branco bg-opacity-70 text-gray-700 hover:bg-opacity-90 transition-colors"
                            >
                              <FiCamera size={18} />
                            </button>
                            <button
                              onClick={() => handleToggleFavorite(imovel.id)}
                              className="p-2 rounded-full bg-branco bg-opacity-70 hover:bg-opacity-90 transition-colors"
                            >
                              <FaStar size={18} className="text-re-accent" />
                            </button>
                          </div>
                        </div>

                        {/* Menu de compartilhamento */}
                        {showMenuStates[imovel.id] && (
                          <div
                            className="absolute top-12 right-4 z-50 bg-branco rounded-lg shadow-lg p-3 w-48"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Typography variant="subtitle1" className="text-sm font-medium text-gray-900 mb-2">
                              Compartilhar
                            </Typography>
                            <div className="space-y-2">
                              <WhatsappShareButton url={shareUrl}>
                                <div className="flex items-center p-2 text-sm rounded hover:bg-gray-100 text-gray-700">
                                  <FiSend className="mr-2" size={16} /> WhatsApp
                                </div>
                              </WhatsappShareButton>
                              <FacebookShareButton url={shareUrl}>
                                <div className="flex items-center p-2 text-sm rounded hover:bg-gray-100 text-gray-700">
                                  <FiFacebook className="mr-2" size={16} /> Facebook
                                </div>
                              </FacebookShareButton>
                              <button
                                onClick={() => handleCopyLink(shareUrl, imovel.id)}
                                className="flex items-center w-full p-2 text-sm rounded hover:bg-gray-100 text-gray-700"
                              >
                                <FiCopy className="mr-2" size={16} /> Copiar Link
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Lightbox para a galeria */}
                        <Lightbox
                          open={lightboxStates[imovel.id] || false}
                          close={() => closeLightbox(imovel.id)}
                          slides={imovel.fotos && imovel.fotos.length > 0 ? imovel.fotos.map((foto) => ({ src: foto })) : [{ src: '/images/semfoto.webp' }]}
                          index={currentSlideIndices[imovel.id] || 0}
                          plugins={[Captions, Fullscreen, Slideshow, Thumbnails, Zoom, Download]}
                        />
                      </div>
                    );
                  })}
                </div>
                {imoveisFavoritos.length > 0 && (
                  <div className="text-center mt-12">
                    <button
                      onClick={enviarFavoritosParaWhatsapp}
                      className="px-8 py-4 rounded-lg bg-gradient-to-r from-re-accent to-[#A69268] text-branco font-bold hover:shadow-lg transform transition-all hover:-translate-y-1 flex items-center mx-auto"
                    >
                      <FaWhatsapp className="mr-2" size={20} /> Consultar Disponibilidade
                    </button>
                    <p className="text-gray-500 text-sm mt-2">
                      Envie seus imóveis selecionados para nossos consultores
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-gray-100 mb-6">
                  <FaStar className="text-gray-300" size={36} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Você ainda não possui imóveis favoritados</h3>
                <p className="text-gray-600 mb-8">Adicione imóveis aos favoritos para visualizá-los aqui.</p>
                <Link href="/" className="px-6 py-3 bg-re-accent text-branco rounded-lg hover:bg-re-base transition-colors">
                  Explorar imóveis
                </Link>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Carrinho;