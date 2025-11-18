import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro - Hall Of Jerseys",
  description: "Crie sua conta na Hall Of Jerseys",
};

export default function CadastroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
