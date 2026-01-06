import type { Metadata } from "next";
import { Inter, Syne, Fira_Code } from "next/font/google";
import Navbar from "@/components/Navbar";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });

export const metadata: Metadata = {
  metadataBase: new URL('https://jabriel-dev.com'), // Ganti dengan domain asli jika ada
  title: {
    default: "Jabriel Srizki Arjati | Secure Fullstack Developer",
    template: "%s | Jabriel Srizki Arjati"
  },
  description: "Portofolio Cyberpunk Futuristik Jabriel Srizki Arjati. Fullstack Developer spesialis keamanan, React, Next.js, dan Node.js.",
  keywords: ["Fullstack Developer", "Cyber Security", "Next.js", "React", "Node.js", "Cyberpunk Portfolio", "Web Developer Indonesia"],
  authors: [{ name: "Jabriel Srizki Arjati", url: "https://jabriel-dev.com" }],
  creator: "Jabriel Srizki Arjati",
  publisher: "Jabriel Srizki Arjati",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "GOOGLE_VERIFICATION_CODE_PLACEHOLDER", // Placeholder untuk kode verifikasi
  },
  openGraph: {
    title: "Jabriel Srizki Arjati | Secure Fullstack Developer",
    description: "Portofolio Cyberpunk Futuristik Jabriel Srizki Arjati. Spesialis keamanan dan pengembangan web modern.",
    url: 'https://jabriel-dev.com',
    siteName: 'Jabriel Dev Portfolio',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg', // Pastikan membuat gambar ini nanti
        width: 1200,
        height: 630,
        alt: 'Jabriel Dev Cyberpunk Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Jabriel Srizki Arjati | Secure Fullstack Developer",
    description: "Portofolio Cyberpunk Futuristik Jabriel Srizki Arjati. Spesialis keamanan dan pengembangan web modern.",
    creator: '@jabrieldev', // Ganti dengan username twitter asli jika ada
    images: ['/og-image.jpg'],
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
    <html lang="en">
      <body
        className={`${inter.variable} ${syne.variable} ${firaCode.variable} antialiased bg-black text-white overflow-x-hidden`}
      >
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black opacity-80 pointer-events-none" />
        <div className="fixed inset-0 z-[-1] bg-grid opacity-20 pointer-events-none" />
        <div className="scanlines fixed inset-0 z-[50] pointer-events-none opacity-30" />
        
        <Navbar />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Jabriel Srizki Arjati",
              "url": "https://jabriel-dev.com",
              "image": "https://jabriel-dev.com/profile.jpg", // Pastikan ada gambar profil
              "jobTitle": "Fullstack Developer",
              "worksFor": {
                "@type": "Organization",
                "name": "Freelance"
              },
              "sameAs": [
                "https://github.com/jabrieldev", // Ganti dengan link asli
                "https://linkedin.com/in/jabrieldev",
                "https://twitter.com/jabrieldev"
              ],
              "knowsAbout": ["Fullstack Development", "Cyber Security", "React", "Next.js", "Node.js", "TypeScript"]
            }),
          }}
        />
        
        {children}
      </body>
    </html>
  );
}
