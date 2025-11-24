import prisma from '../../../lib/db';
// import { getServerSession } from 'next-auth';\n// import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/pedidos - Listar pedidos do usuário
export async function GET(req) {
  try {
    // TODO: Implementar autenticação real
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return new Response(JSON.stringify({ error: 'Não autorizado' }), {
    //     status: 401,
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // }

    const { searchParams } = new URL(req.url);
    const usuarioId = searchParams.get('usuarioId'); // Por enquanto via query param

    if (!usuarioId) {
      return new Response(JSON.stringify({ error: 'usuarioId é obrigatório' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const pedidos = await prisma.pedido.findMany({
      where: {
        usuarioId: parseInt(usuarioId)
      },
      include: {
        itens: {
          include: {
            produto: {
              include: {
                liga: { select: { nome: true, sigla: true } },
                time: { select: { nome: true, sigla: true } },
                cor: { select: { nome: true } },
                tamanho: { select: { nome: true } }
              }
            }
          }
        },
        formaPagamento: {
          select: {
            tipo: true,
            numeroCartao: true,
            bandeiraCartao: true
          }
        }
      },
      orderBy: {
        criadoEm: 'desc'
      }
    });

    return new Response(JSON.stringify(pedidos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return new Response(JSON.stringify({ error: 'Erro ao buscar pedidos' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/pedidos - Criar novo pedido
export async function POST(req) {
  try {
    const {
      usuarioId,
      itens, // [{ produtoId, quantidade }]
      formaPagamentoId,
      enderecoEntrega
    } = await req.json();

    if (!usuarioId || !itens || itens.length === 0) {
      return new Response(JSON.stringify({ error: 'Dados inválidos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar produtos e calcular total
    let total = 0;
    const itensValidados = [];

    for (const item of itens) {
      const produto = await prisma.produto.findUnique({
        where: { id: parseInt(item.produtoId), ativo: true }
      });

      if (!produto) {
        return new Response(JSON.stringify({ 
          error: `Produto ${item.produtoId} não encontrado` 
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (produto.estoque < item.quantidade) {
        return new Response(JSON.stringify({ 
          error: `Estoque insuficiente para ${produto.nome}`,
          estoqueDisponivel: produto.estoque
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const subtotal = produto.preco * item.quantidade;
      total += subtotal;

      itensValidados.push({
        produtoId: produto.id,
        quantidade: item.quantidade,
        preco: produto.preco
      });
    }

    // Criar pedido
    const pedido = await prisma.pedido.create({
      data: {
        usuarioId: parseInt(usuarioId),
        total: total,
        status: 'pendente',
        formaPagamentoId: formaPagamentoId ? parseInt(formaPagamentoId) : null,
        itens: {
          create: itensValidados
        }
      },
      include: {
        itens: {
          include: {
            produto: {
              include: {
                liga: { select: { nome: true, sigla: true } },
                time: { select: { nome: true, sigla: true } },
                cor: { select: { nome: true } },
                tamanho: { select: { nome: true } }
              }
            }
          }
        }
      }
    });

    // Atualizar estoque dos produtos
    for (const item of itens) {
      await prisma.produto.update({
        where: { id: parseInt(item.produtoId) },
        data: {
          estoque: {
            decrement: item.quantidade
          }
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      pedido: pedido
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return new Response(JSON.stringify({ error: 'Erro ao criar pedido' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}