/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'crmdataclix.s3.us-east-1.amazonaws.com',
      'homeclix.s3.amazonaws.com',
      'upcdn.io', // Domínio adicionado conforme solicitado
      'maps.googleapis.com', // Domínio necessário para o Google Maps Static API
    ],
  },
};

module.exports = nextConfig;