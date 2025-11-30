import prisma from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/usuarios/[id] - Buscar usuário específico
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        role: true,
        criadoEm: true,
        endereco: {
          select: {
            endereco: true,
            numero: true,
            complemento: true,
            bairro: true,
            cidade: true,
            cep: true,
            estadoUf: true
          }
        },
        _count: {
          select: {
            pedidos: true,
            avaliacoes: true
          }
        }
      }
    });

    if (!usuario) {
      return new Response(JSON.stringify({ 
        error: 'Usuário não encontrado' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(usuario), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE /api/usuarios/[id] - Deletar usuário (apenas admin)
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Verificar se está autenticado e é admin
    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({ 
        error: 'Não autorizado' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { id } = await params;
    const userId = parseInt(id);

    // Não permitir que admin delete a si mesmo
    if (parseInt(session.user.id) === userId) {
      return new Response(JSON.stringify({ 
        error: 'Você não pode deletar sua própria conta' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar se usuário existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            pedidos: true
          }
        }
      }
    });

    if (!usuario) {
      return new Response(JSON.stringify({ 
        error: 'Usuário não encontrado' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Avisar se usuário tem pedidos
    if (usuario._count.pedidos > 0) {
      return new Response(JSON.stringify({ 
        error: `Este usuário possui ${usuario._count.pedidos} pedido(s). Por segurança, não é possível deletar.`,
        hasPedidos: true
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Deletar usuário
    await prisma.usuario.delete({
      where: { id: userId }
    });

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Usuário deletado com sucesso' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT /api/usuarios/[id] - Atualizar usuário
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(JSON.stringify({ 
        error: 'Não autorizado' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { id } = await params;
    const userId = parseInt(id);
    const data = await req.json();

    // Verificar se é o próprio usuário ou admin
    if (parseInt(session.user.id) !== userId && session.user.role !== 'admin') {
      return new Response(JSON.stringify({ 
        error: 'Não autorizado' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Campos permitidos para atualização
    const updateData = {};
    if (data.nome) updateData.nome = data.nome;
    if (data.telefone !== undefined) updateData.telefone = data.telefone;
    
    // Apenas admin pode alterar role
    if (data.role && session.user.role === 'admin') {
      updateData.role = data.role;
    }

    const usuario = await prisma.usuario.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        role: true,
        criadoEm: true
      }
    });

    return new Response(JSON.stringify({
      success: true,
      usuario
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
