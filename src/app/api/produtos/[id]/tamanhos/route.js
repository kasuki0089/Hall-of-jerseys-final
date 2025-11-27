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

    // Buscar TODOS os produtos similares (mesmo nome base, time, cor, ano)
    const nomeBase = produto.nome.replace(/\s+(PP|P|M|G|GG|XGG)$/i, ''); // Remove tamanho do nome
    const produtosSimilares = await prisma.produto.findMany({
      where: {
        timeId: produto.timeId,
        corId: produto.corId,
        year: produto.year,
        modelo: produto.modelo,
        serie: produto.serie,
        ativo: true,
        nome: {
          startsWith: nomeBase
        }
      },
      include: {
        tamanho: {
          select: { id: true, nome: true, ordem: true }
        }
      },
      orderBy: {
        tamanho: {
          ordem: 'asc'
        }
      }
    });

    // Extrair todos os tamanhos únicos
    const todosOsTamanhos = produtosSimilares
      .map(p => ({ 
        ...p.tamanho, 
        produtoId: p.id,
        disponivel: p.estoque > 0 
      }))
      .filter((tamanho, index, self) => 
        self.findIndex(t => t.id === tamanho.id) === index
      )
      .sort((a, b) => a.ordem - b.ordem);

    return Response.json({
      ...produto,
      tamanhosDisponiveis: todosOsTamanhos
    });
    
  } catch (error) {
    console.error('Erro ao buscar tamanhos do produto:', error);
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}