import prisma from '../../../lib/db';

// GET /api/carrinho - Obter itens do carrinho (simulado via localStorage no frontend)
// Esta é uma estrutura base, o carrinho real será gerenciado no frontend

// POST /api/carrinho - Adicionar item ao carrinho
export async function POST(req) {
  try {
    const { produtoId, quantidade = 1 } = await req.json();

    // Verificar se o produto existe e tem estoque
    const produto = await prisma.produto.findUnique({
      where: { 
        id: parseInt(produtoId),
        ativo: true 
      },
      include: {
        liga: { select: { nome: true, sigla: true } },
        time: { select: { nome: true, sigla: true } },
        cor: { select: { nome: true } },
        tamanho: { select: { nome: true } }
      }
    });

    if (!produto) {
      return new Response(JSON.stringify({ error: 'Produto não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (produto.estoque < quantidade) {
      return new Response(JSON.stringify({ 
        error: 'Estoque insuficiente',
        estoqueDisponivel: produto.estoque 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Retorna os dados do produto para adicionar ao carrinho no frontend
    return new Response(JSON.stringify({
      success: true,
      produto: {
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        imagemUrl: produto.imagemUrl,
        liga: produto.liga,
        time: produto.time,
        cor: produto.cor,
        tamanho: produto.tamanho,
        quantidade: quantidade,
        subtotal: produto.preco * quantidade
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    return new Response(JSON.stringify({ error: 'Erro ao adicionar ao carrinho' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}