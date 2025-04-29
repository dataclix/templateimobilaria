import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import FiltroBanner from "./FiltroBanner";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const bannerImages = ["/images/banertemplate.jpg"];

const Banner: React.FC = () => {
  return (
    <div className="relative h-[calc(100dvh-3.5rem)] font-montserrat overflow-hidden">
      {/* Mobile Background (z-0) */}
      <div className="block sm:hidden w-full h-full absolute inset-0 z-0">
        <img
          src="/images/banertemplate.jpg"
          alt="Banner Mobile"
          className="object-cover"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </div>

      {/* Desktop Background (z-0) */}
      <div className="hidden sm:block w-full h-full absolute inset-0 z-0">
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 8000, disableOnInteraction: false }}
          loop={true}
          className="w-full h-full"
        >
          {bannerImages.map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src}
                alt={`Banner ${index + 1}`}
                className="object-cover md:object-fill"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Gradient Overlay (z-10, pointer-events-none) */}
      <div className="absolute inset-x-0 top-16 bottom-0 bg-gradient-to-b from-re-base/70 via-re-base/50 to-re-base/70 z-10 pointer-events-none transition-all duration-300" />

      {/* Centering Container (z-20, pointer-events-none) */}
      <div className="absolute inset-0 flex items-center justify-center p-4 z-20 pointer-events-none">
        <div className="w-full max-w-screen-xl mx-auto pointer-events-none">
          {/* Chamada/Slogan acima do filtro */}
          <div className="absolute left-1/2 -translate-x-1/2 w-full flex justify-center z-30 top-20 md:top-40">
            <div className="max-w-2xl text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-2 md:mb-4">Encontre o imóvel perfeito para sua vida!</h1>
              <p className="text-white text-base md:text-lg drop-shadow-md">Conectamos você ao seu novo lar.</p>
            </div>
          </div>
          {/* Motion Div & Form Wrapper (pointer-events-auto) */}
          <motion.div
            className="w-full pointer-events-auto flex justify-center items-start mt-32 md:mt-48"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {/* Responsive Search Form - Usa condições internas para desktop/mobile */}
            <FiltroBanner />
          </motion.div>
        </div>
      </div>

      {/* Swiper Controls CSS */}
      <style jsx global>{`
        .swiper-button-next, .swiper-button-prev {
          z-index: 50 !important; 
          color: white !important; 
          --swiper-navigation-size: 28px;
          background-color: rgba(44, 62, 80, 0.8); 
          border-radius: 50%; 
          width: 44px; 
          height: 44px;
          display: flex; 
          align-items: center; 
          justify-content: center; 
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          margin: 0 18px !important; /* Adiciona espaçamento horizontal nas setas */
        }
        .swiper-button-next:hover, .swiper-button-prev:hover { 
          background-color: rgba(44, 62, 80, 0.95); 
          transform: scale(1.05);
        }
        .swiper-button-next:after, .swiper-button-prev:after { 
          font-size: 16px !important; 
          font-weight: bold; 
        }
        .swiper-pagination { 
          z-index: 50 !important; 
          bottom: 25px !important; 
          text-align: center; 
        }
        .swiper-pagination-bullet {
          background-color: rgba(255, 255, 255, 0.7) !important; 
          opacity: 1 !important;
          width: 10px !important; 
          height: 10px !important; 
          margin: 0 5px !important;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .swiper-pagination-bullet-active { 
          background-color: #E67E22 !important; 
          width: 12px !important; 
          height: 12px !important; 
        }
        .swiper { z-index: 0; }
      `}</style>
    </div>
  );
};

export default Banner;