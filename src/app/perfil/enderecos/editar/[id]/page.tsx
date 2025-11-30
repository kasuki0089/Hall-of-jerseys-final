import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import EditAddressForm from "./EditAddressForm";

export const metadata = {
  title: "Editar Endereço - Hall of Jerseys",
  description: "Edite seu endereço de entrega",
};

export default async function EditAddressPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <EditAddressForm params={params} session={session} />;
}
