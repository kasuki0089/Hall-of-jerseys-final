import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mensagens - Hall Of Jerseys Admin",
};

export default function MensagensLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
