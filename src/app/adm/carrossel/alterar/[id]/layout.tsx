import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alterar Slide - Hall Of Jerseys Admin",
};

export default function AlterarSlideLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
