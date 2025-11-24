import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produtos - Hall Of Jerseys Admin",
};

export default function ProdutosRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
