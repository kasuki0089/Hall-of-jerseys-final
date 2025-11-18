import NextAuthProvider from "../providers/NextAuthProvider";
import "./globals.css";

export const metadata = {
  title: "Hall of Jerseys",
  description: "Loja de jerseys esportivos americanos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}