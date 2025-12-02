import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET - Buscar configuração de estoque de um produto
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role?.toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const produtoId = searchParams.get('produtoId');

    if (!produtoId) {
      return NextResponse.json({ error: 'produtoId é obrigatório' }, { status: 400 });
    }

    const config = await prisma.configuracaoEstoque.findUnique({
      where: { produtoId: parseInt(produtoId) },
      include: {
        produto: {
          select: {
            id: true,
            nome: true,
            codigo: true,
            estoque: true
          }
        }
      }
    });

    if (!config) {
      // Retornar configuração padrão se não existir
      const produto = await prisma.produto.findUnique({
        where: { id: parseInt(produtoId) }
      });

      if (!produto) {
        return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
      }

      return NextResponse.json({
        produtoId: parseInt(produtoId),
        quantidadeMinima: 5,
        quantidadeMaxima: 100,
        pontoReposicao: 10,
        produto: {
          id: produto.id,
          nome: produto.nome,
          codigo: produto.codigo,
          estoque: produto.estoque
        }
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Erro ao buscar configuração:', error);
    return NextResponse.json({ error: 'Erro ao buscar configuração' }, { status: 500 });
  }
}

// POST - Criar/Atualizar configuração de estoque
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role?.toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      produtoId,
      quantidadeMinima,
      quantidadeMaxima,
      pontoReposicao,
      tempoMedioReposicao,
      fornecedor,
      observacoes
    } = body;

    if (!produtoId) {
      return NextResponse.json({ error: 'produtoId é obrigatório' }, { status: 400 });
    }

    // Verificar se produto existe
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(produtoId) }
    });

    if (!produto) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    const config = await prisma.configuracaoEstoque.upsert({
      where: { produtoId: parseInt(produtoId) },
      update: {
        quantidadeMinima: quantidadeMinima ? parseInt(quantidadeMinima) : undefined,
        quantidadeMaxima: quantidadeMaxima ? parseInt(quantidadeMaxima) : undefined,
        pontoReposicao: pontoReposicao ? parseInt(pontoReposicao) : undefined,
        tempoMedioReposicao: tempoMedioReposicao ? parseInt(tempoMedioReposicao) : undefined,
        fornecedor: fornecedor || undefined,
        observacoes: observacoes || undefined
      },
      create: {
        produtoId: parseInt(produtoId),
        quantidadeMinima: quantidadeMinima ? parseInt(quantidadeMinima) : 5,
        quantidadeMaxima: quantidadeMaxima ? parseInt(quantidadeMaxima) : 100,
        pontoReposicao: pontoReposicao ? parseInt(pontoReposicao) : 10,
        tempoMedioReposicao: tempoMedioReposicao ? parseInt(tempoMedioReposicao) : null,
        fornecedor: fornecedor || null,
        observacoes: observacoes || null
      },
      include: {
        produto: {
          select: {
            id: true,
            nome: true,
            codigo: true,
            estoque: true
          }
        }
      }
    });

    return NextResponse.json(config, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    return NextResponse.json({ error: 'Erro ao salvar configuração' }, { status: 500 });
  }
}
