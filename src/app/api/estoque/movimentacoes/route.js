import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET - Listar movimentações de estoque
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.tipo !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const produtoId = searchParams.get('produtoId');
    const tipo = searchParams.get('tipo');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where = {};
    
    if (produtoId) {
      where.produtoId = parseInt(produtoId);
    }
    
    if (tipo) {
      where.tipo = tipo;
    }

    const movimentacoes = await prisma.movimentacaoEstoque.findMany({
      where,
      include: {
        produto: {
          select: {
            id: true,
            nome: true,
            codigo: true
          }
        }
      },
      orderBy: {
        criadoEm: 'desc'
      },
      take: limit
    });

    return NextResponse.json(movimentacoes);
  } catch (error) {
    console.error('Erro ao buscar movimentações:', error);
    return NextResponse.json({ error: 'Erro ao buscar movimentações' }, { status: 500 });
  }
}

// POST - Criar movimentação de estoque
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.tipo !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      produtoId,
      tipo, // ENTRADA, SAIDA, AJUSTE, DEVOLUCAO
      quantidade,
      motivo,
      custo,
      fornecedor,
      notaFiscal,
      observacoes
    } = body;

    // Validações
    if (!produtoId || !tipo || !quantidade) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: produtoId, tipo, quantidade' },
        { status: 400 }
      );
    }

    // Buscar produto atual
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(produtoId) },
      include: {
        configuracaoEstoque: true
      }
    });

    if (!produto) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    const quantidadeAntes = produto.estoque;
    let quantidadeDepois;
    let quantidadeMovimentacao = parseInt(quantidade);

    // Calcular nova quantidade baseado no tipo
    switch (tipo) {
      case 'ENTRADA':
      case 'DEVOLUCAO':
        quantidadeDepois = quantidadeAntes + quantidadeMovimentacao;
        break;
      case 'SAIDA':
        quantidadeMovimentacao = -quantidadeMovimentacao; // Negativo para saída
        quantidadeDepois = quantidadeAntes + quantidadeMovimentacao;
        if (quantidadeDepois < 0) {
          return NextResponse.json(
            { error: 'Quantidade em estoque insuficiente' },
            { status: 400 }
          );
        }
        break;
      case 'AJUSTE':
        quantidadeDepois = quantidadeMovimentacao;
        quantidadeMovimentacao = quantidadeDepois - quantidadeAntes;
        break;
      default:
        return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
    }

    const valorTotal = custo ? custo * Math.abs(quantidadeMovimentacao) : null;

    // Criar movimentação e atualizar produto em transação
    const [movimentacao, produtoAtualizado] = await prisma.$transaction([
      prisma.movimentacaoEstoque.create({
        data: {
          produtoId: parseInt(produtoId),
          tipo,
          quantidade: quantidadeMovimentacao,
          quantidadeAntes,
          quantidadeDepois,
          motivo,
          custo: custo ? parseFloat(custo) : null,
          valorTotal,
          fornecedor,
          notaFiscal,
          responsavel: session.user.nome || session.user.email,
          observacoes
        },
        include: {
          produto: true
        }
      }),
      prisma.produto.update({
        where: { id: parseInt(produtoId) },
        data: { estoque: quantidadeDepois }
      })
    ]);

    // Se for ENTRADA, atualizar configuração de estoque
    if (tipo === 'ENTRADA' && custo) {
      await prisma.configuracaoEstoque.upsert({
        where: { produtoId: parseInt(produtoId) },
        update: {
          custoUltimaCompra: parseFloat(custo),
          dataUltimaCompra: new Date(),
          fornecedor: fornecedor || undefined
        },
        create: {
          produtoId: parseInt(produtoId),
          custoUltimaCompra: parseFloat(custo),
          dataUltimaCompra: new Date(),
          fornecedor: fornecedor || null
        }
      });
    }

    return NextResponse.json(movimentacao, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar movimentação:', error);
    return NextResponse.json({ error: 'Erro ao criar movimentação' }, { status: 500 });
  }
}
