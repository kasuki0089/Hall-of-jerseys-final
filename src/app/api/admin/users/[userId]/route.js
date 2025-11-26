import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "../../../../../lib/db";

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Acesso negado" }), { 
        status: 403 
      });
    }

    const { userId } = await params;
    const body = await request.json();
    const { role } = body;

    if (!["admin", "cliente"].includes(role)) {
      return new Response(JSON.stringify({ error: "Role inválido" }), { 
        status: 400 
      });
    }

    const updatedUser = await prisma.usuario.update({
      where: { id: parseInt(userId) },
      data: { role },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
      },
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), { 
      status: 500 
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Acesso negado" }), { 
        status: 403 
      });
    }

    const { userId } = await params;

    // Não permitir que o admin delete a si mesmo
    if (parseInt(userId) === session.user.id) {
      return new Response(JSON.stringify({ error: "Não é possível deletar sua própria conta" }), { 
        status: 400 
      });
    }

    await prisma.usuario.delete({
      where: { id: parseInt(userId) },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), { 
      status: 500 
    });
  }
}