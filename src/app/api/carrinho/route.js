import prisma from '../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/carrinho - Obter itens do carrinho do usuário
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const itensCarrinho = await prisma.carrinhoItem.findMany({
      where: {
        usuarioId: parseInt(session.user.id)
      },
      include: {
        produto: {
          include: {
            liga: { select: { nome: true, sigla: true } },
            time: { select: { nome: true, sigla: true } },
            cor: { select: { nome: true } },
            estoques: {
              include: {
                tamanho: { select: { nome: true } }
              }
            }
          }
        },
        tamanho: { select: { nome: true } }
      }
    });

    const total = itensCarrinho.reduce((acc, item) => 
      acc + (parseFloat(item.produto.preco) * item.quantidade), 0
    );

    return new Response(JSON.stringify({
      success: true,
      itens: itensCarrinho,
      total: total,
      totalItens: itensCarrinho.reduce((acc, item) => acc + item.quantidade, 0)
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/carrinho - Adicionar item ao carrinho
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('🔍 Session user:', session.user);
    
    const { produtoId, quantidade = 1, tamanhoId } = await req.json();
    console.log('📦 Dados recebidos:', { produtoId, quantidade, tamanhoId });
    let usuarioId = parseInt(session.user.id);

    // Verificar se o usuário existe, se não existir, criar
    let usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId }
    });

    console.log('👤 Usuário encontrado por ID:', usuario);

    if (!usuario) {
      // Se não existe pelo ID, tentar pelo email
      usuario = await prisma.usuario.findUnique({
        where: { email: session.user.email }
      });
      
      console.log('👤 Usuário encontrado por email:', usuario);

      if (usuario) {
        usuarioId = usuario.id;
      } else {
        // Criar usuário se não existe
        console.log('🆕 Criando novo usuário...');
        usuario = await prisma.usuario.create({
          data: {
            nome: session.user.name || 'Usuário',
            email: session.user.email,
            senha: 'temp123', // senha temporária
            telefone: '',
            role: 'user'
          }
        });
        usuarioId = usuario.id;
        console.log('✅ Usuário criado:', usuario);
      }
    }

    // Verificar se o produto existe
    const produto = await prisma.produto.findUnique({
      where: { 
        id: parseInt(produtoId),
        ativo: true 
      },
      include: {
        liga: { select: { nome: true, sigla: true } },
        time: { select: { nome: true, sigla: true } },
        cor: { select: { nome: true } },
        estoques: {
          include: {
            tamanho: true
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

    // Verificar estoque do tamanho específico
    const estoqueDoTamanho = produto.estoques.find(e => e.tamanhoId === parseInt(tamanhoId));
    
    if (!estoqueDoTamanho || estoqueDoTamanho.quantidade < quantidade) {
      return new Response(JSON.stringify({ 
        error: 'Estoque insuficiente',
        estoqueDisponivel: estoqueDoTamanho?.quantidade || 0
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar se item já existe no carrinho
    const itemExistente = await prisma.carrinhoItem.findFirst({
      where: {
        usuarioId: usuarioId,
        produtoId: parseInt(produtoId),
        tamanhoId: tamanhoId ? parseInt(tamanhoId) : null
      }
    });

    let carrinhoItem;

    if (itemExistente) {
      // Atualizar quantidade
      const novaQuantidade = itemExistente.quantidade + quantidade;
      
      if (estoqueDoTamanho.quantidade < novaQuantidade) {
        return new Response(JSON.stringify({ 
          error: 'Estoque insuficiente para a quantidade solicitada',
          estoqueDisponivel: estoqueDoTamanho.quantidade,
          quantidadeNoCarrinho: itemExistente.quantidade
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      carrinhoItem = await prisma.carrinhoItem.update({
        where: { id: itemExistente.id },
        data: { quantidade: novaQuantidade },
        include: {
          produto: {
            include: {
              liga: { select: { nome: true, sigla: true } },
              time: { select: { nome: true, sigla: true } },
              cor: { select: { nome: true } },
              estoques: {
                include: {
                  tamanho: true
                }
              }
            }
          },
          tamanho: true
        }
      });
    } else {
      // Criar novo item no carrinho
      carrinhoItem = await prisma.carrinhoItem.create({
        data: {
          usuarioId: usuarioId,
          produtoId: parseInt(produtoId),
          quantidade: quantidade,
          tamanhoId: tamanhoId ? parseInt(tamanhoId) : null
        },
        include: {
          produto: {
            include: {
              liga: { select: { nome: true, sigla: true } },
              time: { select: { nome: true, sigla: true } },
              cor: { select: { nome: true } },
              estoques: {
                include: {
                  tamanho: true
                }
              }
            }
          },
          tamanho: true
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Produto adicionado ao carrinho',
      item: carrinhoItem
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT /api/carrinho - Atualizar quantidade de um item
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { itemId, quantidade } = await req.json();
    const usuarioId = parseInt(session.user.id);

    if (quantidade <= 0) {
      return new Response(JSON.stringify({ error: 'Quantidade deve ser maior que zero' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar se o item pertence ao usuário
    const itemCarrinho = await prisma.carrinhoItem.findFirst({
      where: {
        id: parseInt(itemId),
        usuarioId: usuarioId
      },
      include: {
        produto: {
          include: {
            estoques: {
              include: {
                tamanho: true
              }
            }
          }
        },
        tamanho: true
      }
    });

    if (!itemCarrinho) {
      return new Response(JSON.stringify({ error: 'Item não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar estoque do tamanho específico
    const estoqueDoTamanho = itemCarrinho.produto.estoques.find(
      e => e.tamanhoId === itemCarrinho.tamanhoId
    );
    
    if (!estoqueDoTamanho || estoqueDoTamanho.quantidade < quantidade) {
      return new Response(JSON.stringify({ 
        error: 'Estoque insuficiente',
        estoqueDisponivel: estoqueDoTamanho?.quantidade || 0
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Atualizar quantidade
    const itemAtualizado = await prisma.carrinhoItem.update({
      where: { id: parseInt(itemId) },
      data: { quantidade: quantidade },
      include: {
        produto: {
          include: {
            liga: { select: { nome: true, sigla: true } },
            time: { select: { nome: true, sigla: true } },
            cor: { select: { nome: true } },
            estoques: {
              include: {
                tamanho: true
              }
            }
          }
        },
        tamanho: true
      }
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Quantidade atualizada',
      item: itemAtualizado
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao atualizar carrinho:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE /api/carrinho - Remover item do carrinho
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');
    const limparTudo = searchParams.get('limpar') === 'true';
    const usuarioId = parseInt(session.user.id);

    if (limparTudo) {
      // Limpar todo o carrinho do usuário
      await prisma.carrinhoItem.deleteMany({
        where: {
          usuarioId: usuarioId
        }
      });

      return new Response(JSON.stringify({
        success: true,
        message: 'Carrinho limpo com sucesso'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!itemId) {
      return new Response(JSON.stringify({ error: 'itemId é obrigatório' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar se o item pertence ao usuário
    const itemCarrinho = await prisma.carrinhoItem.findFirst({
      where: {
        id: parseInt(itemId),
        usuarioId: usuarioId
      }
    });

    if (!itemCarrinho) {
      return new Response(JSON.stringify({ error: 'Item não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Remover item
    await prisma.carrinhoItem.delete({
      where: { id: parseInt(itemId) }
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Item removido do carrinho'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}