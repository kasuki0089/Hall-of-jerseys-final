import prisma from '../../../../../lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    
    // Buscar o produto principal
    const produto = await prisma.produto.findUnique({
      where: { 
        id: parseInt(id) 
      },
      include: {
        time: {
          include: {
            liga: {
              select: { id: true, nome: true, sigla: true }
            }
          }
        },
        cor: {
          select: { id: true, nome: true, codigo: true }
        },
        tamanho: {
          select: { id: true, nome: true, ordem: true }
        }
      }
    });

    if (!produto) {
      return Response.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    // Buscar TODOS os tamanhos da tabela tamanhos ordenados
    const todosTamanhos = await prisma.tamanho.findMany({
      orderBy: {
        ordem: 'asc'
      }
    });

    // Buscar produtos similares para verificar disponibilidade por tamanho
    const produtosSimilares = await prisma.produto.findMany({
      where: {
        timeId: produto.timeId,
        corId: produto.corId,
        year: produto.year,
        modelo: produto.modelo,
        serie: produto.serie,
        ativo: true
      },
      include: {
        tamanho: {
          select: { id: true, nome: true, ordem: true }
        }
      }
    });

    // Mapear todos os tamanhos com disponibilidade
    const tamanhosDisponiveis = todosTamanhos.map(tamanho => {
      const produtoComTamanho = produtosSimilares.find(p => p.tamanhoId === tamanho.id);
      return {
        id: tamanho.id,
        nome: tamanho.nome,
        ordem: tamanho.ordem,
        produtoId: produtoComTamanho?.id || produto.id,
        disponivel: produtoComTamanho ? produtoComTamanho.estoque > 0 : false,
        estoque: produtoComTamanho?.estoque || 0
      };
    });

    return Response.json({
      ...produto,
      tamanhosDisponiveis: tamanhosDisponiveis
    });
    
  } catch (error) {
    console.error('Erro ao buscar tamanhos do produto:', error);
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}