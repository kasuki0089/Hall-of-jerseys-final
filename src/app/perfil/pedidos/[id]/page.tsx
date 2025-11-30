import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import OrderDetails from "./OrderDetails";

export const metadata = {
  title: "Detalhes do Pedido - Hall Of Jerseys",
  description: "Visualize os detalhes do seu pedido",
};

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  return <OrderDetails orderId={id} />;
}
