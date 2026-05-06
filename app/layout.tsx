import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import localFont from 'next/font/local'
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = GeistSans;
const geistMono = GeistMono;


const bungee = localFont({
  src: '../public/fonts/Bungee-Regular.woff2',
  variable: '--font-bungee',
})

const bungeeHairline = localFont({
  src: '../public/fonts/BungeeHairline-Regular.woff2',
  variable: '--font-bungee-hairline',
})

const markoOne = localFont({
  src: '../public/fonts/MarkoOne-Regular.woff2',
  variable: '--font-marko-one',
})

const baskerville = localFont({
  src: '../public/fonts/LibreBaskerville-VariableFont_wght.woff2',
  variable: '--font-baskerville',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://perfumesreveil.vercel.app'),
  title: {
    default: "REVEIL | Luxury Perfumes & Signature Fragrances",
    template: "%s | REVEIL — The Art of Scent"
  },
  description: "Experience REVEIL: The ultimate destination for luxury perfumes, authentic attars, and premium air fresheners. Handcrafted signature fragrances designed for longevity and sophistication. Shop the Laboratory Archive online.",
  keywords: [
    "Reveil", "Reveil Perfumes", "luxury perfumes india", "best long lasting perfumes", 
    "buy perfumes online india", "designer fragrances", "authentic attars", "oudh perfumes", 
    "signature scents", "premium body sprays", "luxury air fresheners", "reveil diffuser", 
    "niche perfumery", "perfume gift sets", "mens luxury perfume", "womens designer fragrance",
    "best smelling perfumes", "perfume laboratory india"
  ],
  authors: [{ name: "REVEIL Studio" }],
  creator: "REVEIL",
  publisher: "Trimurty Enterprises",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://perfumesreveil.vercel.app",
    siteName: "REVEIL",
    title: "REVEIL | Luxury Perfumes & Signature Fragrances",
    description: "Handcrafted luxury fragrances from the REVEIL Laboratory. Experience the art of scent with our long-lasting signature collections.",
    images: [
      {
        url: "/og-main.jpg",
        width: 1200,
        height: 630,
        alt: "REVEIL Luxury Perfumes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "REVEIL | Luxury Perfumes & Signature Fragrances",
    description: "Shop premium handcrafted perfumes and attars from the REVEIL Studio Archive.",
    creator: "@reveil_perfumes",
    images: ["/og-main.jpg"],
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bungee.variable} ${bungeeHairline.variable} ${markoOne.variable} ${baskerville.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased selection:bg-black selection:text-white" suppressHydrationWarning>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
