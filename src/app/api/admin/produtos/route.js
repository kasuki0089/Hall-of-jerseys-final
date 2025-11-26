import prisma from '../../../../lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

// POST /api/admin/produtos - Criar novo produto (apenas admin)
export async function POST(request) {
  try {
    // Para desenvolvimento, vamos pular a verificação de autenticação por enquanto
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "admin") {
    //   return Response.json({ error: "Acesso negado" }, { status: 403 });
    // }

    const body = await request.json();
    const { 
      nome, 
      preco, 
      ligaId, 
      timeId, 
      categoria, 
      serie, 
      ano, 
      tamanhos, 
      cor, 
      estoque = 100,
      ativo = true 
    } = body;

    // Validações básicas
    if (!nome || !preco || !ligaId || !timeId || !categoria) {
      return Response.json({ 
        error: "Campos obrigatórios: nome, preço, liga, time e categoria" 
      }, { status: 400 });
    }

    if (preco <= 0) {
      return Response.json({ 
        error: "Preço deve ser maior que zero" 
      }, { status: 400 });
    }

    // Verificar se liga existe
    const liga = await prisma.liga.findUnique({
      where: { id: ligaId }
    });

    if (!liga) {
      return Response.json({ error: "Liga não encontrada" }, { status: 400 });
    }

    // Verificar se time existe e pertence à liga
    const time = await prisma.time.findFirst({
      where: { 
        id: timeId,
        ligaId: ligaId 
      }
    });

    if (!time) {
      return Response.json({ 
        error: "Time não encontrado ou não pertence à liga selecionada" 
      }, { status: 400 });
    }

    // Gerar código único para o produto
    const codigo = `${liga.sigla}${time.id}${Date.now().toString().slice(-4)}`;

    // Criar produto
    const produto = await prisma.produto.create({
      data: {
        nome,
        codigo,
        preco,
        categoria,
        descricao: `${categoria} oficial do ${time.nome} - ${liga.nome}`,
        tamanho: tamanhos || 'M',
        cor: cor || 'Padrão',
        sport: liga.sigla === 'NBA' ? 'Basquete' : liga.sigla === 'NFL' ? 'Futebol Americano' : 'Futebol',
        year: ano || new Date().getFullYear(),
        serie: serie || 'Atual temporada',
        estoque,
        ativo,
        liga: liga.nome,
        ligue: liga.sigla,
        time: time.nome,
        imagemUrl: '/images/produtos/placeholder.jpg', // Placeholder por enquanto
        ligaId,
        timeId
      },
      include: {
        ligaObj: true,
        timeObj: true
      }
    });

    return Response.json(produto, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return Response.json({ 
      error: "Erro interno do servidor",
      details: error.message 
    }, { status: 500 });
  }
}

// GET /api/admin/produtos - Listar todos os produtos (apenas admin)
export async function GET(request) {
  try {
    // Para desenvolvimento, vamos pular a verificação de autenticação por enquanto
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "admin") {
    //   return Response.json({ error: "Acesso negado" }, { status: 403 });
    // }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const [produtos, total] = await Promise.all([
      prisma.produto.findMany({
        skip,
        take: limit,
        include: {
          ligaObj: true,
          timeObj: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.produto.count()
    ]);

    return Response.json({
      produtos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return Response.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}