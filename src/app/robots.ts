import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ['GPTBot', 'gemini-2.5-flash', 'gemini-bot', 'gemini-crawler', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'ClaudeBot', 'OmgiliBot', 'FacebookBot', 'Bytespider', 'BaiduSpider', 'Googlebot'],
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
