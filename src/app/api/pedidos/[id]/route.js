import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '../../../../lib/db';

// GET /api/pedidos/[id] - Buscar pedido específico
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const pedidoId = parseInt(id);
    
    console.log(`🔍 Buscando pedido ${pedidoId} para usuário:`, session.user.email);

    try {
      const pedido = await prisma.pedido.findFirst({
        where: {
          id: pedidoId,
          usuarioId: parseInt(session.user.id)
        },
        include: {
          itens: {
            include: {
              produto: {
                include: {
                  liga: { select: { nome: true, sigla: true } },
                  time: { select: { nome: true, sigla: true } },
                  cor: { select: { nome: true, codigo: true } }
                }
              },
              tamanho: { select: { nome: true } }
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

      if (pedido) {
        console.log('✅ Pedido encontrado no banco:', pedido.id);
        return NextResponse.json({
          success: true,
          pedido: pedido
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Pedido não encontrado'
        }, { status: 404 });
      }

    } catch (dbError) {
      console.error('❌ Erro de conexão com banco:', dbError.message);
      
      return NextResponse.json({
        success: false,
        error: 'Erro de conexão com o banco de dados'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Erro ao buscar pedido:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PATCH /api/pedidos/[id] - Atualizar status do pedido
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    const statusValidos = ['pendente', 'processando', 'enviado', 'entregue', 'cancelado'];
    if (!statusValidos.includes(status)) {
      return NextResponse.json({ 
        error: 'Status inválido',
        statusValidos: statusValidos
      }, { status: 400 });
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

    return NextResponse.json({
      success: true,
      pedido: pedido
    });

  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar pedido' }, 
      { status: 500 }
    );
  }
}