import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET - Relatório de estoque (produtos com estoque baixo, etc)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo'); // baixo, zerado, reposicao, todos

    // Buscar produtos com suas configurações
    const produtos = await prisma.produto.findMany({
      where: { ativo: true },
      include: {
        configuracaoEstoque: true,
        liga: { select: { sigla: true } },
        time: { select: { nome: true } },
        tamanho: { select: { nome: true } }
      },
      orderBy: { estoque: 'asc' }
    });

    // Filtrar baseado no tipo
    let produtosFiltrados = produtos;

    if (tipo === 'zerado') {
      produtosFiltrados = produtos.filter(p => p.estoque === 0);
    } else if (tipo === 'baixo') {
      produtosFiltrados = produtos.filter(p => {
        const min = p.configuracaoEstoque?.quantidadeMinima || 5;
        return p.estoque > 0 && p.estoque <= min;
      });
    } else if (tipo === 'reposicao') {
      produtosFiltrados = produtos.filter(p => {
        const ponto = p.configuracaoEstoque?.pontoReposicao || 10;
        return p.estoque <= ponto;
      });
    }

    const relatorio = produtosFiltrados.map(p => ({
      id: p.id,
      nome: p.nome,
      codigo: p.codigo,
      liga: p.liga?.sigla,
      time: p.time?.nome,
      tamanho: p.tamanho?.nome,
      estoqueAtual: p.estoque,
      quantidadeMinima: p.configuracaoEstoque?.quantidadeMinima || 5,
      pontoReposicao: p.configuracaoEstoque?.pontoReposicao || 10,
      quantidadeMaxima: p.configuracaoEstoque?.quantidadeMaxima || 100,
      status: p.estoque === 0 ? 'ZERADO' : 
              p.estoque <= (p.configuracaoEstoque?.quantidadeMinima || 5) ? 'BAIXO' :
              p.estoque <= (p.configuracaoEstoque?.pontoReposicao || 10) ? 'REPOSICAO' : 'OK',
      fornecedor: p.configuracaoEstoque?.fornecedor,
      custoUltimaCompra: p.configuracaoEstoque?.custoUltimaCompra,
      dataUltimaCompra: p.configuracaoEstoque?.dataUltimaCompra
    }));

    return NextResponse.json({
      total: relatorio.length,
      produtos: relatorio
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return NextResponse.json({ error: 'Erro ao gerar relatório' }, { status: 500 });
  }
}
