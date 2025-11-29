import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import UserAddresses from "./UserAddresses";

export const metadata = {
  title: "Meus Endereços - Hall of Jerseys",
  description: "Gerencie seus endereços de entrega",
};

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <UserAddresses session={session} />;
}
