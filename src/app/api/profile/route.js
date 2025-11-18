import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "../../../lib/db";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), { 
        status: 401 
      });
    }

    const body = await request.json();
    const { nome, email } = body;

    if (!nome || !email) {
      return new Response(JSON.stringify({ error: "Dados obrigatórios não fornecidos" }), { 
        status: 400 
      });
    }

    // Verificar se o email já está em uso por outro usuário
    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return new Response(JSON.stringify({ error: "Email já está em uso" }), { 
        status: 400 
      });
    }

    const updatedUser = await prisma.usuario.update({
      where: { id: session.user.id },
      data: { nome, email },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
      },
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), { 
      status: 500 
    });
  }
}