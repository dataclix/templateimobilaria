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
        // Paleta RE Imóveis
        're-base': '#2D3F42', // Grafite Escuro / Azul Petróleo
        're-accent': '#00D54B', // Verde Vibrante
        're-bg': '#FFFFFF', // Branco
        're-bg-alt': '#F4F6F6', // Cinza Gelo
        're-text-main': '#2D3F42', // Grafite Escuro / Azul Petróleo
        're-text-secondary': '#5A6C6F', // Cinza Esverdeado Médio
        're-text-tertiary': '#A0AEB0', // Cinza Esverdeado Claro
        're-text-invert': '#FFFFFF', // Branco para textos invertidos
        're-success': '#27AE60', // Verde Sucesso
        're-warning': '#F2C94C', // Amarelo Aviso
        're-error': '#EB5757', // Vermelho Erro
        're-info': '#828282', // Cinza Neutro Info
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'home': "url('/images/capa.webp')",
        'dourado': 'linear-gradient(to right, #00b937 0%, #00b937 80%, #00b937 100%)',
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