import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Banner: React.FC = () => {
  return (
    <div className="relative h-[calc(100dvh-3.5rem)] font-montserrat overflow-hidden bg-[#2D3F42]">
      {/* Overlay com padrão geométrico */}
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10 mix-blend-overlay"></div>
      
      {/* Elementos decorativos flutuantes */}
      <motion.div 
        className="absolute top-[10%] right-[5%] w-64 h-64 rounded-full bg-[#00D54B] opacity-20 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.15, 0.2],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-[20%] left-[5%] w-48 h-48 rounded-full bg-[#00D54B] opacity-10 blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <div className="container mx-auto h-full flex items-center px-[6%]">
        {/* Conteúdo à esquerda */}
        <motion.div
          className="w-full md:w-1/2 text-white z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 font-montserrat">
            Encontre o Imóvel dos Seus <span className="text-[#00D54B]">Sonhos</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white max-w-lg leading-relaxed font-poppins">
            Oferecemos as melhores opções de imóveis para você e sua família.
            Conte com nossa experiência e qualidade no atendimento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/imoveis"
              className="inline-block bg-[#00D54B] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#00b944] transition-all duration-300 shadow-lg hover:shadow-xl text-center font-poppins"
            >
              Explorar Imóveis
            </Link>
            <Link 
              href="/contato"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 text-center font-poppins"
            >
              Fale Conosco
            </Link>
          </div>
        </motion.div>

        {/* Imagem à direita (posicionada absolutamente na parte inferior) */}
        <div className="hidden md:block w-1/2 h-full relative">
          <motion.div
            className="absolute bottom-0 right-0 w-full h-[85%]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D3F42]/30 to-transparent z-[1]"></div>
            <img
              src="/images/capabanner.webp"
              alt="Imóvel de Luxo"
              className="object-cover object-bottom rounded-tl-3xl"
              style={{ 
                objectFit: 'cover', 
                width: '100%', 
                height: 'auto', 
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" 
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Banner;