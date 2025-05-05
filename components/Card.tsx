import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react';
import { FiCopy, FiFacebook, FiSend, FiShare } from 'react-icons/fi';
import { Bed, Bath, Car, SquareAsterisk } from 'lucide-react';
import { urlSite } from './globals/variavels';
import { Typography } from '@mui/material';

const WhatsappShareButton = dynamic(() =>
    import('react-share').then((mod) => mod.WhatsappShareButton),
    { ssr: false }
);

const FacebookShareButton = dynamic(() =>
    import('react-share').then((mod) => mod.FacebookShareButton),
    { ssr: false }
);

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
    fotos: string[] | null;
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
    className?: string;
}

const Card: React.FC<ImovelResumo> = ({
    id,
    idInterno,
    bairro,
    cidade,
    valor,
    quartos,
    banheiros,
    garagens,
    areaConstruida,
    exibirDetalhesEnderecoSite,
    numero,
    logradouro,
    fotos,
    tipo,
    subtipo,
    categoria,
    modalidade,
    estadoSigla,
    className
}) => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const { refs, floatingStyles } = useFloating({
        placement: 'bottom-end',
        middleware: [
            offset(8),
            flip(),
            shift({ padding: 8 }),
        ],
        whileElementsMounted: autoUpdate,
    });

    const handleClickOutside = useCallback((event: MouseEvent) => {
        const floatingEl = refs.floating.current;
        const referenceEl = refs.reference.current;

        if (
            floatingEl instanceof Element &&
            referenceEl instanceof Element &&
            !floatingEl.contains(event.target as Node) &&
            !referenceEl.contains(event.target as Node)
        ) {
            setShowMenu(false);
        }
    }, [refs]);

    useEffect(() => {
        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showMenu, handleClickOutside]);

    const shareUrl = `${urlSite}/imovel/${idInterno}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Link copiado para a área de transferência!');
            setShowMenu(false);
        });
    };

    const toggleMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const fotoPrincipal = fotos && fotos.length > 0 ? fotos[0] : '/images/semfoto.webp';

    const formatPrice = () => {
        const formattedPrice = valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });

        if (modalidade === 'ALUGUEL') {
            return `${formattedPrice}/Mês`;
        }

        return formattedPrice;
    };

    const displayAddress = exibirDetalhesEnderecoSite && logradouro && numero
        ? `${logradouro} ${numero}`
        : cidade;
        
    // Define o tipo do imóvel para exibição
    const propertyType = tipo && tipo.includes('Terrenos') || tipo && tipo.includes('Comércio') 
        ? subtipo 
        : tipo;
        
    // Define o subtipo para exibição (se necessário)
    const displaySubtype = !tipo?.includes('Terrenos') && 
                           !tipo?.includes('Comércio') && 
                           subtipo && 
                           tipo !== subtipo && 
                           subtipo !== 'Padrão';

    return (
        <div 
            className={`group min-w-[280px] max-w-[300px] h-[400px] bg-re-bg rounded-lg shadow-md overflow-hidden transition-all duration-300 relative flex flex-col ${className || ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                boxShadow: isHovered ? '0 10px 25px rgba(199,176,128,0.15)' : '0 4px 6px rgba(0,0,0,0.05)',
                border: isHovered ? '1px solid #C7B080' : '1px solid #e5e7eb'
            }}
        >
            <div 
                className="absolute inset-0 z-0 transition-opacity duration-300"
                style={{
                    background: isHovered ? 'linear-gradient(90deg, #2E2E2E 0%, #2E2E2E 85%, #C7B080 100%)' : 'none',
                    opacity: isHovered ? 0.85 : 0,
                    pointerEvents: 'none'
                }}
            ></div>
            
            <Link href={`/imovel/${idInterno}`} prefetch={false} className="block relative z-10">
                <div className="relative w-full h-48">
                    <img
                        src={fotoPrincipal}
                        alt={`Imóvel em ${bairro}`}
                        className="object-cover w-full h-full"
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                    <button
                        ref={refs.setReference}
                        onClick={toggleMenu}
                        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white bg-opacity-80 text-gray-700 hover:bg-opacity-100 transition-colors focus:outline-none focus:ring-2 focus:ring-re-accent"
                        aria-label="Compartilhar imóvel"
                    >
                        <FiShare size={16} />
                    </button>
                    
                    {/* Categoria e modalidade lado a lado, cada uma com seu fundo */}
                    {(categoria && categoria.nome) || modalidade ? (
                        <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
                            {categoria && categoria.nome && (
                                <span
                                    className="bg-[#C7B080]/90 text-white text-xs font-medium py-1 px-2 rounded-md"
                                    style={categoria.cor ? { backgroundColor: categoria.cor, opacity: 0.9 } : {}}
                                >
                                    {categoria.nome}
                                </span>
                            )}
                            {modalidade?.toUpperCase() === 'ALUGUEL' ? (
                                <span className="px-2 py-1 rounded-md text-xs font-bold text-white shadow-sm bg-re-info"
                                >ALUGAR</span>
                            ) : modalidade?.toUpperCase() === 'VENDA' ? (
                                <span className="px-2 py-1 rounded-md text-xs font-bold text-white shadow-sm bg-re-accent"
                                >VENDA</span>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </Link>

            <div className={`p-4 pb-6 relative z-10 flex-grow ${isHovered ? 'bg-transparent text-white' : 'bg-re-bg'}`}>
                {/* Valor do imóvel destacado */}
                <div className="flex items-center justify-between mb-2">
                    <span
                        className={`text-xl font-bold ${isHovered ? 'text-white' : 'text-re-accent'}`}
                        style={{ letterSpacing: '-0.5px' }}
                    >
                        {formatPrice()}
                    </span>
                    <span className={`${isHovered ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-700'} text-xs font-medium px-2 py-0.5 rounded-md`}>
                        COD {idInterno}
                    </span>
                </div>
                <div className="mb-2">
                    <span className={`text-base font-semibold ${isHovered ? 'text-white' : 'text-re-text-secondary'}`}>
                        {propertyType}
                    </span>
                    {displaySubtype && (
                        <span className={`ml-1 text-sm ${isHovered ? 'text-white/90' : 'text-gray-500'}`}> {subtipo}</span>
                    )}
                    {bairro && cidade && (
                        <span className={`ml-1 text-sm ${isHovered ? 'text-white/90' : 'text-gray-500'}`}> - {bairro}</span>
                    )}
                </div>
                <div className={`text-sm ${isHovered ? 'text-white/90' : 'text-gray-600'} mb-1`}>
                    {displayAddress}{estadoSigla ? `, ${estadoSigla}` : ''}
                </div>
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center text-sm p-3 w-full bg-white text-gray-700 border-t border-gray-100 z-20">
                {quartos ? (
                    <span className="flex items-center">
                        <Bed className="mr-1 text-gray-500" size={18} /> {quartos}
                    </span>
                ) : <span className="flex items-center"><Bed className="mr-1 text-gray-300" size={18} /> -</span>}
                
                {banheiros ? (
                    <span className="flex items-center">
                        <Bath className="mr-1 text-gray-500" size={18} /> {banheiros}
                    </span>
                ) : <span className="flex items-center"><Bath className="mr-1 text-gray-300" size={18} /> -</span>}
                
                {garagens ? (
                    <span className="flex items-center">
                        <Car className="mr-1 text-gray-500" size={18} /> {garagens}
                    </span>
                ) : <span className="flex items-center"><Car className="mr-1 text-gray-300" size={18} /> -</span>}
                
                {areaConstruida ? (
                    <span className="flex items-center">
                        <SquareAsterisk className="mr-1 text-gray-500" size={18} /> {Math.trunc(areaConstruida)}
                    </span>
                ) : <span className="flex items-center"><SquareAsterisk className="mr-1 text-gray-300" size={18} /> -</span>}
            </div>

            <div className={`absolute bottom-0 left-0 right-0 h-8 z-10 ${isHovered ? 'bg-transparent' : 'bg-re-bg'}`}></div>

             {showMenu && (
                <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    className="z-50 bg-re-bg rounded-lg shadow-lg p-3 w-48 border border-gray-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Typography variant="subtitle1" className="text-sm font-medium text-re-text-main font-montserrat mb-2 px-2">
                        Compartilhar
                    </Typography>
                    <div className="space-y-1">
                        <WhatsappShareButton url={shareUrl} title={`Confira este imóvel: ${propertyType} em ${bairro}, ${cidade}`}>
                            <div className="flex items-center p-2 text-sm rounded hover:bg-gray-100 text-gray-700 cursor-pointer">
                                <FiSend className="mr-2" size={16} /> WhatsApp
                            </div>
                        </WhatsappShareButton>
                        <FacebookShareButton url={shareUrl}>
                            <div className="flex items-center p-2 text-sm rounded hover:bg-gray-100 text-gray-700 cursor-pointer">
                                <FiFacebook className="mr-2" size={16} /> Facebook
                            </div>
                        </FacebookShareButton>
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center w-full p-2 text-sm rounded hover:bg-gray-100 text-gray-700 cursor-pointer"
                        >
                            <FiCopy className="mr-2" size={16} /> Copiar Link
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Card;