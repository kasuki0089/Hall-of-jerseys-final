import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import UserProfile from "./UserProfile";

export const metadata = {
  title: "Meu Perfil - Hall of Jerseys",
  description: "Gerencie suas informações pessoais",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <UserProfile session={session} />;
}