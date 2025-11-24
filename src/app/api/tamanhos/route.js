import prisma from '../../../lib/db';

// GET /api/tamanhos - Listar todos os tamanhos
export async function GET() {
  try {
    const tamanhos = await prisma.tamanho.findMany({
      orderBy: {
        ordem: 'asc'
      }
    });

    return new Response(JSON.stringify(tamanhos), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao buscar tamanhos:', error);
    return new Response(JSON.stringify({ error: 'Erro ao buscar tamanhos' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}