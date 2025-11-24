import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alterar Administrador - Hall Of Jerseys Admin",
};

export default function AlterarAdministradorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
