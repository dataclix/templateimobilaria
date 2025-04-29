import { filtrosAtom, filtroSelecionadoAtom, termoBuscaAtom } from "@/pages/imoveis";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import {
  MdHome,
  MdApartment,
  MdBusiness,
  MdHotel,
  MdNaturePeople,
  MdWarehouse,
  MdStar,
  MdTrendingUp,
  MdHistoryEdu,
  MdNewReleases,
  MdAttachMoney,
  MdFilterList,
} from "react-icons/md";
import { BiBuildingHouse } from "react-icons/bi";
import ModalFiltroAvancadoPC from "./ModalFiltroAvancadoPC";
import ModalFiltroAvancadoMobile from "./ModalFiltroAvancadoMobile";
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from "framer-motion";

export const openFiltroModalPCAtom = atom(false);
export const openFiltroModalMobileAtom = atom(false);

export default function Filtros() {
  const [filtros, setFiltros] = useAtom(filtrosAtom);
  const [termoBusca, setTermoBusca] = useAtom(termoBuscaAtom);
  const [openFiltroModalPC, setOpenFiltroModalPC] = useAtom(openFiltroModalPCAtom);
  const [openFiltroModalMobile, setOpenFiltroModalMobile] = useAtom(openFiltroModalMobileAtom);
  const [filtroSelecionado, setFiltroSelecionado] = useAtom(filtroSelecionadoAtom);
  const router = useRouter();

  const handleCategoriaFiltro = (
    tipo?: number[],
    subtipo?: number[],
    categoria?: string
  ) => {
    if (categoria) {
      setTermoBusca("");
      setFiltros((prevFiltros) => ({
        ...prevFiltros,
        idInterno: undefined,
        idTipo: undefined,
        idSubtipo: undefined,
        categoria: categoria,
      }));
    } else if (tipo) {
      setTermoBusca("");
      setFiltros((prevFiltros) => ({
        ...prevFiltros,
        idInterno: undefined,
        idTipo: tipo,
        idSubtipo: undefined,
        categoria: undefined,
      }));
    } else if (subtipo) {
      setTermoBusca("");
      setFiltros((prevFiltros) => ({
        ...prevFiltros,
        idInterno: undefined,
        idTipo: undefined,
        idSubtipo: subtipo,
        categoria: undefined,
      }));
    } else {
      setTermoBusca("");
      setFiltros((prevFiltros) => ({
        ...prevFiltros,
        idInterno: undefined,
        idTipo: undefined,
        idSubtipo: undefined,
        categoria: undefined,
      }));
    }

    router.push('/imoveis');
  };

  const categories = [
    {
      key: 0,
      icon: <MdFilterList className="w-6 h-6 mr-2 text-white" />,
      label: "Todos",
    },
    {
      key: 1,
      idTipo: [2],
      icon: <MdHome className="w-6 h-6 mr-2 text-white" />,
      label: "Casa",
    },
    {
      key: 2,
      idTipo: [1],
      icon: <MdApartment className="w-6 h-6 mr-2 text-white" />,
      label: "Apartamento",
    },
    {
      key: 3,
      idSubTipo: [4, 41],
      icon: <BiBuildingHouse className="w-6 h-6 mr-2 text-white" />,
      label: "Kitnet/Studio",
    },
    {
      key: 4,
      idSubTipo: [37, 39, 40, 46],
      icon: <MdBusiness className="w-6 h-6 mr-2 text-white" />,
      label: "Ponto Comercial",
    },
    {
      key: 5,
      idSubTipo: [27, 26],
      icon: <MdHotel className="w-6 h-6 mr-2 text-white" />,
      label: "Lote/Terreno",
    },
    {
      key: 6,
      idSubTipo: [47, 8, 48],
      icon: <MdHotel className="w-6 h-6 mr-2 text-white" />,
      label: "Condomínio",
    },
    {
      key: 7,
      idSubTipo: [45, 32],
      icon: <MdHotel className="w-6 h-6 mr-2 text-white" />,
      label: "Pousada",
    },
    {
      key: 8,
      idSubTipo: [28],
      icon: <MdNaturePeople className="w-6 h-6 mr-2 text-white" />,
      label: "Sítio",
    },
    {
      key: 9,
      idSubTipo: [24],
      icon: <MdNaturePeople className="w-6 h-6 mr-2 text-white" />,
      label: "Fazenda",
    },
    {
      key: 10,
      idSubTipo: [17],
      icon: <MdHotel className="w-6 h-6 mr-2 text-white" />,
      label: "Hotel",
    },
    {
      key: 11,
      idSubTipo: [16],
      icon: <MdWarehouse className="w-6 h-6 mr-2 text-white" />,
      label: "Galpão",
    },
    {
      key: 12,
      categoria: "9cf0af77-2562-4048-b5eb-c3ee04c4768d",
      icon: <MdStar className="w-6 h-6 mr-2 text-white" />,
      label: "Alto Padrão",
    },
    {
      key: 13,
      categoria: "258d4c6c-d894-4046-a0b6-8bf202f13dd9",
      icon: <MdTrendingUp className="w-6 h-6 mr-2 text-white" />,
      label: "Em Alta",
    },
    {
      key: 14,
      categoria: "63c8aa4f-636a-4420-9190-9a64f1c89eff",
      icon: <MdHistoryEdu className="w-6 h-6 mr-2 text-white" />,
      label: "Histórico",
    },
    {
      key: 15,
      categoria: "fd7fd27c-0a2e-4a3d-b649-fc7e6a8a9a73",
      icon: <MdNewReleases className="w-6 h-6 mr-2 text-white" />,
      label: "Lançamento",
    },
    {
      key: 16,
      categoria: "c06c52b0-ec47-4f03-9fbb-05815de92981",
      icon: <MdStar className="w-6 h-6 mr-2 text-white" />,
      label: "Merece Destaque",
    },
    {
      key: 17,
      categoria: "c769b98c-ece4-4f5f-93bf-85375bfda38f",
      icon: <MdAttachMoney className="w-6 h-6 mr-2 text-white" />,
      label: "Para Investir",
    },
  ];

  // Variantes para animação com Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Atraso entre cada filho
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const handleResize = () => { };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 font-montserrat">
      {openFiltroModalPC && <ModalFiltroAvancadoPC />}
      {openFiltroModalMobile && <ModalFiltroAvancadoMobile />}
      {/* Web layout */}
      <motion.div
        className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((tipo) => (
          <motion.button
            onClick={() => {
              setFiltroSelecionado(tipo.key);
              handleCategoriaFiltro(
                tipo.idTipo,
                tipo.idSubTipo,
                tipo.categoria
              );
            }}
            key={tipo.key}
            className={`flex items-center px-4 py-2 rounded-full bg-white bg-opacity-20 h-11 ${filtroSelecionado === tipo.key
                ? "border-b-[3px] border-white bg-opacity-30 text-white"
                : "text-gray-300 hover:bg-opacity-30 hover:text-white"
              } transition-all`}
            variants={itemVariants}
          >
            {tipo.icon}
            {tipo.label}
          </motion.button>
        ))}
      </motion.div>
      <motion.div
        className="grid md:hidden grid-cols-3 gap-2 p-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.slice(0, 9).map((tipo) => (
          <motion.button
            onClick={() => {
              setFiltroSelecionado(tipo.key);
              handleCategoriaFiltro(tipo.idTipo, tipo.idSubTipo, tipo.categoria);
            }}
            key={tipo.key}
            className={`flex flex-col items-center justify-center  rounded-2xl mx-1 w-[109px] bg-white bg-opacity-20 h-auto ${filtroSelecionado === tipo.key
                ? "border-b-[2px] border-[#f4505a] bg-opacity-30 text-white"
                : "text-gray-300 hover:bg-opacity-30 hover:text-white"
              } transition-all`}
            variants={itemVariants}
          >
            <div className="w-8 ">{tipo.icon}</div>
            <span className="text-sm ">{tipo.label}</span>
          </motion.button>
        ))}
      </motion.div>

    </div>
  );
}
