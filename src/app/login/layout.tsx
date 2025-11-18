import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Hall Of Jerseys",
  description: "Faça login na Hall Of Jerseys",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
