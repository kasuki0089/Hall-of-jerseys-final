import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import UserOrders from "./UserOrders";

export const metadata = {
  title: "Meus Pedidos - Hall Of Jerseys",
  description: "Visualize e acompanhe seus pedidos",
};

export default async function PedidosPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <UserOrders />;
}
