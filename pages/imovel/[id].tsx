import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { NextSeo } from 'next-seo'; // <-- Já importado
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import Head from 'next/head'; // <-- SEO: Importado
import { useRouter } from 'next/router'; // Adicionando o router para uso na solução de compartilhamento
import {
    FaBed,
    FaBath,
    FaCar,
    FaRulerCombined,
    FaShareAlt,
    FaWhatsapp,
    FaCopy,
    FaFacebook,
    FaMapMarkerAlt,
    FaHeart,
    FaRegHeart,
    FaArrowLeft,
    FaArrowRight
} from 'react-icons/fa';
import { BsCheckCircleFill, BsImages, BsFullscreen } from 'react-icons/bs';

// Lightbox and Swiper imports (Mantidos como no original)
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
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { Navigation, Pagination, EffectFade, Thumbs } from 'swiper/modules';

// Components and Constants (Mantidos como no original)
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { url, urlSite } from '@/components/globals/variavels'; // <-- urlSite já importado
import { Alert, Slide, Snackbar } from '@mui/material';
import Similares from '@/components/Similares';

// Types (Mantidos como no original)
interface Imovel {
    id: string;
    idInterno: string;
    titulo: string; // Usado para SEO
    descricao: string | null; // Usado para SEO
    bairro: string; // Usado para SEO
    cidade: string; // Usado para SEO
    estado: string;
    estadoSigla: string; // Usado para SEO
    valor: number; // Usado para SEO
    quartos: number; // Usado para SEO
    banheiros: number; // Usado para SEO
    garagens: number;
    areaConstruida: string; // Usado para SEO
    areaTerreno: string;
    modalidade: string; // Usado para SEO
    fotos: string[]; // Usado para SEO (imagem OG)
    captador: {
        nome: string;
        foto: string | null;
        celular: string;
        creci: string;
    };
    atributos: { atributo: { id: string; nome: string } }[]; // Usado para SEO
    permuta: boolean;
    tipo: {
        id: number;
        nome: string; // Usado para SEO
    } | null;
    subtipo: {
        id: number;
        nome: string;
    };
    categoria?: {
        nome: string;
        cor: string;
    };
    exibirDetalhesEnderecoSite: boolean; // Usado para SEO (endereço)
    numero: string; // Usado para SEO (endereço)
    complemento: string;
    logradouro: string; // Usado para SEO (endereço)
}

interface ImovelProps {
    imovel: Imovel;
}

// Constants (Mantidos como no original)
const WHATSAPP_RENTAL = '5532998650909';
const WHATSAPP_SALES = '5532998650909';
const DEFAULT_WHATSAPP = WHATSAPP_SALES;

// Helper functions (Mantidos como no original)
const getFirstAndLastName = (fullName: string) => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0];
    return `${names[0]} ${names[names.length - 1]}`;
};

const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) { return `55${cleaned}`; }
    if (cleaned.length === 10) { return `55${cleaned}`; }
    if (cleaned.length === 13 && cleaned.startsWith('55')) { return cleaned; }
    return cleaned;
};


const Imovel: React.FC<ImovelProps> = ({ imovel }) => {
    // State hooks (Mantidos como no original)
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [isFavorite, setIsFavorite] = useState(false);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
    const [selectedTab, setSelectedTab] = useState<'details'>('details');
    const router = useRouter(); // Obter o router para manipulação avançada de URL

    // Format price (Mantido como no original)
    const formatarPreco = (preco: number) =>
        preco !== 0
            ? preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            : 'Consulte-nos';

    // Functions (Mantidos como no original)
    const openLightbox = (index: number) => {
        setCurrentSlideIndex(index);
        setLightboxOpen(true);
    };

    // getWhatsAppNumber (Mantido como no seu código original - com valor fixo)
    const getWhatsAppNumber = (): string => {
        return '5532998650909';
    };

    // handleWhatsapp (Mantido como no original)
    const handleWhatsapp = () => {
        try {
            const whatsappNumber = getWhatsAppNumber();
            // Corrigido para usar URL canônica
            const messageText = `Olá! Tenho interesse no imóvel: ${canonicalUrl} - Código: ${imovel.idInterno}`;
            const message = encodeURIComponent(messageText);
            const shareUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}&app_absent=0`;
            window.open(shareUrl, '_blank');
        } catch (error) {
            setSnackbarMessage('Erro ao enviar mensagem');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            console.error('Error sending WhatsApp message:', error);
        }
    };

    // handleCopyLink corrigido com verificação de clipboard e método alternativo
    const handleCopyLink = () => {
        // Garante que estamos usando a URL canônica correta
        const propertyUrl = canonicalUrl;

        // Função para mostrar feedback de sucesso
        const showSuccess = () => {
            setSnackbarMessage('Link copiado para a área de transferência!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setShowMenu(false);
        };

        // Função para mostrar erro
        const showError = (err: any) => {
            setSnackbarMessage('Falha ao copiar o link');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            console.error('Failed to copy link:', err);
        };

        // Verifica se estamos no navegador e se a API Clipboard está disponível
        if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
            // Usa API Clipboard moderna
            navigator.clipboard.writeText(propertyUrl)
                .then(showSuccess)
                .catch(showError);
        } else {
            // Método alternativo para navegadores mais antigos ou SSR
            try {
                // Cria um elemento temporário
                const textArea = document.createElement('textarea');
                textArea.value = propertyUrl;

                // Evita rolar para o elemento
                textArea.style.position = 'fixed';
                textArea.style.left = '0';
                textArea.style.top = '0';
                textArea.style.opacity = '0';

                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                // Executa o comando de cópia
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);

                if (successful) {
                    showSuccess();
                } else {
                    showError(new Error('execCommand returned false'));
                }
            } catch (err) {
                showError(err);
            }
        }
    };

    // toggleMenu (Mantido como no original)
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    // toggleFavorite (Mantido como no original)
    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        setSnackbarMessage(isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
    };

    // captadorInfo (Mantido como no seu código original - com valores fixos)
    const captadorInfo = {
        name: 'Imobiliária',
        type: 'Imobiliária',
        photo: '/images/reimoveis2.webp',
        showCreci: true, // Mantido como true
        creci: '00000' // CRECI genérico
    };

    // handleCloseSnackbar (Mantido como no original)
    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') { return; }
        setSnackbarOpen(false);
    };

    // groupAttributes (Mantido como no original)
    const groupAttributes = () => {
        const groups: { [key: string]: string[] } = {
            'Interiores': [], 'Exteriores': [], 'Segurança': [], 'Outros': []
        };
        imovel.atributos.forEach(item => {
            const name = item.atributo.nome.toLowerCase(); // Case-insensitive check
            if (name.includes('sala') || name.includes('quarto') || name.includes('cozinha') || name.includes('banheiro') || name.includes('copa') || name.includes('escritório') || name.includes('lavabo')) {
                groups['Interiores'].push(item.atributo.nome);
            } else if (name.includes('piscina') || name.includes('jardim') || name.includes('área') || name.includes('varanda') || name.includes('quintal') || name.includes('churrasqueira') || name.includes('gourmet')) {
                groups['Exteriores'].push(item.atributo.nome);
            } else if (name.includes('alarme') || name.includes('segurança') || name.includes('portaria') || name.includes('cerca') || name.includes('câmera') || name.includes('interfone') || name.includes('portão eletrônico')) {
                groups['Segurança'].push(item.atributo.nome);
            } else {
                groups['Outros'].push(item.atributo.nome);
            }
        });
        return groups;
    };
    const attributes = groupAttributes(); // Mantido


    // --- SEO Content Generation ---
    const propertyType = imovel.tipo?.nome?.includes('Terrenos') || imovel.tipo?.nome?.includes('Comércio')
        ? imovel.subtipo?.nome
        : imovel.tipo?.nome || 'Imóvel';
    
    const propertySubType = !imovel.tipo?.nome?.includes('Terrenos') && 
                            !imovel.tipo?.nome?.includes('Comércio') && 
                            imovel.subtipo?.nome && 
                            imovel.tipo?.nome !== imovel.subtipo?.nome && 
                            imovel.subtipo?.nome !== 'Padrão'
                            ? ' ' + imovel.subtipo?.nome 
                            : '';
                            
    const modalityAction = imovel.modalidade?.toUpperCase() === 'ALUGUEL' ? 'para Alugar' : 'à Venda';
    const location = `${imovel.bairro}, ${imovel.cidade}`;
    // Garantir que a URL canônica está correta e não tem barras duplicadas
    const canonicalUrl = `${urlSite.replace(/\/$/, '')}/${'imovel'}/${imovel.idInterno}`.replace(/([^:])\/+/g, '$1/');

    // Simplifica a correção de URLs e remove manipulação excessiva de meta tags
    useEffect(() => {
        // Função para detectar e corrigir URLs malformadas
        const fixShareURL = () => {
            try {
                // Verifica se a URL atual tem duplicação
                const currentHref = window.location.href;
                // Padrão para URL correta: https://www.zanferimoveis.com.br/imovel/12345
                const urlBase = urlSite.replace(/\/$/, '');
                const properPattern = new RegExp(`^${urlBase.replace(/\./g, '\\.')}\/imovel\/\\d+$`);

                // Verifica se a URL já está no formato correto
                if (properPattern.test(currentHref)) {
                    return; // URL já está correta
                }

                // Verifica se há duplicação de domínio
                if (currentHref.includes('/imovel/') &&
                    (currentHref.indexOf('/imovel/') !== currentHref.lastIndexOf('/imovel/') ||
                        currentHref.includes('/imovel/www'))) {

                    // Extrai o código do imóvel do final da URL malformada
                    const parts = currentHref.split('/imovel/');
                    if (parts.length > 1) {
                        const lastPart = parts[parts.length - 1];
                        // Se é um código de imóvel válido (somente números)
                        if (/^\d+$/.test(lastPart)) {
                            // Redireciona para URL correta
                            const correctURL = `${urlBase}/imovel/${lastPart}`;
                            router.replace(correctURL, undefined, { shallow: true });
                            return;
                        }
                    }

                    // Caso não consiga extrair o código, redireciona para a URL canônica
                    router.replace(canonicalUrl, undefined, { shallow: true });
                }
            } catch (error) {
                console.error('Erro ao corrigir URL de compartilhamento:', error);
            }
        };

        // Executa a correção imediatamente
        fixShareURL();

        // Define um método global para evitar problemas de compartilhamento
        if (typeof window !== 'undefined') {
            // @ts-ignore - Adiciona um método global para obter o URL correto
            window.getCorrectShareURL = () => canonicalUrl;
        }
    }, [canonicalUrl, router]);

    const pageTitle = `${propertyType}${propertySubType} ${modalityAction} em ${location} | Imobiliária (Cód: ${imovel.idInterno})`;
    let pageDescription = `${propertyType}${propertySubType} ${modalityAction} em ${location}. ${imovel.quartos || ''}${imovel.quartos ? ' quarto(s)' : ''}${imovel.banheiros ? `, ${imovel.banheiros} banheiro(s)` : ''}${imovel.garagens ? `, ${imovel.garagens} vaga(s)` : ''}${imovel.areaConstruida ? `, ${imovel.areaConstruida}m²` : ''}.`;
    if (imovel.descricao) {
        pageDescription += ` ${imovel.descricao.substring(0, 100)}...`; // Adiciona trecho da descrição
    }
    pageDescription += ` Veja fotos e detalhes na Imobiliária. Código ${imovel.idInterno}.`;
    const ogImageUrl = imovel.fotos && imovel.fotos.length > 0 ? imovel.fotos[0] : `${urlSite}/images/og-image.jpg`; // Usa primeira foto ou fallback

    // --- Structured Data Generation ---
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Início", "item": urlSite },
            // Adiciona link para a página de listagem se fizer sentido
            { "@type": "ListItem", "position": 2, "name": `Imóveis ${imovel.modalidade?.toUpperCase() === 'ALUGUEL' ? 'para Alugar' : 'à Venda'}`, "item": `${urlSite}imoveis?modalidade=${imovel.modalidade?.toUpperCase()}` },
            { "@type": "ListItem", "position": 3, "name": `${propertyType}${propertySubType} em ${imovel.bairro} (Cód: ${imovel.idInterno})` }
        ]
    };

    const propertyAddressSchema = imovel.exibirDetalhesEnderecoSite ? {
        "@type": "PostalAddress",
        "streetAddress": `${imovel.logradouro || ''}${imovel.numero ? ', ' + imovel.numero : ''}${imovel.complemento ? ' - ' + imovel.complemento : ''}`.trim(),
        "addressLocality": imovel.cidade,
        "addressRegion": imovel.estadoSigla,
        // "postalCode": "CEP_DO_IMOVEL_SE_TIVER", // Adicionar se tiver
        "addressCountry": "BR"
    } : { // Endereço genérico se não puder exibir detalhes
        "@type": "PostalAddress",
        "addressLocality": imovel.cidade,
        "addressRegion": imovel.estadoSigla,
        "addressCountry": "BR"
    };

    const propertySchemaType = () => {
        const typeName = imovel.tipo?.nome.toLowerCase();
        if (typeName?.includes('casa')) return "House";
        if (typeName?.includes('apartamento')) return "Apartment";
        if (typeName?.includes('terreno') || typeName?.includes('lote')) return "Land";
        if (typeName?.includes('comercial') || typeName?.includes('loja') || typeName?.includes('sala')) return "Store"; // Ou "Office"
        return "Residence"; // Fallback geral
    }

    const realEstateListingSchema = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": imovel.titulo || pageTitle, // Usa título do imóvel ou o título da página
        "description": imovel.descricao || pageDescription, // Usa descrição do imóvel ou a da página
        "url": canonicalUrl,
        "image": imovel.fotos && imovel.fotos.length > 0 ? imovel.fotos : [ogImageUrl], // Lista de fotos ou fallback
        "offers": {
            "@type": "Offer",
            "price": imovel.valor,
            "priceCurrency": "BRL",
            // Definir disponibilidade baseada na modalidade ou status (se houver)
            "availability": imovel.modalidade?.toUpperCase() === 'ALUGUEL' ? "https://schema.org/RentAction" : "https://schema.org/SellAction", // Indica Ação
            "seller": { // Informações da Imobiliária
                "@type": "RealEstateAgent",
                "name": "Imobiliária",
                "url": urlSite,
                "logo": `${urlSite}/images/reimoveis.webp`, // VERIFICAR CAMINHO
                "telephone": getWhatsAppNumber(), // Número principal de contato
                // Endereço da imobiliária, não do imóvel
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Rua Exemplo, 123", 
                    "addressLocality": "Cidade",
                    "addressRegion": "UF",
                    "postalCode": "00000-000",
                    "addressCountry": "BR"
                }
            }
        },
        "itemOffered": {
            "@type": propertySchemaType(), // Tipo dinâmico: House, Apartment, Land, etc.
            "name": imovel.titulo || `${propertyType}${propertySubType} em ${location}`,
            "description": imovel.descricao || pageDescription.substring(0, 200),
            ...(imovel.quartos && { "numberOfRooms": imovel.quartos }),
            ...(imovel.banheiros && { "numberOfBathroomsTotal": imovel.banheiros }),
            ...(imovel.areaConstruida && !isNaN(parseFloat(imovel.areaConstruida)) && {
                "floorSize": {
                    "@type": "QuantitativeValue",
                    "value": parseFloat(imovel.areaConstruida),
                    "unitCode": "MTK" // Código para metros quadrados
                }
            }),
            "address": propertyAddressSchema, // Endereço do imóvel (condicional)
            ...(imovel.atributos.length > 0 && {
                "amenityFeature": imovel.atributos.map(attr => ({
                    "@type": "LocationFeatureSpecification",
                    "name": attr.atributo.nome,
                    "value": "True"
                }))
            })
        },
        "realEstateAgent": { // Repete info do agente para clareza
            "@type": "RealEstateAgent",
            "name": "Imobiliária",
            "url": urlSite
        }
        // "datePosted": "YYYY-MM-DD" // Adicionar se tiver data de cadastro
    };
    // --- Fim SEO Enhancements ---

    // Adicione este hook useEffect para sobrescrever o método de compartilhamento dos navegadores
    useEffect(() => {
        // Só executa no lado do cliente
        if (typeof window === 'undefined') return;

        // Sobrescreve o navigator.share API se disponível
        if (typeof navigator !== 'undefined' && navigator.share) {
            const originalShare = navigator.share;
            // @ts-ignore - sobrescrevendo método nativo
            navigator.share = async (data) => {
                try {
                    // Certifica que estamos compartilhando a URL correta
                    if (data && typeof data === 'object') {
                        const fixedData = { ...data };

                        // Substitui a URL por nossa URL canônica
                        if (fixedData.url) {
                            // Verifica se a URL já está no formato correto
                            const urlBase = urlSite.replace(/\/$/, '');
                            const urlPattern = new RegExp(`^${urlBase.replace(/\./g, '\\.')}\/imovel\/\\d+$`);

                            // Verifica se a URL já está no formato correto
                            if (!urlPattern.test(fixedData.url)) {
                                fixedData.url = canonicalUrl;
                            }
                        } else {
                            fixedData.url = canonicalUrl;
                        }

                        // Chama o método original com dados corrigidos
                        return await originalShare(fixedData);
                    }
                    return await originalShare(data);
                } catch (error) {
                    console.error('Erro ao compartilhar:', error);
                    throw error;
                }
            };
        }

        // Tenta corrigir problemas nos navegadores injetando meta tags adicionais
        const headElement = document.head;

        // Verifica se já existem meta tags OG para URL
        const existingOgUrl = document.querySelector('meta[property="og:url"]');
        if (!existingOgUrl) {
            const metaOgUrl = document.createElement('meta');
            metaOgUrl.setAttribute('property', 'og:url');
            metaOgUrl.setAttribute('content', canonicalUrl);
            headElement.appendChild(metaOgUrl);
        } else {
            // Garante que o valor está correto
            existingOgUrl.setAttribute('content', canonicalUrl);
        }

        // Adiciona atributo nas tags <a> para evitar problemas de compartilhamento
        document.querySelectorAll('a[href*="/imovel/"]').forEach(link => {
            if (link instanceof HTMLAnchorElement) {
                link.setAttribute('data-share-url', canonicalUrl);
            }
        });
    }, [canonicalUrl]);

    // Função para compartilhamento personalizado
    const shareWithNative = async (platform?: string) => {
        const title = pageTitle;
        const text = `${propertyType} ${modalityAction} em ${location}. Código: ${imovel.idInterno}`;
        const url = canonicalUrl;

        // Opcionalmente formata o texto com base na plataforma
        const getFormattedText = () => {
            if (platform === 'whatsapp') {
                return `Olá! Tenho interesse no imóvel: ${url} - Código: ${imovel.idInterno}`;
            }
            if (platform === 'facebook') {
                return text;
            }
            return text;
        };

        try {
            // Verifica se Web Share API está disponível
            if (typeof navigator !== 'undefined' && navigator.share && !platform) {
                await navigator.share({
                    title,
                    text,
                    url
                });
                setSnackbarMessage('Conteúdo compartilhado com sucesso!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                return;
            }

            // Compartilhamento específico por plataforma
            if (platform === 'whatsapp') {
                const message = encodeURIComponent(getFormattedText());
                window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
            } else if (platform === 'facebook') {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
            } else if (platform === 'copy') {
                handleCopyLink();
            } else {
                // Fallback para compartilhamento manual
                handleCopyLink();
            }

            // Fecha o menu de compartilhamento
            setShowMenu(false);
        } catch (error) {
            console.error('Erro ao compartilhar:', error);
            // Fallback para cópia de link em caso de erro
            handleCopyLink();
        }
    };

    // Get category data - handle different possible structures
    const getCategoryData = () => {
        // Verificar se a categoria existe e tem a estrutura esperada
        if (imovel.categoria && typeof imovel.categoria === 'object') {
            // Extrair nome e cor, independente da estrutura exata
            const categoria = imovel.categoria as any;
            const nome = categoria.nome || categoria.name || '';
            let cor = categoria.cor || categoria.color || '';

            // Garantir que a cor seja uma string
            cor = String(cor || '');

            // Adicionar # se necessário
            if (cor && !cor.startsWith('#')) {
                cor = `#${cor}`;
            }

            // Só retorna se realmente tiver um nome de categoria
            if (nome) {
                return { nome, cor };
            }
        }

        // Se a categoria for uma string válida
        if (imovel.categoria && typeof imovel.categoria === 'string' && imovel.categoria !== '') {
            return {
                nome: imovel.categoria,
                cor: ''
            };
        }

        // Se não houver categoria válida, retorna null
        return null;
    };

    const categoryData = getCategoryData();

    useEffect(() => {
        if (categoryData && categoryData.cor) {
            const colorElement = document.querySelector('.category-label');
            if (colorElement && colorElement instanceof HTMLElement) {
                colorElement.style.backgroundColor = categoryData.cor || '#4FBFA5'; // Use API color or fallback to teal
            }
        }
    }, [categoryData]);

    return (
        <div className="min-h-screen bg-re-bg">
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
                    key="breadcrumb-imovel-jsonld"
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateListingSchema) }}
                    key="realestatelisting-imovel-jsonld"
                />
                <meta name="format-detection" content="telephone=no" />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:url" content={canonicalUrl} />
                <meta name="twitter:url" content={canonicalUrl} />
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
                    title: `${propertyType}${propertySubType} ${modalityAction} em ${location}`,
                    description: pageDescription.substring(0, 160),
                    images: [{
                        url: ogImageUrl,
                        width: 800,
                        height: 600,
                        alt: `Foto principal de ${propertyType}${propertySubType} ${modalityAction} em ${location}`,
                        type: 'image/jpeg'
                    }],
                    site_name: 'Imobiliária',
                    locale: 'pt_BR',
                    type: 'product',
                }}
                twitter={{
                    cardType: 'summary_large_image',
                }}
                additionalMetaTags={[
                    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
                    { name: 'robots', content: 'index, follow' },
                    { name: 'keywords', content: `${propertyType}${propertySubType}, ${imovel.modalidade}, ${imovel.bairro}, ${imovel.cidade}, ${imovel.estadoSigla}, comprar imóvel, alugar imóvel, imobiliária, ${imovel.tipo?.nome}, ${imovel.subtipo?.nome}, código ${imovel.idInterno}` },
                    { httpEquiv: 'content-type', content: 'text/html; charset=utf-8' },
                ]}
            />

            <Navbar />

            {/* Hero Gallery Section - Full Width */}
            <div className="relative">
                {/* Full-screen gallery slider */}
                <div className="relative h-[70vh] w-full">
                    <Swiper
                        modules={[Navigation, Pagination, EffectFade, Thumbs]}
                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        pagination={{
                            clickable: true,
                            el: '.swiper-pagination',
                            type: 'fraction'
                        }}
                        effect="fade"
                        loop={true}
                        className="h-full"
                        onSlideChange={(swiper) => setCurrentSlideIndex(swiper.realIndex)}
                    >
                        {imovel.fotos.map((foto, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative w-full h-full group cursor-pointer" onClick={() => openLightbox(index)}>
                                    <Image
                                        src={foto}
                                        alt={`Foto ${index + 1} de ${propertyType} ${modalityAction} em ${location}`}
                                        layout="fill"
                                        objectFit="cover"
                                        priority={index === 0}
                                        className="transition-transform duration-700 group-hover:scale-[1.03]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent opacity-60"></div>
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <BsFullscreen className="text-white text-5xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100" />
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                        <div className="swiper-button-prev !text-white !bg-black/40 !w-12 !h-12 !rounded-full !flex !items-center !justify-center !left-6 hover:!bg-black/60 transition-all duration-300">
                            <FaArrowLeft className="text-lg" />
                        </div>
                        <div className="swiper-button-next !text-white !bg-black/40 !w-12 !h-12 !rounded-full !flex !items-center !justify-center !right-6 hover:!bg-black/60 transition-all duration-300">
                            <FaArrowRight className="text-lg" />
                        </div>
                        <div className="absolute top-6 right-6 z-10 flex gap-3">
                            <button
                                onClick={() => openLightbox(currentSlideIndex)}
                                className="bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-300"
                                aria-label="Ver todas as fotos"
                            >
                                <BsImages className="text-gray-800" size={20} />
                            </button>
                            <button
                                onClick={toggleFavorite}
                                className="bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-300"
                                aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                            >
                                {isFavorite ? (
                                    <FaHeart className="text-red-500" size={20} />
                                ) : (
                                    <FaRegHeart className="text-gray-800" size={20} />
                                )}
                            </button>
                            <button
                                onClick={toggleMenu}
                                className="bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-300"
                                aria-label="Compartilhar imóvel"
                            >
                                <FaShareAlt className="text-gray-800" size={20} />
                            </button>
                        </div>
                        <div className="swiper-pagination absolute bottom-6 left-6 !w-auto !bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium"></div>
                    </Swiper>
                </div>

                {/* Gallery thumbnails - Moved right below the main image */}
                <div className="w-11/12 max-w-6xl mx-auto -mt-6 relative z-20 mb-6">
                    <div className="relative bg-white p-4 rounded-xl shadow-md">
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={12}
                            slidesPerView={2}
                            breakpoints={{
                                480: { slidesPerView: 3 },
                                640: { slidesPerView: 4 },
                                768: { slidesPerView: 5 },
                                1024: { slidesPerView: 7 }
                            }}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[Navigation, Thumbs]}
                            className="thumbs-swiper h-24 md:h-28"
                        >
                            {imovel.fotos.map((foto, index) => (
                                <SwiperSlide key={`thumb-${index}`}>
                                    <div
                                        className="relative h-full rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:opacity-90"
                                        style={{ borderColor: currentSlideIndex === index ? '#2e7d32' : 'transparent' }}
                                    >
                                        <Image
                                            src={foto}
                                            alt={`Thumbnail ${index + 1}`}
                                            layout="fill"
                                            objectFit="cover"
                                            className="transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>

                {/* Property Header - Moved below thumbnails */}
                <div className="w-11/12 max-w-6xl mx-auto mb-10">
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between">
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <span className="bg-[#e8f5e9] text-[#2e7d32] px-3 py-1 rounded-md text-sm font-semibold uppercase tracking-wide">
                                        {imovel.modalidade}
                                    </span>
                                    {categoryData && categoryData.nome && (
                                        <span
                                            className="px-3 py-1 rounded-md text-sm font-semibold uppercase tracking-wide text-white"
                                            style={{ backgroundColor: categoryData.cor || '#2e7d32' }}
                                        >
                                            {categoryData.nome}
                                        </span>
                                    )}
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm font-semibold">
                                        COD {imovel.idInterno}
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-re-text-main font-montserrat">
                                    {imovel.tipo?.nome?.includes('Terrenos') || imovel.tipo?.nome?.includes('Comércio')
                                        ? imovel.subtipo?.nome
                                        : imovel.tipo?.nome || "Imóvel"}
                                    {!imovel.tipo?.nome?.includes('Terrenos') && 
                                     !imovel.tipo?.nome?.includes('Comércio') && 
                                     imovel.subtipo?.nome && 
                                     imovel.tipo?.nome !== imovel.subtipo?.nome && 
                                     imovel.subtipo?.nome !== 'Padrão' 
                                     ? ' ' + imovel.subtipo?.nome : ''} em {imovel.bairro}
                                </h1>
                                <div className="flex items-center text-gray-600 text-re-text-secondary font-poppins">
                                    <FaMapMarkerAlt className="mr-2 text-[#2e7d32]" />
                                    <p className="text-md">
                                        {imovel.logradouro && imovel.exibirDetalhesEnderecoSite
                                            ? `${imovel.logradouro}, ${imovel.numero} - ${imovel.bairro}`
                                            : `${imovel.bairro}, ${imovel.cidade} - ${imovel.estadoSigla}`}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex flex-col items-end justify-center">
                                <div className="text-3xl md:text-4xl font-bold text-[#2e7d32]">
                                    {formatarPreco(imovel.valor)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Property details section */}
            <div className="pt-0 pb-20">
                <div className="container mx-auto px-4">
                    {/* Main content grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left column - Property details */}
                        <div className="lg:col-span-2 order-1 lg:order-1">
                            {/* Property description */}
                            {imovel.descricao && (
                                <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-100 w-full text-re-text-main font-montserrat">
                                        Sobre o imóvel
                                    </h2>
                                    <div className="prose prose-lg max-w-none text-gray-700 text-re-text-secondary font-poppins" 
                                        dangerouslySetInnerHTML={{ __html: imovel.descricao }} />
                                </div>
                            )}

                            {/* Property features */}
                            {imovel.atributos.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-100 w-full text-re-text-main font-montserrat">
                                        Características
                                    </h2>
                                    
                                    <div className="space-y-6">
                                        {Object.entries(attributes).map(([category, items]) =>
                                            items.length > 0 && (
                                                <div key={category} className="bg-[#f5f7fa] p-6 rounded-xl">
                                                    <h3 className="font-semibold text-gray-800 mb-4 text-lg text-re-text-secondary font-poppins">{category}</h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                        {items.map((item, index) => (
                                                            <div key={index} className="flex items-center">
                                                                <div className="w-5 h-5 bg-[#e8f5e9] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                                                    <BsCheckCircleFill className="text-[#2e7d32] text-sm" />
                                                                </div>
                                                                <span className="text-gray-700 text-re-text-secondary font-poppins">{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Features highlights - Redesigned with better visual hierarchy */}
                            <div className="bg-white rounded-xl shadow-md p-6 mb-12 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-100 w-full text-re-text-main font-montserrat">
                                    Características principais
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    {imovel.quartos > 0 && (
                                        <div className="bg-[#f5f7fa] rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:bg-[#e8f5e9] group">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:bg-[#2e7d32] transition-colors duration-300">
                                                    <FaBed className="text-[#2e7d32] text-xl group-hover:text-white transition-colors duration-300" />
                                                </div>
                                                <span className="text-gray-600 font-medium mb-1 group-hover:text-[#2e7d32] transition-colors duration-300 text-re-text-secondary font-poppins">Quartos</span>
                                                <span className="text-2xl font-bold text-gray-800">{imovel.quartos}</span>
                                            </div>
                                        </div>
                                    )}
                                    {imovel.banheiros > 0 && (
                                        <div className="bg-[#f5f7fa] rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:bg-[#e8f5e9] group">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:bg-[#2e7d32] transition-colors duration-300">
                                                    <FaBath className="text-[#2e7d32] text-xl group-hover:text-white transition-colors duration-300" />
                                                </div>
                                                <span className="text-gray-600 font-medium mb-1 group-hover:text-[#2e7d32] transition-colors duration-300 text-re-text-secondary font-poppins">Banheiros</span>
                                                <span className="text-2xl font-bold text-gray-800">{imovel.banheiros}</span>
                                            </div>
                                        </div>
                                    )}
                                    {imovel.garagens > 0 && (
                                        <div className="bg-[#f5f7fa] rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:bg-[#e8f5e9] group">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:bg-[#2e7d32] transition-colors duration-300">
                                                    <FaCar className="text-[#2e7d32] text-xl group-hover:text-white transition-colors duration-300" />
                                                </div>
                                                <span className="text-gray-600 font-medium mb-1 group-hover:text-[#2e7d32] transition-colors duration-300 text-re-text-secondary font-poppins">Vagas</span>
                                                <span className="text-2xl font-bold text-gray-800">{imovel.garagens}</span>
                                            </div>
                                        </div>
                                    )}
                                    {imovel.areaConstruida && (
                                        <div className="bg-[#f5f7fa] rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:bg-[#e8f5e9] group">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:bg-[#2e7d32] transition-colors duration-300">
                                                    <FaRulerCombined className="text-[#2e7d32] text-xl group-hover:text-white transition-colors duration-300" />
                                                </div>
                                                <span className="text-gray-600 font-medium mb-1 group-hover:text-[#2e7d32] transition-colors duration-300 text-re-text-secondary font-poppins">Área</span>
                                                <span className="text-2xl font-bold text-gray-800">{imovel.areaConstruida}m²</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right column - Contact card only */}
                        <div className="lg:col-span-1 order-2 lg:order-2">
                            {/* Contact card */}
                            <div className="bg-white rounded-2xl shadow-md overflow-hidden sticky top-24">
                                <div className="bg-gradient-to-r from-[#2fa74e] to-[#5cc6a2] p-6">
                                    <div className="flex items-center">
                                        <div className="w-16 h-16 rounded-full bg-white/20 p-1 mr-4">
                                            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white">
                                                <Image
                                                    src={captadorInfo.photo}
                                                    alt={captadorInfo.name}
                                                    width={64}
                                                    height={64}
                                                    objectFit="contain"
                                                    className="rounded-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-white">
                                            <h3 className="font-bold text-lg">Imobiliária</h3>
                                            <p className="text-emerald-50 font-medium text-sm">{captadorInfo.type}</p>
                                            {captadorInfo.showCreci && (
                                                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-md inline-block mt-1">
                                                    CRECI: {captadorInfo.creci}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="text-center mb-5">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1 text-re-text-main font-montserrat">
                                            Interessado neste imóvel?
                                        </h3>
                                        <p className="text-gray-600 text-re-text-secondary font-poppins">Entre em contato agora mesmo</p>
                                    </div>
                                    
                                    <button
                                        onClick={handleWhatsapp}
                                        className="w-full bg-re-accent hover:bg-re-base text-re-text-invert font-medium py-3 px-4 rounded-xl shadow-md flex items-center justify-center transition-all duration-300"
                                    >
                                        <FaWhatsapp className="mr-2 text-xl" />
                                        Falar no WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Imóveis Similares - Seção no final da página */}
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-100 w-full text-re-text-main font-montserrat">
                            Imóveis Similares
                        </h2>
                        <div className="bg-white rounded-2xl shadow-md p-8">
                            <Suspense fallback={<div className="text-center text-gray-500 py-6">Carregando imóveis similares...</div>}>
                                <Similares id={imovel.id} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={imovel.fotos.map((foto) => ({ src: foto }))}
                index={currentSlideIndex}
                plugins={[Captions, Fullscreen, Slideshow, Thumbnails, Zoom, Download]}
            />
            
            {/* Footer */}
            <Footer />
            
            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                TransitionComponent={Slide}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Additional CSS */}
            <style jsx global>{`
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
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

// getServerSideProps mantido idêntico ao original
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params as { id: string };
    try {
        // Rota original mantida
        const response = await axios.get(`${url}website/imovel/detalhes/${id}`);
        return {
            props: {
                imovel: response.data,
            },
        };
    } catch (error) {
        console.error('Error fetching property details:', error);
        // Tratamento de erro original mantido
        return {
            notFound: true,
        };
    }
};

export default Imovel;