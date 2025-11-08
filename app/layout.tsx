import type React from "react";
import type { Metadata } from "next";
import { Quicksand, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

import { headers } from "next/headers"; // added
import ContextProvider from "@/context";

// Load Quicksand for body text
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
});

// Load Inter for headings
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Riddler",
  description: "AI Riddler - Your AI Companion for Riddles and Puzzles",
  icons: {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-aqLykDdk1VduKoA8msLOBydnuoe6K8.svg",
    shortcut:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-aqLykDdk1VduKoA8msLOBydnuoe6K8.svg",
    apple:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-aqLykDdk1VduKoA8msLOBydnuoe6K8.svg",
  },
  generator: "v0.app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en">
      <body className={`${quicksand.variable} ${inter.variable} font-sans`}>
        {/* {children} */}

        <ContextProvider cookies={cookies}>{children}</ContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
