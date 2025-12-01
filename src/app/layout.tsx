import type { Metadata } from "next";
import "./globals.css";
import { NextAuthProvider } from "@/providers/NextAuthProvider";

import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Hall OF Jerseys",
  description: "Hall of Jerseys - Camisetas esportivas oficiais",
};

type RootLayoutProps = {
    children: React.ReactNode;
}

export default function RootLayout({children}: Readonly<RootLayoutProps>) {
  return (
    <html lang="pt-BR">
      <body className={spaceGrotesk.className}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
