import type { Config } from 'tailwindcss';
const defaultTheme = require('tailwindcss/defaultTheme');

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/antd/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px',
      '3xl': '1920px',
      '4xl': '2560px',
      '5xl': '3840px',
      '6xl': '4096px',
      '7xl': '5120px',
      '8xl': '6144px',
      '9xl': '7680px',
    },
    extend: {
      colors: {
        // Paleta Template Imobiliário
        're-base': '#2C3E50', // Azul Escuro Sóbrio (era Grafite Escuro / Azul Petróleo)
        're-accent': '#E67E22', // Laranja Queimado Suave (era Verde Vibrante)
        're-bg': '#FFFFFF', // Branco Puro (mantido)
        're-bg-alt': '#F8F9FA', // Cinza Muito Claro (era Cinza Gelo)
        're-text-main': '#34495E', // Cinza Azulado Escuro (era Grafite Escuro / Azul Petróleo)
        're-text-secondary': '#7F8C8D', // Cinza Médio Neutro (era Cinza Esverdeado Médio)
        're-text-tertiary': '#B0BEC5', // Cinza Claro Azulado (era Cinza Esverdeado Claro)
        're-text-invert': '#FFFFFF', // Branco para textos invertidos (mantido)
        're-success': '#28A745', // Verde Sucesso (atualizado)
        're-warning': '#FFC107', // Amarelo Aviso (atualizado)
        're-error': '#DC3545', // Vermelho Erro (atualizado)
        're-info': '#6C757D', // Cinza Informativo (atualizado)
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'home': "url('/images/capa.webp')",
        'dourado': 'linear-gradient(to right, #E67E22 0%, #E67E22 80%, #E67E22 100%)', // Atualizado para usar a cor de destaque laranja
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
};

export default config;