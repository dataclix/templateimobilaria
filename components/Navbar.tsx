import React, { useState, memo, Suspense, useCallback } from "react";
import Link from "next/link";
import { Dialog } from "@mui/material";
import dynamic from "next/dynamic";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa"; // Removidos ícones não utilizados
import { useRouter } from 'next/router';

// Lazy load do componente de formulário com um fallback
const Forms = dynamic(() => import('@/components/Forms'), {
  ssr: false, // Formulários geralmente precisam do ambiente do cliente
  loading: () => <div className="h-96 flex items-center justify-center text-re-text-secondary">Carregando Formulário...</div>
});

// Interface para os links de navegação (mantida)
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

// Componente NavLink memoizado (mantido)
const NavLink = memo(({ href, children, onClick, className = '' }: NavLinkProps) => (
  <li>
    <Link
      href={href}
      className={`hover:opacity-80 transition-opacity ${className}`}
      onClick={onClick}
    >
      {children}
    </Link>
  </li>
));
NavLink.displayName = 'NavLink';

// Interface para o botão do menu mobile (mantida)
interface MenuButtonProps {
  onClick: () => void;
  isClose?: boolean;
  color?: string; // Permitir cor customizada
}

// Componente MenuButton memoizado (mantido)
const MenuButton = memo(({ onClick, isClose, color = 'currentColor' }: MenuButtonProps) => (
  <button
    onClick={onClick}
    className="lg:hidden focus:outline-none p-1" // Adicionado padding para área de clique maior
    aria-label={isClose ? 'Fechar menu' : 'Abrir menu'}
  >
    <svg
      className="h-6 w-6"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke={color} // Usa a cor passada pela prop
    >
      {isClose ? (
        <path d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path d="M4 6h16M4 12h16m-7 6h7" /> // Ícone de hambúrguer padrão
      )}
    </svg>
  </button>
));
MenuButton.displayName = 'MenuButton';

// --- Componente SocialIcon removido da Navbar pois a barra superior foi removida ---
// Se precisar dele em outro lugar, mantenha a definição original.

const Navbar: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const router = useRouter();

  // Não precisamos mais do useEffect de scroll nem do estado showWhiteBackground
  // Não precisamos mais do useEffect de favoritos nem do estado favoritesCount

  // useCallback para otimizar as funções de toggle e modal
  const toggleDrawer = useCallback(() => setIsDrawerOpen(prev => !prev), []);
  const showModal = useCallback(() => setModalVisible(true), []);
  const handleModalClose = useCallback(() => setModalVisible(false), []);
  const openModalAndCloseDrawer = useCallback(() => {
    showModal();
    toggleDrawer();
  }, [showModal, toggleDrawer]);

  // Handler para navegação mobile
  const handleMobileNav = useCallback((href: string) => {
    router.push(href);
    setIsDrawerOpen(false);
  }, [router]);

  // Links de navegação
  const navLinks = [
    { href: "/", text: "Início" },
    { href: "/sobre", text: "Sobre" },
    { href: "/imoveis", text: "Imóveis" },
    { href: "/contato", text: "Contato" },
  ];

  return (
    <>
      {/* Navbar Principal Fixa */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-re-base text-white shadow-md"> 
        <div className="container mx-auto px-[5%] py-3 flex items-center justify-between"> 
          {/* Logo */}
          <div className="flex-shrink-0"> 
            <Link href="/" className="block" aria-label="Ir para página inicial">
              <img
                src="/images/logo.webp" 
                alt="Logo da Imobiliária"
                width={104}
                height={40}
                className="h-auto"
                style={{ maxWidth: '104px', height: 'auto' }}
              />
            </Link>
          </div>

          {/* Links de Navegação Desktop (Centralizados) */}
          <div className="flex-grow hidden lg:flex justify-center items-center">
             <ul className="flex space-x-10"> 
              {navLinks.map(({ href, text }) => (
                <NavLink key={href} href={href} className="font-medium text-sm tracking-wide text-re-accent hover:text-white transition-colors duration-300 font-montserrat"> 
                  {text}
                </NavLink>
              ))}
            </ul>
          </div>


          {/* Botão Fale Conosco e Menu Mobile */}
          <div className="flex items-center space-x-4 flex-shrink-0"> 
            {/* Botão Desktop */}
            <div className="hidden lg:block">
              <button
                onClick={showModal}
                className="px-5 py-2 rounded-md bg-white text-re-base font-semibold text-sm hover:bg-re-bg-alt transition-all duration-300 shadow-sm hover:shadow-md font-poppins"
              >
                FALE CONOSCO
              </button>
            </div>

            {/* Botão do Menu Mobile */}
            <div className="lg:hidden">
              <MenuButton
                onClick={toggleDrawer}
                color="white" 
              />
            </div>
          </div>
        </div>
      </nav>

      {/* --- O div de espaçamento foi removido --- */}
      {/* Adicione padding-top ao seu layout principal ou ao primeiro elemento após a navbar */}
      {/* Exemplo: Em layout.tsx, o elemento <main> poderia ter `pt-[altura-da-navbar]` */}
      {/* A altura da navbar agora é aproximadamente 60px (py-3 + altura da logo), ajuste o padding conforme necessário */}


      {/* Drawer (Menu Mobile) */}
      <div
        className={`lg:hidden fixed inset-0 bg-white transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } z-[60]`} 
      >
        {/* Cabeçalho do Drawer */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          {/* Logo no Drawer */}
          <Link href="/" onClick={toggleDrawer}>
             <img
                src="/images/logo.webp" 
                alt="Logo da Imobiliária"
                width={120}
                height={45}
                className="h-auto"
                style={{ maxWidth: '120px', height: 'auto' }}
              />
          </Link>
          {/* Botão Fechar Drawer */}
          <button onClick={toggleDrawer} className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-all duration-300">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteúdo do Drawer */}
        <div className="p-6">
          <ul className="flex flex-col space-y-5">
            {navLinks.map(({ href, text }) => (
              <li key={href}>
                <button
                  onClick={() => handleMobileNav(href)}
                  className="block w-full text-left text-re-text-main text-base font-medium hover:text-re-accent transition-colors duration-300 font-montserrat py-2"
                >
                  {text}
                </button>
              </li>
            ))}
            {/* Botão Fale Conosco no Drawer */}
            <li>
              <button
                onClick={openModalAndCloseDrawer} 
                className="w-full mt-4 px-5 py-2.5 rounded-md border border-re-base text-re-base font-semibold text-sm bg-transparent hover:bg-re-base hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-re-base focus:ring-opacity-50 font-poppins"
              >
                FALE CONOSCO
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isDrawerOpen && (
         <div
           className="lg:hidden fixed inset-0 bg-re-base opacity-30 z-[55]"
           onClick={toggleDrawer}
           aria-hidden="true"
         />
       )}


      {/* Modal de Formulário */}
      <Dialog
        open={modalVisible}
        onClose={handleModalClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            boxShadow: 'none', // Remove shadow totally
            background: 'transparent',
            p: 0,
            overflow: 'visible',
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(30, 41, 59, 0.15)',
            backdropFilter: 'blur(2px)',
          }
        }}
      >
        {/* Suspense para carregamento assíncrono do formulário */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center text-re-text-secondary p-4">Carregando Formulário...</div>}>
          <Forms onClose={handleModalClose} />
        </Suspense>
      </Dialog>
    </>
  );
};

export default memo(Navbar); 