import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adicionar Administrador - Hall Of Jerseys Admin",
};

export default function AdicionarAdministradorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
