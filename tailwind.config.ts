import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/antd/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
      "3xl": "1920px",
      "4xl": "2560px",
      "5xl": "3840px",
      "6xl": "4096px",
      "7xl": "5120px",
      "8xl": "6144px",
      "9xl": "7680px",
    },
    extend: {
      colors: {
        // Paleta Template Imobiliário
        "re-base": "#2E2E2E", // Preto Suave — transmite sofisticação e exclusividade
        "re-accent": "#C7B080", // Champagne — evoca luxo e prestígio
        "re-bg": "#FFFFFF", // Branco Puro — representa pureza e modernidade
        "re-bg-alt": "#F5F5F5", // Off-white — oferece uma variação sutil e elegante
        "re-text-main": "#2E2E2E", // Preto Suave — para textos principais
        "re-text-secondary": "#7D7D7D", // Cinza Médio — para textos secundários
        "re-text-tertiary": "#B2B2B2", // Cinza Claro — para textos terciários
        "re-text-invert": "#FFFFFF", // Branco Puro — para textos invertidos
        "re-success": "#28A745", // Verde Sucesso — indica sucesso de forma moderna
        "re-warning": "#FFC107", // Amarelo Aviso — alerta com sofisticação
        "re-error": "#DC3545", // Vermelho Erro — alerta importante e visualmente forte
        "re-info": "#6C757D", // Cinza Informativo — discreto e informativo
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        home: "url('/images/capa.webp')",
        dourado:
          "linear-gradient(to right, #C7B080 0%, #C7B080 80%, #C7B080 100%)", // Atualizado para usar a cor champagne
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
