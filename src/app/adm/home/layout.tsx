import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Hall Of Jerseys Admin",
  description: "Painel administrativo da Hall Of Jerseys",
};

export default function AdminHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
