import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avaliações - Hall Of Jerseys Admin",
};

export default function AvaliacoesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
