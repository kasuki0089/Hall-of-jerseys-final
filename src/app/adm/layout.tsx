import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Administrativo - Hall Of Jerseys",
  description: "Acesso administrativo da Hall Of Jerseys",
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
