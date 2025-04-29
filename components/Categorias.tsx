import { memo, useCallback, useState } from 'react';
import { filtrosAtom, filtroSelecionadoAtom, termoBuscaAtom } from "@/pages/imoveis";
import { useAtom } from "jotai";
import { useRouter } from 'next/router';
import { motion } from "framer-motion";
import { MdKeyboardArrowRight } from "react-icons/md";
import Link from 'next/link';
import Image from 'next/image';

interface PropertyCategory {
  key: number;
  label: string;
  description: string;
  imageUrl: string;
  idTipo?: number[];
  idSubTipo?: number[];
  tagLabel?: string;
  tagColor?: string;
  code?: string;
}

const PALETA = {
  base: 'var(--re-base)',
  accent: 'var(--re-accent)',
  bg: 'var(--re-bg)',
  bgAlt: 'var(--re-bg-alt)',
  textMain: 'var(--re-text-main)',
  textSecondary: 'var(--re-text-secondary)',
};

const categories: PropertyCategory[] = [
  {
    key: 1,
    idTipo: [2],
    label: "Casa",
    description: "Residências unifamiliares",
    imageUrl: "/images/casare.webp",
  },
  {
    key: 2,
    idTipo: [1],
    label: "Apartamento",
    description: "Unidades em prédios residenciais",
    imageUrl: "/images/apartamentore.webp",
    tagLabel: "Mais Buscados",
    tagColor: PALETA.accent,
  },
  {
    key: 3,
    idSubTipo: [4, 41],
    label: "Kitnet",
    description: "Moradias compactas",
    imageUrl: "/images/kitnetre.webp",
  },
  {
    key: 4,
    idSubTipo: [37, 39, 40, 46],
    label: "Comércio",
    description: "Espaços para negócios",
    imageUrl: "/images/faxada.webp",
  },
  {
    key: 5,
    idSubTipo: [27, 26],
    label: "Terreno",
    description: "Lotes e áreas",
    imageUrl: "/images/lote2.webp",
  },
  {
    key: 6,
    idTipo: [99],
    label: "Rural",
    description: "Sítios, chácaras e fazendas",
    imageUrl: "/images/rural.webp",
  },
];

const animations = {
  container: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.08
      }
    }
  },
  item: {
    hidden: { 
      opacity: 0,
      y: 15,
      scale: 0.98
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  },
  title: {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }
};

interface CategoryCardProps {
  category: PropertyCategory;
  isSelected: boolean;
  onSelect: (category: PropertyCategory) => void;
}

const CategoryCard = memo(({ category, isSelected, onSelect }: CategoryCardProps) => {
  return (
    <motion.div
      variants={animations.item}
      whileHover={{ 
        scale: 1.03,
        y: -5,
        transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 15 }
      }}
      onClick={() => onSelect(category)}
      className={`
        relative overflow-hidden rounded-2xl cursor-pointer
        h-[260px] w-full
        transition-all duration-300
        ${isSelected 
          ? 'ring-3 ring-re-accent shadow-[0_8px_30px_rgba(230,126,34,0.18)]' 
          : 'shadow-lg hover:shadow-xl'
        }
      `}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      <Image
        src={category.imageUrl}
        alt={`Imagem da categoria ${category.label}`}
        fill
        style={{ objectFit: 'cover', filter: 'brightness(0.82)' }}
        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 17vw"
        quality={75}
        priority={category.key <= 3}
      />
      <div className="relative z-10 flex flex-col justify-between h-full p-5 bg-gradient-to-t from-black/50 via-black/20 to-transparent">
        <div>
          <h3 className="text-lg font-bold text-white drop-shadow mb-1">
            {category.label}
          </h3>
          <p className="text-sm text-white/90 drop-shadow mb-4">
            {category.description}
          </p>
        </div>
        <motion.button
          className="mt-auto flex items-center justify-center gap-1 px-4 py-2 bg-re-accent text-white rounded-lg font-semibold text-sm shadow hover:bg-opacity-90 transition-all"
          onClick={e => {
            e.stopPropagation();
            onSelect(category);
          }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Ver imóveis
        </motion.button>
        {/* Tag se existir */}
        {category.tagLabel && (
          <span
            className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-semibold bg-re-accent text-white shadow"
          >
            {category.tagLabel}
          </span>
        )}
      </div>
    </motion.div>
  );
});

CategoryCard.displayName = 'CategoryCard';

const Categorias = () => {
  const [filtros, setFiltros] = useAtom(filtrosAtom);
  const [termoBusca, setTermoBusca] = useAtom(termoBuscaAtom);
  const [filtroSelecionado, setFiltroSelecionado] = useAtom(filtroSelecionadoAtom);
  const router = useRouter();

  const handleCategoriaFiltro = useCallback((category: PropertyCategory) => {
    setTermoBusca("");
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      idInterno: undefined,
      idTipo: category.idTipo,
      idSubtipo: category.idSubTipo,
      categoria: undefined,
    }));
    setFiltroSelecionado(category.key);
    router.push('/imoveis');
  }, [setTermoBusca, setFiltros, setFiltroSelecionado, router]);

  return (
    <section 
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white"
      aria-labelledby="categories-title"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={animations.title}
            className="text-center md:text-left mb-6 md:mb-0"
          >
            <span className="text-re-accent text-sm font-semibold tracking-wider uppercase block mb-2">
              Explore por categorias
            </span>
            <h2 
              id="categories-title"
              className="text-3xl md:text-4xl font-bold text-re-base"
            >
              Tipos de <span className="text-re-accent">imóveis</span>
            </h2>
          </motion.div>
          
          <Link 
            href="/imoveis" 
            className="inline-flex items-center bg-re-accent text-white px-5 py-2.5 rounded-lg transition-all hover:bg-opacity-90 shadow-md hover:shadow-lg"
          >
            Ver todos imóveis
            <MdKeyboardArrowRight className="ml-1 text-lg" />
          </Link>
        </div>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animations.container}
          className="grid gap-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-6"
        >
          {categories.map((category) => (
            <CategoryCard
              key={category.key}
              category={category}
              isSelected={filtroSelecionado === category.key}
              onSelect={handleCategoriaFiltro}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Categorias);