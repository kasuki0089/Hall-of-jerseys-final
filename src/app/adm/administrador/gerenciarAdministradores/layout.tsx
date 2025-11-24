import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administradores - Hall Of Jerseys Admin",
};

export default function AdministradoresLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
