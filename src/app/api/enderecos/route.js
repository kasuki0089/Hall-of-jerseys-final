import prisma from '../../../lib/db';

// GET /api/enderecos - Listar endereços
export async function GET() {
  try {
    const enderecos = await prisma.endereco.findMany({
      include: {
        estado: {
          select: {
            uf: true,
            nome: true
          }
        },
        usuarios: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });

    return new Response(JSON.stringify(enderecos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao buscar endereços:', error);
    return new Response(JSON.stringify({ error: 'Erro ao buscar endereços' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/enderecos - Criar novo endereço
export async function POST(req) {
  try {
    const data = await req.json();

    const novoEndereco = await prisma.endereco.create({
      data: {
        endereco: data.logradouro,
        numero: data.numero,
        complemento: data.complemento || null,
        bairro: data.bairro,
        cidade: data.cidade,
        cep: data.cep.replace(/\D/g, ''), // Remove caracteres não numéricos
        estadoUf: data.uf
      },
      include: {
        estado: {
          select: {
            uf: true,
            nome: true
          }
        }
      }
    });

    return new Response(JSON.stringify({
      success: true,
      endereco: novoEndereco
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao criar endereço:', error);
    return new Response(JSON.stringify({ error: 'Erro ao criar endereço' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}