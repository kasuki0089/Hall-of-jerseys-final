import prisma from '../../../lib/db';

// GET /api/ligas - Listar todas as ligas
export async function GET() {
  try {
    const ligas = await prisma.liga.findMany({
      orderBy: { sigla: 'asc' }
    });

    return Response.json(ligas);
  } catch (error) {
    console.error('Erro ao buscar ligas:', error);
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}