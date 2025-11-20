import prisma from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/produtos/[id] - Buscar produto específico
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(id) }
    });

    if (!produto) {
      return new Response(JSON.stringify({ error: 'Produto não encontrado' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(produto), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return new Response(JSON.stringify({ error: 'Erro ao buscar produto' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT /api/produtos/[id] - Atualizar produto (apenas admin)
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Acesso negado. Apenas administradores.' }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { id } = await params;
    const body = await req.json();

    // Validação básica
    if (body.preco !== undefined && body.preco < 0) {
      return new Response(JSON.stringify({ error: 'Preço não pode ser negativo' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (body.estoque !== undefined && body.estoque < 0) {
      return new Response(JSON.stringify({ error: 'Estoque não pode ser negativo' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const produto = await prisma.produto.update({
      where: { id: parseInt(id) },
      data: body
    });

    return new Response(JSON.stringify(produto), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    
    if (error.code === 'P2025') {
      return new Response(JSON.stringify({ error: 'Produto não encontrado' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Erro ao atualizar produto' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE /api/produtos/[id] - Deletar produto (apenas admin)
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Acesso negado. Apenas administradores.' }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { id } = await params;

    // Verificar se o produto existe e se tem pedidos associados
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(id) },
      include: { itens: true }
    });

    if (!produto) {
      return new Response(JSON.stringify({ error: 'Produto não encontrado' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (produto.itens.length > 0) {
      return new Response(JSON.stringify({ 
        error: 'Não é possível deletar produto com pedidos associados. Desative-o ao invés disso.' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await prisma.produto.delete({
      where: { id: parseInt(id) }
    });

    return new Response(JSON.stringify({ message: 'Produto deletado com sucesso' }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return new Response(JSON.stringify({ error: 'Erro ao deletar produto' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
