import type { Metadata } from "next";
import "./globals.css";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import { ToastProvider } from "@/components/Toast";
import Script from "next/script";

import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Hall OF Jerseys",
  description: "Hall of Jerseys",
};


type RootLayoutProps = {
    children: React.ReactNode;
}

export default function RootLayout({children}: Readonly<RootLayoutProps>) {
  return (
    <html lang="pt-BR">
      <body className={spaceGrotesk.className}>
        <ToastProvider>
          <NextAuthProvider>
            {children}
          </NextAuthProvider>
        </ToastProvider>
        <Script
          src="https://www.google.com/recaptcha/api.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
