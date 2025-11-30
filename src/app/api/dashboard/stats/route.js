import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo') || 'mes';

    // Calcula as datas baseadas no período
    const now = new Date();
    let startDate = new Date();

    switch (periodo) {
      case 'dia':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'semana':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'mes':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'ano':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Produtos por Liga
    const produtosPorLiga = await prisma.produto.groupBy({
      by: ['ligaId'],
      _count: {
        id: true
      }
    });

    const ligas = await prisma.liga.findMany();
    const produtosComNomeLiga = produtosPorLiga.map(item => {
      const liga = ligas.find(l => l.id === item.ligaId);
      return {
        liga: liga?.sigla || 'Sem Liga',
        quantidade: item._count.id
      };
    });

    // Vendas ao longo do tempo
    const vendas = await prisma.pedido.findMany({
      where: {
        criadoEm: {
          gte: startDate
        }
      },
      orderBy: {
        criadoEm: 'asc'
      }
    });

    let vendasAgrupadas = [];
    if (periodo === 'dia') {
      // Agrupa por hora
      const vendasPorHora = Array.from({ length: 24 }, (_, i) => ({
        periodo: `${i}h`,
        vendas: 0
      }));
      
      vendas.forEach(venda => {
        const hora = new Date(venda.criadoEm).getHours();
        vendasPorHora[hora].vendas++;
      });
      
      vendasAgrupadas = vendasPorHora.filter((_, i) => i % 4 === 0); // Mostra a cada 4 horas
    } else if (periodo === 'semana') {
      // Agrupa por dia da semana
      const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
      const vendasPorDia = diasSemana.map(dia => ({
        periodo: dia,
        vendas: 0
      }));
      
      vendas.forEach(venda => {
        const dia = new Date(venda.criadoEm).getDay();
        vendasPorDia[dia].vendas++;
      });
      
      vendasAgrupadas = vendasPorDia;
    } else if (periodo === 'mes') {
      // Agrupa por mês (últimos 6 meses)
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const vendasPorMes = Array.from({ length: 6 }, (_, i) => {
        const data = new Date();
        data.setMonth(data.getMonth() - (5 - i));
        return {
          periodo: meses[data.getMonth()],
          vendas: 0
        };
      });
      
      vendas.forEach(venda => {
        const mesVenda = new Date(venda.criadoEm).getMonth();
        const mesAtual = new Date().getMonth();
        let index = mesVenda - (mesAtual - 5);
        if (index < 0) index += 12;
        if (index >= 0 && index < 6) {
          vendasPorMes[index].vendas++;
        }
      });
      
      vendasAgrupadas = vendasPorMes;
    } else {
      // Agrupa por ano (últimos 6 anos)
      const anoAtual = new Date().getFullYear();
      const vendasPorAno = Array.from({ length: 6 }, (_, i) => ({
        periodo: (anoAtual - (5 - i)).toString(),
        vendas: 0
      }));
      
      vendas.forEach(venda => {
        const anoVenda = new Date(venda.criadoEm).getFullYear();
        const index = anoVenda - (anoAtual - 5);
        if (index >= 0 && index < 6) {
          vendasPorAno[index].vendas++;
        }
      });
      
      vendasAgrupadas = vendasPorAno;
    }

    // Top 5 Produtos Mais Vendidos
    const itensPedido = await prisma.itemPedido.groupBy({
      by: ['produtoId'],
      _sum: {
        quantidade: true
      },
      orderBy: {
        _sum: {
          quantidade: 'desc'
        }
      },
      take: 5,
      where: {
        pedido: {
          criadoEm: {
            gte: startDate
          }
        }
      }
    });

    const produtos = await prisma.produto.findMany({
      where: {
        id: {
          in: itensPedido.map(item => item.produtoId)
        }
      },
      include: {
        time: true
      }
    });

    const topProdutos = itensPedido.map(item => {
      const produto = produtos.find(p => p.id === item.produtoId);
      return {
        produto: produto ? `${produto.time?.nome || 'Sem Time'} ${produto.nome}`.substring(0, 20) : 'Produto',
        vendas: item._sum.quantidade || 0
      };
    });

    // Liga Mais Procurada (baseado em visualizações de produtos)
    const produtosVisualizados = await prisma.produto.findMany({
      include: {
        liga: true
      }
    });

    const ligasMap = new Map();
    produtosVisualizados.forEach(produto => {
      if (produto.liga) {
        const sigla = produto.liga.sigla;
        // Simulando visualizações baseadas no número de produtos
        // Em produção, você criaria uma tabela de visualizações
        ligasMap.set(sigla, (ligasMap.get(sigla) || 0) + Math.floor(Math.random() * 100) + 50);
      }
    });

    const ligasMaisProcuradas = Array.from(ligasMap.entries())
      .map(([liga, acessos]) => ({ liga, acessos }))
      .sort((a, b) => b.acessos - a.acessos)
      .slice(0, 5);

    return NextResponse.json({
      produtosPorLiga: produtosComNomeLiga,
      vendas: vendasAgrupadas,
      topProdutos: topProdutos.length > 0 ? topProdutos : [
        { produto: 'Nenhuma venda', vendas: 0 }
      ],
      ligasMaisProcuradas: ligasMaisProcuradas.length > 0 ? ligasMaisProcuradas : [
        { liga: 'Sem dados', acessos: 0 }
      ]
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
}
