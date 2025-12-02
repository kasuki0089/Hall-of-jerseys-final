import prisma from '../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/avaliacoes - Listar avaliações do usuário ou todas (admin)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const usuarioId = searchParams.get('usuarioId');
    const produtoId = searchParams.get('produtoId');
    const isAdmin = searchParams.get('admin') === 'true';

    const where = {};
    if (usuarioId) where.usuarioId = parseInt(usuarioId);
    if (produtoId) where.produtoId = parseInt(produtoId);

    // Se for admin, verificar autorização
    if (isAdmin) {
      const session = await getServerSession(authOptions);
      if (!session || session.user?.role?.toUpperCase() !== 'ADMIN') {
        return new Response(JSON.stringify({ error: 'Acesso negado. Apenas administradores.' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      // Admin pode ver todas as avaliações sem filtro adicional
    }

    const avaliacoes = await prisma.avaliacao.findMany({
      where,
      include: {
        produto: {
          select: {
            id: true,
            nome: true,
            imagemUrl: true,
            liga: { select: { sigla: true } },
            time: { select: { nome: true } }
          }
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            email: isAdmin
          }
        }
      },
      orderBy: {
        criadoEm: 'desc'
      }
    });

    // Adicionar campo rating como alias de nota
    const avaliacoesFormatadas = avaliacoes.map(av => ({
      ...av,
      rating: av.nota
    }));

    return new Response(JSON.stringify(avaliacoesFormatadas), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    return new Response(JSON.stringify({ error: 'Erro ao buscar avaliações' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/avaliacoes - Criar nova avaliação
export async function POST(req) {
  try {
    const { usuarioId, produtoId, nota, comentario } = await req.json();

    if (!usuarioId || !produtoId || !nota) {
      return new Response(
        JSON.stringify({ error: 'usuarioId, produtoId e nota são obrigatórios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar nota (1.0 a 5.0)
    if (nota < 1 || nota > 5) {
      return new Response(
        JSON.stringify({ error: 'Nota deve estar entre 1.0 e 5.0' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se já existe avaliação
    const avaliacaoExistente = await prisma.avaliacao.findUnique({
      where: {
        usuarioId_produtoId: {
          usuarioId: parseInt(usuarioId),
          produtoId: parseInt(produtoId)
        }
      }
    });

    if (avaliacaoExistente) {
      return new Response(
        JSON.stringify({ error: 'Você já avaliou este produto' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const avaliacao = await prisma.avaliacao.create({
      data: {
        usuarioId: parseInt(usuarioId),
        produtoId: parseInt(produtoId),
        nota: parseFloat(nota),
        comentario: comentario || null
      },
      include: {
        produto: {
          select: {
            nome: true,
            imagemUrl: true
          }
        }
      }
    });

    return new Response(JSON.stringify(avaliacao), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    return new Response(JSON.stringify({ error: 'Erro ao criar avaliação' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
