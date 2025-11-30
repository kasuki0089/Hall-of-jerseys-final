import prisma from '../../../../lib/db';

// GET /api/enderecos/[id] - Buscar endereço por ID
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const enderecoId = parseInt(id);;

    const endereco = await prisma.endereco.findUnique({
      where: { id: enderecoId },
      include: {
        estado: {
          select: {
            uf: true,
            nome: true
          }
        }
      }
    });

    if (!endereco) {
      return new Response(JSON.stringify({ error: 'Endereço não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(endereco), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    return new Response(JSON.stringify({ error: 'Erro ao buscar endereço' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT /api/enderecos/[id] - Atualizar endereço
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const enderecoId = parseInt(id);
    
    const data = await req.json();

    const enderecoAtualizado = await prisma.endereco.update({
      where: { id: enderecoId },
      data: {
        endereco: data.logradouro,
        numero: data.numero,
        complemento: data.complemento || null,
        bairro: data.bairro,
        cidade: data.cidade,
        cep: data.cep.replace(/\D/g, ''),
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
      endereco: enderecoAtualizado
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao atualizar endereço:', error);
    return new Response(JSON.stringify({ error: 'Erro ao atualizar endereço' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE /api/enderecos/[id] - Deletar endereço
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const enderecoId = parseInt(id);

    await prisma.endereco.delete({
      where: { id: enderecoId }
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao deletar endereço:', error);
    return new Response(JSON.stringify({ error: 'Erro ao deletar endereço' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
