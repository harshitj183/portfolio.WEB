import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'ClaudeBot', 'OmgiliBot', 'FacebookBot', 'Bytespider'],
        disallow: ['/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      }
    ],
    sitemap: 'https://www.harshitj183.in/sitemap.xml',
  };
}
