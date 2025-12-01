import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

// GET - Listar todos os carousels (público) ou para admin
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const admin = searchParams.get('admin') === 'true';
    
    let whereClause = {};
    
    // Se não for admin, só mostra os ativos
    if (!admin) {
      whereClause = { ativo: true };
    }
    
    const carousels = await prisma.carousel.findMany({
      where: whereClause,
      orderBy: [
        { ordem: 'asc' },
        { criadoEm: 'desc' }
      ]
    });

    return NextResponse.json(carousels);
  } catch (error) {
    console.error('Erro ao buscar carousels:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo carousel (apenas admin)
export async function POST(req) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const data = await req.json();
    const { titulo, descricao, imagemUrl, linkUrl, ativo = true, ordem = 0 } = data;

    if (!titulo || !imagemUrl) {
      return NextResponse.json(
        { error: 'Título e URL da imagem são obrigatórios' },
        { status: 400 }
      );
    }

    const carousel = await prisma.carousel.create({
      data: {
        titulo,
        descricao,
        imagemUrl,
        linkUrl,
        ativo,
        ordem
      }
    });

    return NextResponse.json(carousel, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar carousel:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}