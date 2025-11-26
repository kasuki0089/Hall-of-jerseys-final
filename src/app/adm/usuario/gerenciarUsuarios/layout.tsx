import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Usuários - Hall Of Jerseys Admin",
};

export default function UsuariosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
