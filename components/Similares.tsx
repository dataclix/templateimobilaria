import { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import Card, { ImovelResumo } from './Card';
import { BiBuildings } from 'react-icons/bi';

interface SimilaresProps {
  id: string;
}

export default function Similares({ id }: SimilaresProps) {
  const [imoveisSimilares, setImoveisSimilares] = useState<ImovelResumo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function puxarDados(): Promise<void> {
      setIsLoading(true);
      
      try {
        const apiClient = axios.create({
          baseURL: 'https://homeclixteste.dataclix.com.br:3312/',
        });
        const similaresResponse = await apiClient.get<ImovelResumo[]>(
          `/website/imovel/similares/${id}`
        );
        setImoveisSimilares(similaresResponse.data);
        
      } catch (error) {
        console.error('Erro ao carregar imóveis similares:', error);
      } finally {
        setIsLoading(false);
      }
    }

    puxarDados();
  }, [id]);

  if (imoveisSimilares.length === 0 && !isLoading) {
    return null;
  }

  return (
    <section className="py-6 relative">
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-re-text-secondary font-poppins">Carregando imóveis similares...</p>
        </div>
      ) : (
        <div className="similares-wrapper bg-re-bg-alt">
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{
              clickable: true,
              bulletActiveClass: 'swiper-pagination-bullet-active bg-re-accent',
              el: '.swiper-pagination',
            }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              // Responsividade ajustada para garantir 4 cards na versão desktop
              640: { slidesPerView: 2 }, // Tablet pequeno
              768: { slidesPerView: 2 }, // Tablet
              1024: { slidesPerView: 3 }, // Desktop pequeno
              1280: { slidesPerView: 4 }, // Desktop grande - sempre 4 cards
              1536: { slidesPerView: 4 }, // Telas extra grandes - mantém 4 cards
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            className="similares-swiper"
          >
            {imoveisSimilares.map((imovelSimilar) => (
              <SwiperSlide key={imovelSimilar.id}>
                <div className="h-full shadow-md bg-re-bg rounded-lg">
                  <Card {...imovelSimilar} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <div className="swiper-button-prev text-re-accent" />
          <div className="swiper-button-next text-re-accent" />
          <div className="swiper-pagination" />
        </div>
      )}

      <style jsx global>{`
        .similares-wrapper {
          width: 100%;
          padding: 0;
          margin-bottom: 50px;
          position: relative;
          background-color: var(--tw-color-re-bg);
        }

        .similares-wrapper .similares-swiper {
          width: 100%;
          padding: 0 10px;
        }

        .similares-wrapper .swiper-slide {
          height: auto;
          display: flex;
          align-items: stretch;
        }

        .similares-wrapper .swiper-button-prev,
        .similares-wrapper .swiper-button-next {
          width: 40px !important;
          height: 40px !important;
          background-color: white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          color: var(--tw-color-re-accent);
          transition: all 0.3s ease;
          z-index: 20;
        }

        .similares-wrapper .swiper-button-prev {
          left: 0;
        }

        .similares-wrapper .swiper-button-next {
          right: 0;
        }

        .similares-wrapper .swiper-button-prev:after,
        .similares-wrapper .swiper-button-next:after {
          font-size: 18px;
          color: var(--tw-color-re-accent);
          font-weight: bold;
        }

        .similares-wrapper .swiper-button-prev:hover,
        .similares-wrapper .swiper-button-next:hover {
          background-color: var(--tw-color-re-accent);
        }

        .similares-wrapper .swiper-button-prev:hover:after,
        .similares-wrapper .swiper-button-next:hover:after {
          color: var(--tw-color-re-text-invert);
        }

        .similares-wrapper .swiper-pagination {
          position: absolute;
          bottom: -30px;
          left: 0;
          right: 0;
          text-align: center;
        }

        .similares-wrapper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: var(--tw-color-re-bg);
          opacity: 1;
          margin: 0 4px;
        }

        .similares-wrapper .swiper-pagination-bullet-active {
          background-color: var(--tw-color-re-accent) !important;
        }

        .similares-wrapper .swiper-button-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Aumentar largura do container em telas maiores para caber melhor os 4 cards */
        @media (min-width: 1280px) {
          .similares-wrapper .similares-swiper {
            padding: 0 20px;
          }
        }
      `}</style>
    </section>
  );
}