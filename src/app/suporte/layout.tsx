import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suporte - Hall Of Jerseys",
  description: "FAQ e suporte da Hall Of Jerseys",
};

export default function SuporteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
