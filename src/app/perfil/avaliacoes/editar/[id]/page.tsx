import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import EditReviewForm from "./EditReviewForm";

export const metadata = {
  title: "Editar Avaliação - Hall Of Jerseys",
  description: "Edite sua avaliação",
};

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  return <EditReviewForm reviewId={id} />;
}
