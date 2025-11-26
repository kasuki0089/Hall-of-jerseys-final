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

    const products = await prisma.produto.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
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
    const { nome, descricao, preco, estoque, liga, tamanho } = body;

    if (!nome || !preco || estoque === undefined) {
      return new Response(JSON.stringify({ error: "Dados obrigatórios não fornecidos" }), { 
        status: 400 
      });
    }

    const product = await prisma.produto.create({
      data: {
        nome,
        descricao: descricao || "",
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
        liga: liga || "",
        tamanho: tamanho || ""
      }
    });

    return new Response(JSON.stringify(product), { status: 201 });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), { 
      status: 500 
    });
  }
}