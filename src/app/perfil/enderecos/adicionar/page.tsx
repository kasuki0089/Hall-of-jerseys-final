import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AddAddressForm from "./AddAddressForm";

export const metadata = {
  title: "Adicionar Endereço - Hall of Jerseys",
  description: "Adicione um novo endereço de entrega",
};

export default async function AddAddressPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <AddAddressForm session={session} />;
}
