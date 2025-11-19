import prisma from '../../../lib/db';

// GET /api/ligas - Listar todas as ligas ativas
export async function GET() {
  try {
    const ligas = await prisma.liga.findMany({
      where: { ativo: true },
      include: {
        times: {
          where: { ativo: true },
          orderBy: { nome: 'asc' }
        },
        _count: {
          select: { produtos: true }
        }
      },
      orderBy: { nome: 'asc' }
    });

    return Response.json(ligas);
  } catch (error) {
    console.error('Erro ao buscar ligas:', error);
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}