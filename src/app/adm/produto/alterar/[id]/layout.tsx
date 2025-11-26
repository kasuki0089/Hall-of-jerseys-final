import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alterar Produto - Hall Of Jerseys Admin",
};

export default function AlterarProdutoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
