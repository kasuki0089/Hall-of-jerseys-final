import prisma from '../../../lib/db';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/produtos - Listar produtos com filtros avançados
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extrair parâmetros de filtro
    const liga = searchParams.get('liga');
    const time = searchParams.get('time');
    const cor = searchParams.get('cor');
    const tamanho = searchParams.get('tamanho');
    const precoMin = searchParams.get('precoMin');
    const precoMax = searchParams.get('precoMax');
    const busca = searchParams.get('busca');
    const ordenacao = searchParams.get('ordenacao') || 'nome';
    
    // Paginação
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    // Construir where clause
    const where = {};

    // Filtro por busca (nome ou modelo)
    if (busca && busca.trim()) {
      where.OR = [
        { nome: { contains: busca.trim() } },
        { modelo: { contains: busca.trim() } },
        { 
          time: {
            nome: { contains: busca.trim() }
          }
        }
      ];
    }

    // Filtro por liga
    if (liga) {
      where.time = {
        ...where.time,
        ligaId: parseInt(liga)
      };
    }

    // Filtro por time
    if (time) {
      where.timeId = parseInt(time);
    }

    // Filtro por cor
    if (cor) {
      where.corId = parseInt(cor);
    }

    // Filtro por tamanho
    if (tamanho) {
      where.tamanhoId = parseInt(tamanho);
    }

    // Filtro por faixa de preço
    if (precoMin || precoMax) {
      where.preco = {};
      if (precoMin) where.preco.gte = parseFloat(precoMin);
      if (precoMax) where.preco.lte = parseFloat(precoMax);
    }

    // Construir orderBy
    let orderBy = {};
    switch (ordenacao) {
      case 'preco-asc':
        orderBy = { preco: 'asc' };
        break;
      case 'preco-desc':
        orderBy = { preco: 'desc' };
        break;
      case 'mais-recentes':
        orderBy = { criadoEm: 'desc' };
        break;
      case 'nome':
      default:
        orderBy = { nome: 'asc' };
        break;
    }

    // Buscar produtos
    const [produtos, total] = await Promise.all([
      prisma.produto.findMany({
        where,
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
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.produto.count({ where })
    ]);

    // Calcular metadados de paginação
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return Response.json({
      produtos,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage
      },
      filtros: {
        liga,
        time,
        cor,
        tamanho,
        precoMin,
        precoMax,
        busca,
        ordenacao
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
      modelo,
      preco,
      codigo,
      year,
      serie,
      estoque,
      ligaId,
      timeId,
      corId,
      tamanhoId,
      imagemUrl
    } = body;

    // Validações básicas
    if (!nome || !preco || !codigo || !ligaId || !timeId || !corId || !tamanhoId || !modelo) {
      return Response.json(
        { error: 'Campos obrigatórios: nome, modelo, preco, codigo, ligaId, timeId, corId, tamanhoId' },
        { status: 400 }
      );
    }

    // Verificar se código já existe
    const produtoExistente = await prisma.produto.findUnique({
      where: { codigo: codigo.toString() }
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
        descricao: descricao || null,
        modelo,
        preco: parseFloat(preco),
        codigo: codigo.toString(),
        year: year || new Date().getFullYear(),
        serie: serie || null,
        estoque: estoque || 0,
        imagemUrl: imagemUrl || null,
        ligaId: parseInt(ligaId),
        timeId: parseInt(timeId),
        corId: parseInt(corId),
        tamanhoId: parseInt(tamanhoId)
      },
      include: {
        liga: true,
        time: true,
        cor: true,
        tamanho: true
      }
    });

    return Response.json(produto, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar produto:', error);
    
    // Erro de constraint (código duplicado, etc)
    if (error.code === 'P2002') {
      return Response.json({ error: 'Código já existe' }, { status: 400 });
    }
    
    return Response.json({ error: 'Erro interno do servidor: ' + error.message }, { status: 500 });
  }
}
