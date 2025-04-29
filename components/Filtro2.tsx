import {
  filtrosAtom,
  filtroSelecionadoAtom,
  termoBuscaAtom,
} from "@/pages/imoveis";
import { atom, useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
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

export const openFiltroModalPCAtom = atom(false);
export const openFiltroModalMobileAtom = atom(false);

export default function Filtros() {
  const [filtros, setFiltros] = useAtom(filtrosAtom);
  const [termoBusca, setTermoBusca] = useAtom(termoBuscaAtom);
  const [openFiltroModalPC, setOpenFiltroModalPC] =
    useAtom(openFiltroModalPCAtom);
  const [openFiltroModalMobile, setOpenFiltroModalMobile] = useAtom(
    openFiltroModalMobileAtom
  );
  const [filtroSelecionado, setFiltroSelecionado] =
    useAtom(filtroSelecionadoAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
  };

  const categories = [
    {
      key: 0,
      icon: <MdFilterList className="w-6 h-6 mr-2 text-[#52174c]" />,
      label: "Todos",
    },
    {
      key: 1,
      idTipo: [2],
      icon: <MdHome className="w-6 h-6 mr-2 text-[#52174c]" />,
      label: "Casa",
    },
    {
      key: 2,
      idTipo: [1],
      icon: <MdApartment className="w-6 h-6 mr-2 text-[#52174c]" />,
      label: "Apartamento",
    },
    {
      key: 3,
      idSubTipo: [4, 41],
      icon: <BiBuildingHouse className="w-6 h-6 mr-2 text-[#52174c]" />,
      label: "Kitnet/Studio",
    },
    {
      key: 4,
      idSubTipo: [37, 39, 40, 46],
      icon: <MdBusiness className="w-6 h-6 mr-2 text-[#52174c]" />,
      label: "Ponto Comercial",
    },
    {
      key: 5,
      idSubTipo: [27, 26],
      icon: <MdHotel className="w-6 h-6 mr-2 text-[#52174c]" />,
      label: "Lote/Terreno",
    },
    {
      key: 6,
      idSubTipo: [47, 8, 48],
      icon: <MdHotel className="w-6 h-6 mr-2 text-[#52174c]" />,
      label: "Condomínio",
    },
    {
      key: 7,
      idSubTipo: [45, 32],
      icon: <MdHotel className="w-6 h-6 mr-2 text-[#52174c]" />,
      label: "Pousada",
    },
    {
      key: 8,
      idSubTipo: [28],
      icon: <MdNaturePeople className="w-6 h-6 mr-2 text-[#52174c]" />,
      label: "Sítio",
    },
    {
      key: 9,
      idSubTipo: [24],
      icon: <MdNaturePeople className="w-6 h-6 mr-2 text-[#52174c]" />,
      label: "Fazenda",
    },
    {
      key: 10,
      idSubTipo: [17],
      icon: <MdHotel className="w-6 h-6 mr-2 text-[#52174c]" />,
      label: "Hotel",
    },
    {
      key: 11,
      idSubTipo: [16],
      icon: <MdWarehouse className="w-6 h-6 mr-2 text-[#52174c]" />,
      label: "Galpão",
    },
    {
      key: 12,
      categoria: "9cf0af77-2562-4048-b5eb-c3ee04c4768d",
      icon: <MdStar className="w-6 h-6 mr-2 text-[#52174c]" />,
      label: "Alto Padrão",
    },
    {
      key: 13,
      categoria: "258d4c6c-d894-4046-a0b6-8bf202f13dd9",
      icon: <MdTrendingUp className="w-6 h-6 mr-2 text-[#52174c]" />,
      label: "Em Alta",
    },
    {
      key: 14,
      categoria: "63c8aa4f-636a-4420-9190-9a64f1c89eff",
      icon: <MdHistoryEdu className="w-6 h-6 mr-2 text-[#52174c]" />,
      label: "Histórico",
    },
    {
      key: 15,
      categoria: "fd7fd27c-0a2e-4a3d-b649-fc7e6a8a9a73",
      icon: <MdNewReleases className="w-6 h-6 mr-2 text-[#52174c]" />,
      label: "Lançamento",
    },
    {
      key: 16,
      categoria: "c06c52b0-ec47-4f03-9fbb-05815de92981",
      icon: <MdStar className="w-6 h-6 mr-2 text-[#52174c]" />,
      label: "Merece Destaque",
    },
    {
      key: 17,
      categoria: "c769b98c-ece4-4f5f-93bf-85375bfda38f",
      icon: <MdAttachMoney className="w-6 h-6 mr-2 text-[#52174c]" />,
      label: "Para Investir",
    },
  ];

  const checkForScrollPosition = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      // Ajuste aqui: adicione uma pequena margem de erro para garantir que a seta desapareça corretamente
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 400;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkForScrollPosition();
    const handleResize = () => checkForScrollPosition();
    window.addEventListener("resize", handleResize);
    if (containerRef.current) {
      containerRef.current.addEventListener("scroll", checkForScrollPosition);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener(
          "scroll",
          checkForScrollPosition
        );
      }
    };
  }, []);

  return (
    <div>
      {openFiltroModalPC === true && <ModalFiltroAvancadoPC />}
      {openFiltroModalMobile === true && <ModalFiltroAvancadoMobile />}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 font-montserrat">
        <div className="relative  ">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 lg:block hidden text-gray-100"
               // Margem negativa à direita
            >
              <IoIosArrowDropleft size={32} className="hover:scale-110 " />
              <p className="w-0 h-0 text-transparent">Seta Esquerda</p>
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 lg:block hidden text-gray-300"
              // Margem negativa à esquerda
            >
              <IoIosArrowDropright size={32} className="hover:scale-110 " />
              <p className="w-0 h-0 text-transparent">Seta Direita</p>
            </button>
          )}
          <div
            ref={containerRef}
            className="flex  space-x-4 overflow-x-auto  scrollbar-hidden no-scrollbar w-[95%] mx-auto"
          >
            {/* Conteúdo */}


            {categories.map((tipo) => (
              <button
                onClick={() => {
                  setFiltroSelecionado(tipo.key);
                  handleCategoriaFiltro(
                    tipo.idTipo,
                    tipo.idSubTipo,
                    tipo.categoria
                  );
                }}
                key={tipo.key}
                className={`flex items-center px-4 py-2 rounded-[50px] bg-white bg-opacity-20 whitespace-nowrap ${filtroSelecionado === tipo.key
                  ? "border-b-[3px] border-black"
                  : "hover:border-b-[3px] hover:border-gray-300"
                  }`}
              >
                {tipo.icon}
                <span className="text-[#52174c] text-sm font-medium">
                  {tipo.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
}