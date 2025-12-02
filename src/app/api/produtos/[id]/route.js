import prisma from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/produtos/[id] - Buscar produto específico
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const produto = await prisma.produto.findUnique({
      where: { 
        id: parseInt(id),
        ativo: true 
      },
      include: {
        liga: {
          select: {
            id: true,
            nome: true,
            sigla: true
          }
        },
        time: {
          include: {
            liga: {
              select: { id: true, nome: true, sigla: true }
            }
          }
        },
        cor: {
          select: {
            id: true,
            nome: true,
            codigo: true
          }
        },
        estoques: {
          include: {
            tamanho: {
              select: {
                id: true,
                nome: true,
                ordem: true
              }
            }
          }
        }
      }
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
    
    if (!session || session.user.role?.toUpperCase() !== 'ADMIN') {
      return new Response(JSON.stringify({ error: 'Acesso negado. Apenas administradores podem editar produtos.' }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { id } = await params;
    const body = await req.json();

    // Extrair estoques e campos de relacionamento do body
    const { estoques, ligaId, timeId, corId, ...dadosProduto } = body;

    // Validação básica
    if (dadosProduto.preco !== undefined && dadosProduto.preco < 0) {
      return new Response(JSON.stringify({ error: 'Preço não pode ser negativo' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Preparar dados do produto com relacionamentos usando connect
    const updateData = {
      ...dadosProduto,
      liga: ligaId ? { connect: { id: parseInt(ligaId) } } : undefined,
      cor: corId ? { connect: { id: parseInt(corId) } } : undefined,
      time: timeId ? { connect: { id: parseInt(timeId) } } : { disconnect: true }
    };

    // Remover campos undefined
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    // Usar transação se tiver estoques para atualizar
    if (estoques && Array.isArray(estoques)) {
      const resultado = await prisma.$transaction(async (tx) => {
        // Atualizar produto
        const produto = await tx.produto.update({
          where: { id: parseInt(id) },
          data: updateData
        });

        // Remover estoques antigos
        await tx.estoquePorTamanho.deleteMany({
          where: { produtoId: parseInt(id) }
        });

        // Criar novos estoques
        if (estoques.length > 0) {
          await tx.estoquePorTamanho.createMany({
            data: estoques.map(e => ({
              produtoId: parseInt(id),
              tamanhoId: parseInt(e.tamanhoId),
              quantidade: parseInt(e.quantidade)
            }))
          });
        }

        return produto;
      });

      // Buscar produto completo com estoques
      const produtoCompleto = await prisma.produto.findUnique({
        where: { id: parseInt(id) },
        include: {
          liga: true,
          time: {
            include: {
              liga: true
            }
          },
          cor: true,
          estoques: {
            include: {
              tamanho: true
            }
          }
        }
      });

      return new Response(JSON.stringify(produtoCompleto), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Se não tiver estoques, apenas atualizar o produto
    const produto = await prisma.produto.update({
      where: { id: parseInt(id) },
      data: updateData
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
    
    // Verificar se está logado e é admin
    if (!session) {
      return new Response(JSON.stringify({ 
        error: 'Você precisa estar logado para excluir produtos.'
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (session.user.role !== 'admin') {
      return new Response(JSON.stringify({ 
        error: 'Apenas administradores podem excluir produtos.'
      }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { id } = await params;

    // Verificar se o produto existe e se tem pedidos associados
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(id) },
      include: { 
        itensPedido: true
      }
    });

    if (!produto) {
      return new Response(JSON.stringify({ error: 'Produto não encontrado' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Se tem pedidos associados, apenas desativa ao invés de deletar
    if (produto.itensPedido.length > 0) {
      const produtoDesativado = await prisma.produto.update({
        where: { id: parseInt(id) },
        data: { ativo: false }
      });

      return new Response(JSON.stringify({ 
        message: 'Produto desativado com sucesso (havia pedidos associados)',
        produto: produtoDesativado
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Se não tem pedidos, pode deletar completamente
    await prisma.produto.delete({
      where: { id: parseInt(id) }
    });

    return new Response(JSON.stringify({ message: 'Produto excluído com sucesso' }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
