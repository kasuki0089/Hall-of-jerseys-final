import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendWelcomeEmail } from '../../../lib/emailService';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 400 });
    }

    // Buscar usuário pelo token
    const usuario = await prisma.usuario.findFirst({
      where: {
        tokenVerificacao: token,
        emailVerificado: false
      }
    });

    if (!usuario) {
      return NextResponse.json({ 
        error: 'Token inválido ou email já verificado' 
      }, { status: 400 });
    }

    // Verificar se o token não expirou (24 horas)
    const tokenAge = Date.now() - new Date(usuario.criadoEm).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 horas em ms

    if (tokenAge > twentyFourHours) {
      return NextResponse.json({ 
        error: 'Token expirado. Solicite um novo email de verificação.' 
      }, { status: 400 });
    }

    // Verificar email
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        emailVerificado: true,
        tokenVerificacao: null // Remove o token após verificação
      }
    });

    // Enviar email de boas-vindas
    await sendWelcomeEmail(usuario.email, usuario.nome);

    return NextResponse.json({ 
      success: true, 
      message: 'Email verificado com sucesso!' 
    });

  } catch (error) {
    console.error('Erro na verificação de email:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// POST para reenviar email de verificação
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email não fornecido' }, { status: 400 });
    }

    // Buscar usuário
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    if (usuario.emailVerificado) {
      return NextResponse.json({ error: 'Email já verificado' }, { status: 400 });
    }

    // Gerar novo token
    const crypto = require('crypto');
    const novoToken = crypto.randomBytes(32).toString('hex');

    // Atualizar token no banco
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { tokenVerificacao: novoToken }
    });

    // Reenviar email (simulado por enquanto)
    console.log(`📧 Reenviando email de verificação para: ${email}`);
    console.log(`🔗 Token: ${novoToken}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Novo email de verificação enviado!' 
    });

  } catch (error) {
    console.error('Erro ao reenviar verificação:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}