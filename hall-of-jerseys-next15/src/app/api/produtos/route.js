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
    const limite = parseInt(searchParams.get('limite')) || 20;
    const pular = (pagina - 1) * limite;

    // Construir filtro
    const where = {};
    
    if (liga) where.liga = liga;
    if (time) where.time = time;
    if (categoria) where.categoria = categoria;
    if (tamanho) where.tamanho = tamanho;
    if (apenasAtivos) where.ativo = true;
    
    if (busca) {
      where.OR = [
        { nome: { contains: busca } },
        { descricao: { contains: busca } },
        { time: { contains: busca } }
      ];
    }

    if (precoMin || precoMax) {
      where.preco = {};
      if (precoMin) where.preco.gte = parseFloat(precoMin);
      if (precoMax) where.preco.lte = parseFloat(precoMax);
    }

    // Buscar produtos e total
    const [produtos, total] = await Promise.all([
      prisma.produto.findMany({
        where,
        skip: pular,
        take: limite,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.produto.count({ where })
    ]);

    return new Response(JSON.stringify({
      produtos,
      paginacao: {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite)
      }
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return new Response(JSON.stringify({ error: 'Erro ao buscar produtos' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/produtos - Criar produto (apenas admin)
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Acesso negado. Apenas administradores.' }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await req.json();

    // Validações
    const camposObrigatorios = ['nome', 'descricao', 'preco', 'estoque', 'liga', 'time', 'tamanho'];
    const camposFaltando = camposObrigatorios.filter(campo => !body[campo] && body[campo] !== 0);
    
    if (camposFaltando.length > 0) {
      return new Response(JSON.stringify({ 
        error: `Campos obrigatórios faltando: ${camposFaltando.join(', ')}` 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (body.preco < 0) {
      return new Response(JSON.stringify({ error: 'Preço não pode ser negativo' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (body.estoque < 0) {
      return new Response(JSON.stringify({ error: 'Estoque não pode ser negativo' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const produto = await prisma.produto.create({ data: body });
    
    return new Response(JSON.stringify(produto), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    
    if (error.code === 'P2002') {
      return new Response(JSON.stringify({ error: 'SKU já existe' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Erro ao criar produto' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
