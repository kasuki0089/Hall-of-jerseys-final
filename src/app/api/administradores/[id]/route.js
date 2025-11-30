import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET - Buscar administrador por ID
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const administrador = await prisma.usuario.findFirst({
      where: {
        id: parseInt(id),
        role: 'admin'
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        criadoEm: true,
        atualizadoEm: true
      }
    });

    if (!administrador) {
      return NextResponse.json({ error: 'Administrador não encontrado' }, { status: 404 });
    }

    return NextResponse.json(administrador);
  } catch (error) {
    console.error('Erro ao buscar administrador:', error);
    return NextResponse.json({ error: 'Erro ao buscar administrador' }, { status: 500 });
  }
}

// PUT - Atualizar administrador
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { nome, email, senha, cpf } = body;

    // Verificar se administrador existe
    const adminExiste = await prisma.usuario.findFirst({
      where: {
        id: parseInt(id),
        role: 'admin'
      }
    });

    if (!adminExiste) {
      return NextResponse.json({ error: 'Administrador não encontrado' }, { status: 404 });
    }

    // Verificar se email já está em uso por outro usuário
    if (email && email !== adminExiste.email) {
      const emailEmUso = await prisma.usuario.findUnique({
        where: { email }
      });

      if (emailEmUso) {
        return NextResponse.json({ error: 'Email já está em uso' }, { status: 400 });
      }
    }

    // Preparar dados para atualização
    const dadosAtualizacao = {
      nome: nome || adminExiste.nome,
      email: email || adminExiste.email,
      telefone: cpf !== undefined ? cpf : adminExiste.telefone
    };

    // Se senha foi fornecida, fazer hash
    if (senha) {
      dadosAtualizacao.senha = await bcrypt.hash(senha, 10);
    }

    // Atualizar administrador
    const adminAtualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: dadosAtualizacao,
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        atualizadoEm: true
      }
    });

    return NextResponse.json(adminAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar administrador:', error);
    return NextResponse.json({ error: 'Erro ao atualizar administrador' }, { status: 500 });
  }
}

// DELETE - Deletar administrador
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;

    // Verificar se administrador existe
    const adminExiste = await prisma.usuario.findFirst({
      where: {
        id: parseInt(id),
        role: 'admin'
      }
    });

    if (!adminExiste) {
      return NextResponse.json({ error: 'Administrador não encontrado' }, { status: 404 });
    }

    // Não permitir deletar a si mesmo
    if (parseInt(id) === parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Não é possível deletar seu próprio usuário' }, { status: 400 });
    }

    // Deletar administrador
    await prisma.usuario.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Administrador deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar administrador:', error);
    return NextResponse.json({ error: 'Erro ao deletar administrador' }, { status: 500 });
  }
}
