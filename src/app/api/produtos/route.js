import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/produtos - Listar produtos com filtros e paginação
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parâmetros de filtro
    const liga = searchParams.get('liga');
    const time = searchParams.get('time');
    const categoria = searchParams.get('categoria');
    const tamanho = searchParams.get('tamanho');
    const busca = searchParams.get('busca');
    const precoMin = searchParams.get('precoMin');
    const precoMax = searchParams.get('precoMax');
    const apenasAtivos = searchParams.get('ativo') !== 'false'; // padrão: true
    
    // Parâmetros de paginação
    const pagina = parseInt(searchParams.get('pagina')) || 1;
    const limite = parseInt(searchParams.get('limite')) || 12;
    const offset = (pagina - 1) * limite;

    // Construir condições de filtro
    const where = {};
    
    if (apenasAtivos) {
      where.ativo = true;
    }
    
    if (liga) {
      where.liga = { contains: liga, mode: 'insensitive' };
    }
    
    if (time) {
      where.time = { contains: time, mode: 'insensitive' };
    }
    
    if (categoria) {
      where.categoria = categoria;
    }
    
    if (tamanho) {
      where.tamanho = tamanho;
    }
    
    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: 'insensitive' } },
        { descricao: { contains: busca, mode: 'insensitive' } },
        { liga: { contains: busca, mode: 'insensitive' } },
        { time: { contains: busca, mode: 'insensitive' } }
      ];
    }
    
    if (precoMin || precoMax) {
      where.preco = {};
      if (precoMin) where.preco.gte = parseFloat(precoMin);
      if (precoMax) where.preco.lte = parseFloat(precoMax);
    }

    // Executar consultas
    const [produtos, totalItens] = await Promise.all([
      prisma.produto.findMany({
        where,
        skip: offset,
        take: limite,
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
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const body = await req.json();
    const {
      nome,
      descricao,
      preco,
      estoque,
      liga,
      time,
      tamanho,
      categoria,
      imagemUrl,
      sku
    } = body;

    // Validações básicas
    if (!nome || !descricao || !preco || !estoque || !liga || !time || !tamanho) {
      return Response.json(
        { error: 'Campos obrigatórios: nome, descricao, preco, estoque, liga, time, tamanho' },
        { status: 400 }
      );
    }

    // Verificar se SKU já existe (se fornecido)
    if (sku) {
      const produtoExistente = await prisma.produto.findUnique({
        where: { sku }
      });
      
      if (produtoExistente) {
        return Response.json({ error: 'SKU já existe' }, { status: 400 });
      }
    }

    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
        liga,
        time,
        tamanho,
        categoria: categoria || 'Jersey',
        imagemUrl,
        sku,
        ativo: true
      }
    });

    return Response.json(produto, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar produto:', error);
    
    // Erro de constraint (SKU duplicado, etc)
    if (error.code === 'P2002') {
      return Response.json({ error: 'SKU já existe' }, { status: 400 });
    }
    
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
