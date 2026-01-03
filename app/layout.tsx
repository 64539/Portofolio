import type { Metadata } from "next";
import { Inter, Syne, Fira_Code } from "next/font/google";
import Navbar from "@/components/Navbar";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });

export const metadata: Metadata = {
  title: "Jabriel Srizki Arjati | Secure Fullstack Developer",
  description: "Ultra-futuristic Cyberpunk Portfolio of Jabriel Srizki Arjati.",
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
        {children}
      </body>
    </html>
  );
}
