import prisma from '../../../lib/db';

// GET /api/times - Listar times (opcionalmente filtrado por liga)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ligaId = searchParams.get('ligaId') || searchParams.get('liga');

    const where = {};
    
    if (ligaId) {
      where.ligaId = parseInt(ligaId);
    }

    const times = await prisma.time.findMany({
      where,
      include: {
        liga: {
          select: {
            id: true,
            nome: true,
            sigla: true
          }
        },
        _count: {
          select: { produtos: true }
        }
      },
      orderBy: { nome: 'asc' }
    });

    return Response.json(times);
  } catch (error) {
    console.error('Erro ao buscar times:', error);
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}