// next-sitemap.config.js

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // URL base REAL do seu site em produção. ESSENCIAL!
  siteUrl: 'https://www.zanferimoveis.com.br',

  // Gera automaticamente o sitemap.xml no build
  generateIndexSitemap: false, // Não precisamos de um sitemap índice por enquanto

  // Gera automaticamente o robots.txt no build
  generateRobotsTxt: true,

  // Configurações para o robots.txt
  robotsTxtOptions: {
    policies: [
      {
        // Permite que todos os robôs acessem todo o site
        userAgent: '*',
        allow: '/',
      },
      // --- Exemplos de regras que você PODE adicionar se necessário ---
      // { userAgent: '*', disallow: '/admin/' }, // Bloquear pasta admin
      // { userAgent: 'Googlebot', disallow: '/temp/' }, // Bloquear pasta temp apenas para Googlebot
      // { userAgent: '*', disallow: '/api/' }, // Bloquear rotas de API (se não forem para consumo público)
    ],
    // Adiciona a localização do(s) sitemap(s) ao robots.txt
    // Inclui o sitemap principal (gerado no build) e o sitemap do servidor (para imóveis)
    additionalSitemaps: [
      'https://www.zanferimoveis.com.br/sitemap.xml', // Sitemap principal (gerado no build)
      'https://www.zanferimoveis.com.br/server-sitemap.xml', // Sitemap dos imóveis (gerado no servidor)
    ],
  },

  // Lista de rotas a serem EXCLUÍDAS do sitemap gerado no build
  exclude: [
    // Excluir o padrão da página de detalhes do imóvel, pois será tratado
    // pelo sitemap gerado no servidor (server-sitemap.xml).
    '/imovel/*',

    // Excluir a rota que gera o sitemap do servidor para não entrar no sitemap principal.
    '/server-sitemap.xml',

    // --- Exemplos de outras exclusões comuns ---
    // '/404', // Página 404 personalizada (geralmente não precisa estar no sitemap)
    // '/api/*', // Rotas de API
    // '/admin*', // Padrão para rotas de administração
    // '/privacidade', // Se for uma página sem valor estratégico de SEO
  ],

  // === Configurações Opcionais (Ajuste conforme necessário) ===

  // Define a frequência padrão de mudança para as páginas
  // Valores possíveis: 'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'
  // changefreq: 'weekly',

  // Define a prioridade padrão para as páginas (0.0 a 1.0)
  // priority: 0.7,

  // Desabilita a adição automática da tag <lastmod> baseada no Git (padrão é true)
  // autoLastmod: false,

  // Função para transformar URLs antes de adicionar ao sitemap.
  // Permite definir prioridade e frequência específicas por rota.
  // Descomente e ajuste se quiser um controle mais fino:
  /*
  transform: async (config, path) => {
    // Define padrões
    let priority = config.priority; // Usa o padrão definido acima (ou 0.7 se não definido)
    let changefreq = config.changefreq; // Usa o padrão definido acima (ou 'weekly' se não definido)

    // Ajusta para páginas específicas
    if (path === '/') { // Página inicial
      priority = 1.0;
      changefreq = 'daily';
    }
    if (path === '/imoveis') { // Página de listagem geral
      priority = 0.9;
      changefreq = 'daily';
    }
    if (path === '/contato') { // Página de contato
      priority = 0.5;
      changefreq = 'monthly';
    }
    // Adicione outras regras para páginas estáticas importantes aqui...

    // Retorna o objeto final para o sitemap
    return {
      loc: path, // URL (obrigatório)
      changefreq: changefreq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      // alternateRefs: config.alternateRefs?.[path] ?? [], // Para sites multi-idioma
    }
  },
  */
};