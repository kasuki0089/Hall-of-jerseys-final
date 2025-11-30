import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';

// GET /api/contato - Listar todas as mensagens de contato (apenas admin)
export async function GET(req) {
  try {
    const contatos = await prisma.contato.findMany({
      orderBy: {
        criadoEm: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      contatos
    });

  } catch (error) {
    console.error('❌ Erro ao buscar contatos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens de contato' },
      { status: 500 }
    );
  }
}

// POST /api/contato - Processar formulário de contato
export async function POST(req) {
  try {
    const { nome, email, telefone, motivo, problema } = await req.json();

    // Validações básicas
    if (!nome || !email || !motivo || !problema) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      );
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Salvar no banco de dados
    const contato = await prisma.contato.create({
      data: {
        nome,
        email,
        telefone: telefone || null,
        motivo,
        mensagem: problema,
        status: 'novo'
      }
    });

    console.log('📧 Nova mensagem de contato salva:', contato.id);

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso! Nossa equipe entrará em contato em até 24 horas.',
      id: contato.id
    });

  } catch (error) {
    console.error('❌ Erro ao processar contato:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}