import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sarvamanghalarakshai.com';
  
  const paths = [
    '',
    '/about',
    '/astro-card',
    '/faq',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/refund-policy',
    '/shipping-policy',
  ];

  return paths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1.0 : path === '/astro-card' ? 0.8 : 0.5,
  }));
}
