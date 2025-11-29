import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
// @ts-ignore
import AccessibilitySettings from "./AccessibilitySettings";

export const metadata = {
  title: "Acessibilidade - Hall Of Jerseys",
  description: "Configurações de acessibilidade",
};

export default async function AcessibilidadePage() {
  // @ts-ignore
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <AccessibilitySettings />;
}
