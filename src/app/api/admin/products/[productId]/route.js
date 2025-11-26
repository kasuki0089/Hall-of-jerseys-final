import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "../../../../../lib/db";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Acesso negado" }), { 
        status: 403 
      });
    }

    const { productId } = await params;
    const product = await prisma.produto.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return new Response(JSON.stringify({ error: "Produto não encontrado" }), { 
        status: 404 
      });
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), { 
      status: 500 
    });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Acesso negado" }), { 
        status: 403 
      });
    }

    const { productId } = await params;
    const body = await req.json();
    const { nome, descricao, preco, estoque, liga, tamanho } = body;
    const productIdInt = parseInt(productId);

    // Verificar se produto existe
    const existingProduct = await prisma.produto.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      return new Response(JSON.stringify({ error: "Produto não encontrado" }), { 
        status: 404 
      });
    }

    // Preparar dados de atualização
    const updateData = {};
    if (nome) updateData.nome = nome;
    if (descricao !== undefined) updateData.descricao = descricao;
    if (preco !== undefined) updateData.preco = parseFloat(preco);
    if (estoque !== undefined) updateData.estoque = parseInt(estoque);
    if (liga !== undefined) updateData.liga = liga;
    if (tamanho !== undefined) updateData.tamanho = tamanho;

    const updatedProduct = await prisma.produto.update({
      where: { id: productIdInt },
      data: updateData
    });

    return new Response(JSON.stringify(updatedProduct), { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), { 
      status: 500 
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Acesso negado" }), { 
        status: 403 
      });
    }

    const { productId } = await params;
    const productIdInt = parseInt(productId);

    // Verificar se produto existe
    const existingProduct = await prisma.produto.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      return new Response(JSON.stringify({ error: "Produto não encontrado" }), { 
        status: 404 
      });
    }

    await prisma.produto.delete({
      where: { id: productIdInt }
    });

    return new Response(JSON.stringify({ message: "Produto excluído com sucesso" }), { 
      status: 200 
    });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), { 
      status: 500 
    });
  }
}