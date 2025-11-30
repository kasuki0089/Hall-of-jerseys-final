import prisma from '../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/pedidos - Listar pedidos do usuário ou todos (admin)
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';
    const status = searchParams.get('status');
    const userId = parseInt(session.user.id);

    let whereClause = {};

    if (isAdmin) {
      // Verificar se é admin (você pode implementar verificação de role aqui)
      if (status) {
        whereClause.status = status;
      }
    } else {
      // Usuário comum - apenas seus pedidos
      whereClause.usuarioId = userId;
      if (status) {
        whereClause.status = status;
      }
    }

    const pedidos = await prisma.pedido.findMany({
      where: whereClause,
      include: {
        usuario: {
          select: { nome: true, email: true }
        },
        itensPedido: {
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
      },
      orderBy: {
        criadoEm: 'desc'
      }
    });

    return new Response(JSON.stringify({
      success: true,
      pedidos: pedidos
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/pedidos - Criar novo pedido
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { itens, endereco, formaPagamento, total } = await req.json();
    const usuarioId = parseInt(session.user.id);

    if (!itens || itens.length === 0) {
      return new Response(JSON.stringify({ error: 'Nenhum item no pedido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!endereco || !endereco.cep || !endereco.rua || !endereco.cidade) {
      return new Response(JSON.stringify({ error: 'Endereço incompleto' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar produtos e estoque
    let totalCalculado = 0;
    const itensValidados = [];

    for (const item of itens) {
      const produto = await prisma.produto.findUnique({
        where: { 
          id: parseInt(item.produtoId),
          ativo: true 
        }
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
          error: `Estoque insuficiente para ${produto.nome}. Disponível: ${produto.estoque}`,
          produtoId: produto.id,
          estoqueDisponivel: produto.estoque
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const precoItem = parseFloat(item.preco || produto.preco);
      totalCalculado += precoItem * item.quantidade;

      itensValidados.push({
        produtoId: produto.id,
        quantidade: item.quantidade,
        preco: precoItem,
        tamanhoId: item.tamanhoId || null
      });
    }

    // Verificar total
    if (Math.abs(totalCalculado - parseFloat(total)) > 0.01) {
      return new Response(JSON.stringify({ 
        error: 'Total do pedido não confere',
        totalCalculado,
        totalInformado: total
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Criar pedido em transação
    const resultado = await prisma.$transaction(async (tx) => {
      // Criar pedido
      const pedido = await tx.pedido.create({
        data: {
          usuarioId: usuarioId,
          status: 'PENDENTE',
          total: totalCalculado,
          criadoEm: new Date()
        }
      });

      // Criar itens do pedido
      const itensPedido = await Promise.all(
        itensValidados.map(item =>
          tx.itemPedido.create({
            data: {
              pedidoId: pedido.id,
              produtoId: item.produtoId,
              quantidade: item.quantidade,
              preco: item.preco,
              tamanhoId: item.tamanhoId
            }
          })
        )
      );

      // Atualizar estoque
      for (const item of itensValidados) {
        await tx.produto.update({
          where: { id: item.produtoId },
          data: {
            estoque: {
              decrement: item.quantidade
            }
          }
        });
      }

      // Limpar carrinho do usuário
      await tx.carrinhoItem.deleteMany({
        where: { usuarioId: usuarioId }
      });

      return { pedido, itensPedido };
    });

    // Buscar pedido completo para retornar
    const pedidoCompleto = await prisma.pedido.findUnique({
      where: { id: resultado.pedido.id },
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

    return new Response(JSON.stringify({
      success: true,
      message: 'Pedido criado com sucesso',
      pedido: pedidoCompleto
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT /api/pedidos - Atualizar status do pedido (admin)
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { pedidoId, status, observacoes } = await req.json();

    if (!pedidoId || !status) {
      return new Response(JSON.stringify({ error: 'Dados obrigatórios faltando' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const statusValidos = ['PENDENTE', 'CONFIRMADO', 'PREPARANDO', 'ENVIADO', 'ENTREGUE', 'CANCELADO'];
    if (!statusValidos.includes(status)) {
      return new Response(JSON.stringify({ error: 'Status inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar se o pedido existe
    const pedidoExistente = await prisma.pedido.findUnique({
      where: { id: parseInt(pedidoId) }
    });

    if (!pedidoExistente) {
      return new Response(JSON.stringify({ error: 'Pedido não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Atualizar pedido
    const pedidoAtualizado = await prisma.pedido.update({
      where: { id: parseInt(pedidoId) },
      data: {
        status: status,
        observacoes: observacoes || null,
        atualizadoEm: new Date()
      },
      include: {
        usuario: {
          select: { nome: true, email: true }
        },
        itensPedido: {
          include: {
            produto: true
          }
        }
      }
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Status do pedido atualizado',
      pedido: pedidoAtualizado
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}