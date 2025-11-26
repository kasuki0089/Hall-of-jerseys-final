import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../../lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Acesso negado" }), { 
        status: 403 
      });
    }

    const orders = await prisma.pedido.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), { 
      status: 500 
    });
  }
}