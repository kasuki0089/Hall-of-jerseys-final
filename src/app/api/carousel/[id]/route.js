import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET - Buscar carousel específico
export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);
    
    const carousel = await prisma.carousel.findUnique({
      where: { id }
    });

    if (!carousel) {
      return NextResponse.json(
        { error: 'Carousel não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(carousel);
  } catch (error) {
    console.error('Erro ao buscar carousel:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar carousel (apenas admin)
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role?.toUpperCase() !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const id = parseInt(params.id);
    const data = await req.json();
    const { titulo, descricao, imagemUrl, linkUrl, ativo, ordem } = data;

    // Verificar se o carousel existe
    const carouselExistente = await prisma.carousel.findUnique({
      where: { id }
    });

    if (!carouselExistente) {
      return NextResponse.json(
        { error: 'Carousel não encontrado' },
        { status: 404 }
      );
    }

    const updateData = {};
    if (titulo !== undefined) updateData.titulo = titulo;
    if (descricao !== undefined) updateData.descricao = descricao;
    if (imagemUrl !== undefined) updateData.imagemUrl = imagemUrl;
    if (linkUrl !== undefined) updateData.linkUrl = linkUrl;
    if (ativo !== undefined) updateData.ativo = ativo;
    if (ordem !== undefined) updateData.ordem = ordem;

    const carousel = await prisma.carousel.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(carousel);
  } catch (error) {
    console.error('Erro ao atualizar carousel:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar carousel (apenas admin)
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role?.toUpperCase() !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const id = parseInt(params.id);

    // Verificar se o carousel existe
    const carouselExistente = await prisma.carousel.findUnique({
      where: { id }
    });

    if (!carouselExistente) {
      return NextResponse.json(
        { error: 'Carousel não encontrado' },
        { status: 404 }
      );
    }

    await prisma.carousel.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Carousel deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar carousel:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}