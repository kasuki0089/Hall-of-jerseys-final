import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET - Listar todos os administradores
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const administradores = await prisma.usuario.findMany({
      where: {
        role: 'admin'
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        criadoEm: true,
        atualizadoEm: true
      },
      orderBy: {
        nome: 'asc'
      }
    });

    return NextResponse.json(administradores);
  } catch (error) {
    console.error('Erro ao buscar administradores:', error);
    return NextResponse.json({ error: 'Erro ao buscar administradores' }, { status: 500 });
  }
}

// POST - Criar novo administrador
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { nome, email, senha, cpf } = body;

    // Validações
    if (!nome || !email || !senha) {
      return NextResponse.json({ error: 'Nome, email e senha são obrigatórios' }, { status: 400 });
    }

    // Verificar se email já existe
    const emailExiste = await prisma.usuario.findUnique({
      where: { email }
    });

    if (emailExiste) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar administrador
    const novoAdmin = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        telefone: cpf || null,
        role: 'admin'
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        createdAt: true
      }
    });

    return NextResponse.json(novoAdmin, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar administrador:', error);
    return NextResponse.json({ error: 'Erro ao criar administrador' }, { status: 500 });
  }
}
