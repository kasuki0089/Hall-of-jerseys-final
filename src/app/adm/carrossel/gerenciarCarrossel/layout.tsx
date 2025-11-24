import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerenciar Carrossel - Hall Of Jerseys Admin",
};

export default function GerenciarCarrosselLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
