import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adicionar Slide - Hall Of Jerseys Admin",
};

export default function AdicionarSlideLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
