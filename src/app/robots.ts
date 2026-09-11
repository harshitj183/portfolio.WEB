import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended', // Google's AI crawler (Gemini)
          'Anthropic-ai',
          'Claude-Web',
          'ClaudeBot',
          'PerplexityBot',
          'cohere-ai',
        ],
        allow: ['/', '/llms.txt'],
        disallow: ['/api/'],
      },
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'DotBot',
          'Rogerbot',
          'PetalBot',
          'MegaIndex.ru',
        ],
        disallow: ['/'],
      }
    ],
    sitemap: 'https://www.harshitj183.in/sitemap.xml',
  };
}
