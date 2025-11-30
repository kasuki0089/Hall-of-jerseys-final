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

    // Buscar estoques para este produto
    const estoquesProduto = await prisma.estoquePorTamanho.findMany({
      where: {
        produtoId: parseInt(id)
      },
      include: {
        tamanho: true
      }
    });

    // Mapear todos os tamanhos com disponibilidade
    const tamanhosDisponiveis = todosTamanhos.map(tamanho => {
      const estoqueItem = estoquesProduto.find(e => e.tamanhoId === tamanho.id);
      return {
        id: tamanho.id,
        nome: tamanho.nome,
        ordem: tamanho.ordem,
        produtoId: parseInt(id),
        disponivel: estoqueItem ? estoqueItem.quantidade > 0 : false,
        estoque: estoqueItem?.quantidade || 0
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