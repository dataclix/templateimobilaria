import React, { useState, Suspense, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Box, Typography, Grid, Dialog } from '@mui/material';
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { 
    filtrosAtom, 
    filtroSelecionadoAtom, 
    modalidadeAtom 
} from "@/pages/imoveis";

// Lazy load do componente de formulário com um fallback
const Forms = dynamic(() => import('@/components/Forms'), {
    ssr: false,
    loading: () => <div className="h-96 w-full flex items-center justify-center text-gray-600 p-4">Carregando Formulário...</div>
});

// Componente de Link auxiliar para padronizar estilo
interface FooterLinkProps {
    href: string;
    children: React.ReactNode;
    isExternal?: boolean;
    ariaLabel?: string;
    onClick?: () => void;
}

const FooterLink: React.FC<FooterLinkProps> = memo(({ href, children, isExternal, ariaLabel, onClick }) => (
    <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        aria-label={ariaLabel}
        className="text-re-accent hover:text-re-text-invert transition-colors duration-200 ease-in-out flex items-center group"
        onClick={onClick}
    >
        <span className="h-1 w-0 bg-re-accent group-hover:w-3 mr-0 group-hover:mr-2 transition-all duration-300"></span>
        {children}
    </Link>
));
FooterLink.displayName = 'FooterLink';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const router = useRouter();
    const [, setFiltros] = useAtom(filtrosAtom);
    const [, setFiltroSelecionado] = useAtom(filtroSelecionadoAtom);
    const [, setModalidade] = useAtom(modalidadeAtom);

    // Handlers para modal com useCallback
    const showModal = useCallback(() => setModalVisible(true), []);
    const handleModalClose = useCallback(() => setModalVisible(false), []);

    // Handlers para navegação com filtros aplicados
    const navigateWithFilters = useCallback((params: { 
        modalidade?: string;
        tipo?: number[];
        subtipo?: number[];
        categoria?: number;
    }) => {
        // Aplicar modalidade
        if (params.modalidade) {
            setModalidade(params.modalidade);
        }

        // Aplicar filtros
        const filtrosParaApi = {
            idInterno: undefined,
            modalidade: params.modalidade ? [params.modalidade] : undefined,
            idTipo: params.tipo,
            idSubtipo: params.subtipo,
        };

        // Aplicar filtro selecionado (categoria)
        if (params.categoria !== undefined) {
            setFiltroSelecionado(params.categoria);
        }

        setFiltros(filtrosParaApi);
        router.push("/imoveis");
    }, [router, setFiltros, setFiltroSelecionado, setModalidade]);

    const handleComprarClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        navigateWithFilters({ modalidade: "VENDA" });
    }, [navigateWithFilters]);

    const handleAlugarClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        navigateWithFilters({ modalidade: "ALUGUEL" });
    }, [navigateWithFilters]);

    const handleCasasClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        navigateWithFilters({ tipo: [2], categoria: 1 });
    }, [navigateWithFilters]);

    const handleApartamentosClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        navigateWithFilters({ tipo: [1], categoria: 2 });
    }, [navigateWithFilters]);

    return (
        <>
            {/* Footer Principal */}
            <footer className="bg-re-base text-re-text-invert font-sans">
                {/* Parte Superior com o Conteúdo Principal */}
                <div className="container mx-auto px-4 lg:px-8 py-16">
                    <Grid container spacing={6} justifyContent="center">
                        {/* Coluna 1: Logo e Sobre */}
                        <Grid item xs={12} sm={6} md={4} lg={3} className="flex flex-col items-center md:items-start">
                            <div className="flex flex-col w-full items-center md:items-start">
                                <Link href="/" className="mb-5 inline-block">
                                   <Image
                                        src="/images/logo.webp"
                                        alt="Logo da Imobiliária"
                                        width={130}
                                        height={70}
                                        className="w-[130px] h-auto mx-auto md:mx-0"
                                        style={{ maxWidth: '130px', height: 'auto' }}
                                    />
                                </Link>
                                <p className="text-sm text-re-text-tertiary mb-6 leading-relaxed font-poppins text-center md:text-left">
                                    Conectamos pessoas e sonhos através dos melhores imóveis. Atuamos com dedicação e profissionalismo para oferecer a melhor experiência imobiliária.
                                </p>
                                <div className="flex space-x-3 mb-6 justify-center md:justify-start w-full">
                                    <a
                                        href="#"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Facebook"
                                        className="w-9 h-9 rounded-full bg-re-accent flex items-center justify-center text-re-text-invert hover:bg-re-text-tertiary transition-colors"
                                    >
                                        <FaFacebookF size={16} />
                                    </a>
                                    <a
                                        href="#"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Instagram"
                                        className="w-9 h-9 rounded-full bg-re-accent flex items-center justify-center text-re-text-invert hover:bg-re-text-tertiary transition-colors"
                                    >
                                        <FaInstagram size={16} />
                                    </a>
                                </div>
                            </div>
                        </Grid>

                        {/* Coluna 2: Links de Navegação */}
                        <Grid item xs={12} sm={6} md={2} lg={2} className="flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="mb-8 md:mb-0 w-full">
                                <Typography variant="subtitle1" component="h3" className="text-re-text-invert font-montserrat mb-5 pb-2 border-b border-re-accent/30">
                                    Navegação
                                </Typography>
                                <ul className="space-y-3 flex flex-col items-center md:items-start">
                                    <li className="w-full flex justify-center md:justify-start"><FooterLink href="/">Início</FooterLink></li>
                                    <li className="w-full flex justify-center md:justify-start"><FooterLink href="/sobre">Sobre</FooterLink></li>
                                    <li className="w-full flex justify-center md:justify-start"><FooterLink href="/imoveis">Imóveis</FooterLink></li>
                                    <li className="w-full flex justify-center md:justify-start"><FooterLink href="/contato">Contato</FooterLink></li>
                                </ul>
                            </div>
                        </Grid>

                        {/* Coluna 3: Links Imóveis */}
                        <Grid item xs={12} sm={6} md={3} lg={3} className="flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="w-full">
                                <Typography variant="subtitle1" component="h3" className="text-re-text-invert font-montserrat mb-5 pb-2 border-b border-re-accent/30">
                                    Imóveis
                                </Typography>
                                <ul className="space-y-3 flex flex-col items-center md:items-start">
                                    <li className="w-full flex justify-center md:justify-start">
                                        <Link 
                                            href="/imoveis" 
                                            onClick={handleComprarClick}
                                            className="text-re-accent hover:text-re-text-invert transition-colors duration-200 ease-in-out flex items-center group"
                                        >
                                            <span className="h-1 w-0 bg-re-accent group-hover:w-3 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                            Comprar
                                        </Link>
                                    </li>
                                    <li className="w-full flex justify-center md:justify-start">
                                        <Link 
                                            href="/imoveis" 
                                            onClick={handleAlugarClick}
                                            className="text-re-accent hover:text-re-text-invert transition-colors duration-200 ease-in-out flex items-center group"
                                        >
                                            <span className="h-1 w-0 bg-re-accent group-hover:w-3 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                            Alugar
                                        </Link>
                                    </li>
                                    <li className="w-full flex justify-center md:justify-start">
                                        <Link 
                                            href="/imoveis" 
                                            onClick={handleCasasClick}
                                            className="text-re-accent hover:text-re-text-invert transition-colors duration-200 ease-in-out flex items-center group"
                                        >
                                            <span className="h-1 w-0 bg-re-accent group-hover:w-3 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                            Casas
                                        </Link>
                                    </li>
                                    <li className="w-full flex justify-center md:justify-start">
                                        <Link 
                                            href="/imoveis" 
                                            onClick={handleApartamentosClick}
                                            className="text-re-accent hover:text-re-text-invert transition-colors duration-200 ease-in-out flex items-center group"
                                        >
                                            <span className="h-1 w-0 bg-re-accent group-hover:w-3 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                            Apartamentos
                                        </Link>
                                    </li>
                                    <li className="w-full flex justify-center md:justify-start">
                                        <button
                                            onClick={showModal}
                                            className="text-re-accent hover:text-re-text-invert transition-colors duration-200 ease-in-out flex items-center group"
                                        >
                                            <span className="h-1 w-0 bg-re-accent group-hover:w-3 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                            Fale Conosco
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </Grid>

                        {/* Coluna 4: Contato */}
                        <Grid item xs={12} sm={6} md={3} lg={3} className="flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="w-full">
                                <Typography variant="subtitle1" component="h3" className="text-re-text-invert font-montserrat mb-5 pb-2 border-b border-re-accent/30">
                                    Contato
                                </Typography>
                                <ul className="space-y-4 flex flex-col items-center md:items-start">
                                    <li className="w-full flex items-start justify-center md:justify-start">
                                        <FaMapMarkerAlt className="text-re-accent mr-2 min-w-[16px] mt-1" size={16} />
                                        <span className="text-sm text-re-text-tertiary leading-tight">
                                            Endereço da Imobiliária, 100<br />
                                            Sua Cidade - UF, 00000-000
                                        </span>
                                    </li>
                                    <li className="w-full flex items-center justify-center md:justify-start">
                                        <FaPhone className="text-re-accent mr-2" size={14} />
                                        <a 
                                            href="tel:+5500000000000" 
                                            className="text-sm text-re-text-tertiary hover:text-re-accent transition-colors duration-300"
                                        >
                                            +55 (00) 0000-0000
                                        </a>
                                    </li>
                                    <li className="w-full flex items-center justify-center md:justify-start">
                                        <FaWhatsapp className="text-re-accent mr-2" size={16} />
                                        <a 
                                            href="https://wa.me/5500000000000" 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-sm text-re-text-tertiary hover:text-re-accent transition-colors duration-300"
                                        >
                                            +55 (00) 00000-0000
                                        </a>
                                    </li>
                                    <li className="w-full flex items-center justify-center md:justify-start">
                                        <MdEmail className="text-re-accent mr-2" size={16} />
                                        <a 
                                            href="mailto:contato@imobiliaria-template.com.br" 
                                            className="text-sm text-re-text-tertiary hover:text-re-accent transition-colors duration-300"
                                        >
                                            contato@imobiliaria-template.com.br
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </Grid>
                    </Grid>
                </div>

                {/* Parte Inferior com Copyright e Créditos */}
                <div className="border-t border-re-accent/20 py-6">
                    <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-re-text-tertiary mb-4 md:mb-0 font-poppins text-center md:text-left w-full md:w-auto">
                            &copy; {currentYear} RE Imóveis. Todos os direitos reservados.
                        </p>
                        <div className="flex items-center text-sm text-re-text-tertiary text-center md:text-left">
                            <span>Desenvolvido por </span>
                            <a
                                href="https://www.dataclix.com.br"
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className="inline-flex items-center ml-1 hover:text-re-text-invert transition-colors"
                            >
                                <Image
                                    src="/images/logosite.webp"
                                    alt="Dataclix Logo"
                                    width={65}
                                    height={25}
                                    className="w-[65px] h-auto ml-1"
                                    style={{ maxWidth: '65px', height: 'auto' }}
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Dialog para o Formulário */}
            <Dialog
                open={modalVisible}
                onClose={handleModalClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        p: 0,
                        overflow: 'hidden',
                    }
                }}
            >
                <Suspense fallback={<div className="h-96 w-full flex items-center justify-center text-gray-600 p-4">Carregando Formulário...</div>}>
                    <Forms onClose={handleModalClose} />
                </Suspense>
            </Dialog>

            {/* Barra de Copyright */}
            <div className="bg-re-base border-t border-re-text-tertiary/20 py-4">
                <div className="container mx-auto px-4 lg:px-8 text-center">
                    <p className="text-xs text-re-text-tertiary font-poppins">
                        &copy; {currentYear} Imobiliária | Todos os direitos reservados | Desenvolvido por <a href="#" target="_blank" rel="noopener noreferrer" className="text-re-accent hover:text-re-text-invert transition-colors">Nome da Sua Empresa</a>
                    </p>
                </div>
            </div>
        </>
    );
};

export default memo(Footer);