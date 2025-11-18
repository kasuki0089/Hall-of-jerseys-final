import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import NextAuthProvider from '../providers/NextAuthProvider';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  weight: ["400", "700"] 
});

export const metadata = {
  title: "Hall OF Jerseys",
  description: "Hall of Jerseys - Sua loja de jerseys esportivos americanos",
};

export default function RootLayout({ children }) {
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
