import prisma from '../../../../lib/db';

// GET /api/avaliacoes/[id] - Buscar avaliação específica
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    
    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id: parseInt(id) },
      include: {
        produto: {
          select: {
            nome: true,
            imagemUrl: true,
            liga: { select: { sigla: true } },
            time: { select: { nome: true } }
          }
        },
        usuario: {
          select: {
            nome: true
          }
        }
      }
    });

    if (!avaliacao) {
      return new Response(JSON.stringify({ error: 'Avaliação não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(avaliacao), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao buscar avaliação:', error);
    return new Response(JSON.stringify({ error: 'Erro ao buscar avaliação' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// PUT /api/avaliacoes/[id] - Atualizar avaliação
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const { nota, comentario } = await req.json();

    if (nota && (nota < 1 || nota > 5)) {
      return new Response(
        JSON.stringify({ error: 'Nota deve estar entre 1.0 e 5.0' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const avaliacao = await prisma.avaliacao.update({
      where: { id: parseInt(id) },
      data: {
        ...(nota && { nota: parseFloat(nota) }),
        ...(comentario !== undefined && { comentario })
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
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    return new Response(JSON.stringify({ error: 'Erro ao atualizar avaliação' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// DELETE /api/avaliacoes/[id] - Deletar avaliação
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await prisma.avaliacao.delete({
      where: { id: parseInt(id) }
    });

    return new Response(JSON.stringify({ message: 'Avaliação deletada com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao deletar avaliação:', error);
    return new Response(JSON.stringify({ error: 'Erro ao deletar avaliação' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
