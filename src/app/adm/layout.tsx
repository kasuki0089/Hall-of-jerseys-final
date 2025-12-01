import type { Metadata } from "next";
import AdminProtection from "@/components/AdminProtection";

export const metadata: Metadata = {
  title: "Painel Administrativo - Hall Of Jerseys",
  description: "Painel administrativo da Hall Of Jerseys",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtection>
      {children}
    </AdminProtection>
  );
}
