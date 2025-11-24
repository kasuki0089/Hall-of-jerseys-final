import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pedidos - Hall Of Jerseys Admin",
};

export default function PedidosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
