import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adicionar Produto - Hall Of Jerseys Admin",
};

export default function AdicionarProdutoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
