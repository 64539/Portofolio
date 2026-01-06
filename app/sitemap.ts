import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jabriel-dev.vercel.app'; // Updated to Vercel domain
  const lastModified = new Date();

  // Daftar route statis
  // Aplikasi saat ini adalah single-page (SPA) dengan scroll navigation di page.tsx
  // Route /about, /projects, /contact sebenarnya adalah section ID di homepage (#about, #projects, #contact)
  // Namun untuk SEO, kita tetap daftarkan root URL. Jika nanti dibuat halaman terpisah, baru tambahkan di sini.
  const routes = [
    '',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
