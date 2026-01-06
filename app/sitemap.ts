import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jabriel-dev.com'; // Ganti dengan domain asli
  const lastModified = new Date();

  // Daftar route statis
  const routes = [
    '',
    '/about',
    '/projects',
    '/contact',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
