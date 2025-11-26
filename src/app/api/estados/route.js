import prisma from '../../../lib/db';

// GET /api/estados - Listar todos os estados
export async function GET() {
  try {
    const estados = await prisma.estado.findMany({
      orderBy: {
        nome: 'asc'
      }
    });

    return new Response(JSON.stringify(estados), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao buscar estados:', error);
    return new Response(JSON.stringify({ error: 'Erro ao buscar estados' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}