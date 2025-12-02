import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../../lib/db";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role?.toUpperCase() !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Acesso negado" }), { 
        status: 403 
      });
    }

    const users = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), { 
      status: 500 
    });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Acesso negado" }), { 
        status: 403 
      });
    }

    const body = await req.json();
    const { nome, email, senha, role } = body;

    if (!nome || !email || !senha) {
      return new Response(JSON.stringify({ error: "Dados obrigatórios não fornecidos" }), { 
        status: 400 
      });
    }

    // Verificar se email já existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email já cadastrado" }), { 
        status: 409 
      });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        role: role || "cliente"
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), { 
      status: 500 
    });
  }
}