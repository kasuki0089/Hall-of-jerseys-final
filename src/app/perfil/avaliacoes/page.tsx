import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import UserReviews from "./UserReviews";

export const metadata = {
  title: "Minhas Avaliações - Hall Of Jerseys",
  description: "Visualize e gerencie suas avaliações de produtos",
};

export default async function AvaliacoesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <UserReviews />;
}
