import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato - Hall Of Jerseys",
  description: "Entre em contato com a Hall Of Jerseys",
};

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
