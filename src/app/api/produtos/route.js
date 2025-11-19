import prisma from '../../../lib/db';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/produtos - Listar produtos com filtros e paginação
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parâmetros de filtro
    const categoria = searchParams.get('categoria');
    const ligaId = searchParams.get('ligaId');
    const timeId = searchParams.get('timeId');
    const tamanho = searchParams.get('tamanho');
    const busca = searchParams.get('busca');
    const sale = searchParams.get('sale');
    const serie = searchParams.get('serie');
    
    // Parâmetros de paginação
    const pagina = parseInt(searchParams.get('pagina')) || 1;
    const limite = parseInt(searchParams.get('limite')) || 12;
    const offset = (pagina - 1) * limite;

    // Construir condições de filtro
    const where = {};
    
    if (categoria && categoria !== 'todas') {
      where.categoria = categoria.toUpperCase();
    }
    
    if (ligaId && ligaId !== 'todas') {
      where.ligaId = parseInt(ligaId);
    }
    
    if (timeId && timeId !== 'todos') {
      where.timeId = parseInt(timeId);
    }
    
    if (tamanho) {
      where.tamanho = tamanho;
    }
    
    if (sale === 'true') {
      where.sale = true;
    }
    
    if (serie) {
      where.serie = { contains: serie, mode: 'insensitive' };
    }
    
    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: 'insensitive' } },
        { descricao: { contains: busca, mode: 'insensitive' } },
        { serie: { contains: busca, mode: 'insensitive' } },
        { liga: { nome: { contains: busca, mode: 'insensitive' } } },
        { time: { nome: { contains: busca, mode: 'insensitive' } } }
      ];
    }

    // Executar consultas
    const [produtos, totalItens] = await Promise.all([
      prisma.produto.findMany({
        where,
        skip: offset,
        take: limite,
        include: {
          liga: true,
          time: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.produto.count({ where })
    ]);

    const totalPaginas = Math.ceil(totalItens / limite);

    return Response.json({
      produtos,
      paginacao: {
        paginaAtual: pagina,
        totalPaginas,
        totalItens,
        itemsPorPagina: limite
      }
    });

  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// POST /api/produtos - Criar novo produto (apenas admins)
export async function POST(req) {
  try {
    // const session = await getServerSession(authOptions);
    
    // if (!session || session.user.role !== 'admin') {
    //   return Response.json({ error: 'Acesso negado' }, { status: 403 });
    // }

    const body = await req.json();
    const {
      nome,
      descricao,
      preco,
      codigo,
      tamanho,
      sale,
      serie,
      categoria,
      ligaId,
      timeId
    } = body;

    // Validações básicas
    if (!nome || !preco || !codigo || !ligaId || !timeId) {
      return Response.json(
        { error: 'Campos obrigatórios: nome, preco, codigo, ligaId, timeId' },
        { status: 400 }
      );
    }

    // Verificar se código já existe
    const produtoExistente = await prisma.produto.findUnique({
      where: { codigo: parseInt(codigo) }
    });
    
    if (produtoExistente) {
      return Response.json({ error: 'Código já existe' }, { status: 400 });
    }

    // Verificar se liga existe
    const liga = await prisma.liga.findUnique({
      where: { id: parseInt(ligaId) }
    });
    
    if (!liga) {
      return Response.json({ error: 'Liga não encontrada' }, { status: 400 });
    }

    // Verificar se time existe e pertence à liga
    const time = await prisma.time.findFirst({
      where: { 
        id: parseInt(timeId),
        ligaId: parseInt(ligaId)
      }
    });
    
    if (!time) {
      return Response.json({ error: 'Time não encontrado ou não pertence à liga especificada' }, { status: 400 });
    }

    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco: parseInt(preco),
        codigo: parseInt(codigo),
        tamanho,
        sale: sale || false,
        serie,
        categoria: categoria || 'JERSEY',
        ligaId: parseInt(ligaId),
        timeId: parseInt(timeId)
      },
      include: {
        liga: true,
        time: true
      }
    });

    return Response.json(produto, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar produto:', error);
    
    // Erro de constraint (código duplicado, etc)
    if (error.code === 'P2002') {
      return Response.json({ error: 'Código já existe' }, { status: 400 });
    }
    
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
