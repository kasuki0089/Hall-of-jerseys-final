import prisma from '../../../../lib/db';

// GET /api/pedidos/[id] - Buscar pedido específico
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    
    const pedido = await prisma.pedido.findUnique({
      where: { id: parseInt(id) },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            endereco: {
              select: {
                endereco: true,
                numero: true,
                complemento: true,
                bairro: true,
                cidade: true,
                cep: true,
                estado: {
                  select: {
                    uf: true,
                    nome: true
                  }
                }
              }
            }
          }
        },
        itens: {
          include: {
            produto: {
              include: {
                liga: { select: { nome: true, sigla: true } },
                time: { select: { nome: true, sigla: true } },
                cor: { select: { nome: true, codigo: true } },
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
      }
    });

    if (!pedido) {
      return new Response(JSON.stringify({ error: 'Pedido não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(pedido), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return new Response(JSON.stringify({ error: 'Erro ao buscar pedido' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PATCH /api/pedidos/[id] - Atualizar status do pedido
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    const statusValidos = ['pendente', 'processando', 'enviado', 'entregue', 'cancelado'];
    if (!statusValidos.includes(status)) {
      return new Response(JSON.stringify({ 
        error: 'Status inválido',
        statusValidos: statusValidos
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const pedido = await prisma.pedido.update({
      where: { id: parseInt(id) },
      data: { status: status },
      include: {
        itens: {
          include: {
            produto: true
          }
        }
      }
    });

    return new Response(JSON.stringify({
      success: true,
      pedido: pedido
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return new Response(JSON.stringify({ error: 'Erro ao atualizar pedido' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}