import type { Metadata } from "next";

type Props = {
  params: Promise<{ liga: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { liga } = await params;
  const ligaUpper = liga.toUpperCase();
  
  return {
    title: `${ligaUpper} - Hall Of Jerseys`,
    description: `Confira os produtos da liga ${ligaUpper}`,
  };
}

export default function LigaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
