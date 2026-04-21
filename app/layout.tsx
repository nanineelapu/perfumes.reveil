import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/store/Preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  title: "Reveil Perfumes | Luxury Fragrances",
  description: "Experience the essence of luxury with Reveil Perfumes.",
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
        <Preloader />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
