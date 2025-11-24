import prisma from '../../../lib/db';

// GET /api/cores - Listar todas as cores
export async function GET() {
  try {
    const cores = await prisma.cor.findMany({
      orderBy: {
        nome: 'asc'
      }
    });

    return new Response(JSON.stringify(cores), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao buscar cores:', error);
    return new Response(JSON.stringify({ error: 'Erro ao buscar cores' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}