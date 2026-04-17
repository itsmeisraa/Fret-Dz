// frontend/app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Footer } from '@/components/ui/Footer'; 

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: 'Fret-Dz | Smarter Logistics for Algeria',
  description: 'Efficient B2B shipments connecting merchants and carriers across Algeria. Real-time tracking, transparent pricing, and professional logistics services.',
  // ... other metadata
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster />
        <Footer /> {/* Add the Footer component here */}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}