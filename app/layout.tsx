import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL('https://jabriel-dev.vercel.app'),
  title: {
    default: "Jabriel Srizki Arjati | Fullstack Developer for Small Businesses",
    template: "%s | Jabriel Srizki Arjati"
  },
  description: "I build fast, secure, and high-converting websites for small businesses and startups. Get a custom landing page or fullstack app ready to launch in weeks.",
  keywords: ["Freelance Web Developer", "Small Business Website", "Next.js Developer", "Landing Page Designer", "Fullstack Developer", "Jakarta Web Developer"],
  authors: [{ name: "Jabriel Srizki Arjati", url: "https://jabriel-dev.vercel.app" }],
  creator: "Jabriel Srizki Arjati",
  openGraph: {
    title: "Jabriel Srizki Arjati | Fullstack Developer",
    description: "Professional web development services for small businesses. Fast, secure, and affordable.",
    url: 'https://jabriel-dev.vercel.app',
    siteName: 'Jabriel Dev Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png', // Needs to be added to public
        width: 1200,
        height: 630,
        alt: 'Jabriel Srizki Arjati Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Jabriel Srizki Arjati | Fullstack Developer",
    description: "High-performance web development for startups and small businesses.",
    images: ['/images/og-image.png'],
  },
  alternates: {
    canonical: 'https://jabriel-dev.vercel.app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Jabriel Srizki Arjati",
              "url": "https://jabriel-dev.vercel.app",
              "jobTitle": "Fullstack Developer",
              "knowsAbout": ["Web Development", "Next.js", "React", "TypeScript", "Database Design"],
              "image": "https://jabriel-dev.vercel.app/images/og-image.png",
              "sameAs": [
                "https://github.com/64539",
                "https://www.instagram.com/codex24434"
              ]
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
