import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://jabriel-dev.vercel.app'; // Updated to Vercel domain

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/admin', '/_next'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
