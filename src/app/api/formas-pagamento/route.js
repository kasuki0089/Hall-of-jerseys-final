import prisma from '../../../lib/db';

// GET /api/formas-pagamento - Listar formas de pagamento de um usuário
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const usuarioId = searchParams.get('usuarioId');

    if (!usuarioId) {
      return new Response(JSON.stringify({ error: 'usuarioId é obrigatório' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formasPagamento = await prisma.formaPagamento.findMany({
      where: {
        usuarioId: parseInt(usuarioId),
        ativo: true
      },
      select: {
        id: true,
        tipo: true,
        numeroCartao: true,
        nomeCartao: true,
        validadeCartao: true,
        bandeiraCartao: true,
        criadoEm: true
      },
      orderBy: {
        criadoEm: 'desc'
      }
    });

    return new Response(JSON.stringify(formasPagamento), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao buscar formas de pagamento:', error);
    return new Response(JSON.stringify({ error: 'Erro ao buscar formas de pagamento' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST /api/formas-pagamento - Criar nova forma de pagamento
export async function POST(req) {
  try {
    const {
      usuarioId,
      tipo,
      numeroCartao,
      nomeCartao,
      validadeCartao,
      bandeiraCartao
    } = await req.json();

    if (!usuarioId || !tipo) {
      return new Response(JSON.stringify({ 
        error: 'usuarioId e tipo são obrigatórios' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const tiposValidos = ['cartao_credito', 'cartao_debito', 'pix', 'boleto'];
    if (!tiposValidos.includes(tipo)) {
      return new Response(JSON.stringify({ 
        error: 'Tipo de pagamento inválido',
        tiposValidos: tiposValidos
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Para cartões, validar campos obrigatórios
    if ((tipo === 'cartao_credito' || tipo === 'cartao_debito') && 
        (!numeroCartao || !nomeCartao || !validadeCartao)) {
      return new Response(JSON.stringify({ 
        error: 'Para cartões são obrigatórios: numeroCartao, nomeCartao, validadeCartao' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar se usuário existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(usuarioId) }
    });

    if (!usuario) {
      return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Para cartões, armazenar apenas os últimos 4 dígitos
    let numeroCartaoSeguro = null;
    if (numeroCartao) {
      const apenasNumeros = numeroCartao.replace(/\D/g, '');
      numeroCartaoSeguro = '**** **** **** ' + apenasNumeros.slice(-4);
    }

    const formaPagamento = await prisma.formaPagamento.create({
      data: {
        tipo,
        numeroCartao: numeroCartaoSeguro,
        nomeCartao,
        validadeCartao,
        bandeiraCartao,
        usuarioId: parseInt(usuarioId)
      }
    });

    return new Response(JSON.stringify({
      success: true,
      formaPagamento: {
        id: formaPagamento.id,
        tipo: formaPagamento.tipo,
        numeroCartao: formaPagamento.numeroCartao,
        nomeCartao: formaPagamento.nomeCartao,
        validadeCartao: formaPagamento.validadeCartao,
        bandeiraCartao: formaPagamento.bandeiraCartao,
        criadoEm: formaPagamento.criadoEm
      }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro ao criar forma de pagamento:', error);
    return new Response(JSON.stringify({ error: 'Erro ao criar forma de pagamento' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}