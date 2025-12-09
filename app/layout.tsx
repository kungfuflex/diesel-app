import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/app/providers";
import AppShell from "@/app/components/AppShell";
import { AlkanesWasmInitializer } from "@/app/components/AlkanesWasmInitializer";

const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
});

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DIESEL | Bitcoin-Native Alkane Token - Stake, Swap & Earn",
  description: "The DIESEL token platform on Bitcoin. Stake DIESEL in the veDIESEL vault, swap DIESEL pairs, and earn yield. Powered by Alkanes protocol.",
  keywords: ["DIESEL", "Bitcoin DeFi", "veDIESEL", "Alkanes", "Bitcoin staking", "DIESEL token", "Bitcoin AMM", "alkanes-web-sys"],
  icons: {
    icon: "/brand/diesel-logo.png",
    apple: "/brand/diesel-logo.png",
  },
  openGraph: {
    title: "DIESEL | Bitcoin-Native Alkane Token - Stake, Swap & Earn",
    description: "The DIESEL token platform on Bitcoin. Stake DIESEL in the veDIESEL vault, swap DIESEL pairs, and earn yield. Powered by Alkanes protocol.",
    images: [
      {
        url: "/brand/diesel-logo.png",
        width: 1200,
        height: 1200,
        alt: "DIESEL - Bitcoin-Native Alkane Token",
      },
    ],
    siteName: "DIESEL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DIESEL | Bitcoin-Native Alkane Token - Stake, Swap & Earn",
    description: "The DIESEL token platform on Bitcoin. Stake DIESEL in the veDIESEL vault, swap DIESEL pairs, and earn yield.",
    images: ["/brand/diesel-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        {/* Google Drive API for client-side OAuth */}
        <script src="https://apis.google.com/js/api.js" async defer></script>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className={`${satoshi.variable} ${geistMono.variable} antialiased`}>
        <AlkanesWasmInitializer />
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
