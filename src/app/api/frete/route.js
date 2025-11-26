import prisma from '../../../lib/db';

// Simular API de calculo de frete
const calcularFrete = (cepOrigem, cepDestino, peso = 0.5, valor = 100) => {
  // Simular diferentes transportadoras com precos e prazos
  const transportadoras = [
    {
      nome: 'PAC',
      preco: 15.50,
      prazo: '10 a 15 dias uteis',
      codigo: 'pac'
    },
    {
      nome: 'SEDEX',
      preco: 25.80,
      prazo: '3 a 5 dias uteis',
      codigo: 'sedex'
    },
    {
      nome: 'SEDEX 10',
      preco: 45.00,
      prazo: '1 dia util',
      codigo: 'sedex10'
    }
  ];

  // Aplicar variacao baseada na distancia (simulada)
  const distanciaFactor = Math.random() * 0.5 + 0.75; // Entre 75% e 125%
  const pesoFactor = peso * 2; // R$ 2,00 por 100g adicional

  return transportadoras.map(transportadora => ({
    ...transportadora,
    preco: parseFloat((transportadora.preco * distanciaFactor + pesoFactor).toFixed(2)),
    prazoMin: transportadora.codigo === 'pac' ? 10 : transportadora.codigo === 'sedex' ? 3 : 1,
    prazoMax: transportadora.codigo === 'pac' ? 15 : transportadora.codigo === 'sedex' ? 5 : 1
  }));
};

// Validar CEP
const validarCEP = (cep) => {
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.length === 8;
};

// Buscar endereco por CEP (simulado)
const buscarEnderecoPorCEP = async (cep) => {
  // Em producao, usar API do ViaCEP ou similar
  const cepLimpo = cep.replace(/\D/g, '');
  
  // Dados simulados baseados no CEP
  const prefixo = cepLimpo.substring(0, 2);
  
  const estados = {
    '01': { estado: 'SP', cidade: 'Sao Paulo' },
    '20': { estado: 'RJ', cidade: 'Rio de Janeiro' },
    '30': { estado: 'MG', cidade: 'Belo Horizonte' },
    '40': { estado: 'BA', cidade: 'Salvador' },
    '50': { estado: 'PE', cidade: 'Recife' },
    '60': { estado: 'CE', cidade: 'Fortaleza' },
    '70': { estado: 'DF', cidade: 'Brasilia' },
    '80': { estado: 'PR', cidade: 'Curitiba' },
    '90': { estado: 'RS', cidade: 'Porto Alegre' },
    '04': { estado: 'SP', cidade: 'Sao Paulo' }
  };

  const endereco = estados[prefixo] || { estado: 'SP', cidade: 'Sao Paulo' };
  
  return {
    cep: cepLimpo,
    logradouro: 'Rua Exemplo',
    bairro: 'Centro',
    cidade: endereco.cidade,
    uf: endereco.estado
  };
};

// POST /api/frete - Calcular frete
export async function POST(req) {
  try {
    const { cepDestino, produtos = [], cepOrigem = '01310100' } = await req.json();

    // Validacoes
    if (!cepDestino) {
      return Response.json({ error: 'CEP de destino e obrigatorio' }, { status: 400 });
    }

    if (!validarCEP(cepDestino)) {
      return Response.json({ error: 'CEP invalido' }, { status: 400 });
    }

    if (!produtos.length) {
      return Response.json({ error: 'Lista de produtos nao pode estar vazia' }, { status: 400 });
    }

    // Buscar informacoes dos produtos
    const produtoIds = produtos.map(p => p.id);
    const produtosBanco = await prisma.produto.findMany({
      where: { id: { in: produtoIds } },
      select: {
        id: true,
        nome: true,
        preco: true,
        peso: true
      }
    });

    // Calcular peso total e valor total
    let pesoTotal = 0;
    let valorTotal = 0;

    produtos.forEach(item => {
      const produtoBanco = produtosBanco.find(p => p.id === item.id);
      if (produtoBanco) {
        const quantidade = item.quantidade || 1;
        pesoTotal += (produtoBanco.peso || 0.5) * quantidade;
        valorTotal += produtoBanco.preco * quantidade;
      }
    });

    // Buscar endereco do CEP
    const enderecoDestino = await buscarEnderecoPorCEP(cepDestino);

    // Calcular frete
    const opcoesFrete = calcularFrete(cepOrigem, cepDestino, pesoTotal, valorTotal);

    // Verificar frete gratis (acima de R$ 200)
    const freteGratis = valorTotal >= 200;
    
    if (freteGratis) {
      opcoesFrete.forEach(opcao => {
        if (opcao.codigo === 'pac') {
          opcao.preco = 0;
          opcao.promocao = 'Frete gratis para compras acima de R$ 200';
        }
      });
    }

    return Response.json({
      cepDestino,
      enderecoDestino,
      valorTotal,
      pesoTotal,
      freteGratis,
      opcoesFrete,
      observacoes: {
        freteGratis: 'Frete gratis via PAC para compras acima de R$ 200',
        prazoAdicional: 'Prazos nao incluem finais de semana',
        areaDeRisco: false
      }
    });

  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// GET /api/frete - Listar regioes de entrega
export async function GET(req) {
  try {
    const regioes = [
      {
        nome: 'Regiao Metropolitana de Sao Paulo',
        estados: ['SP'],
        freteGratis: 150,
        prazoAdicional: 0
      },
      {
        nome: 'Sudeste',
        estados: ['SP', 'RJ', 'MG', 'ES'],
        freteGratis: 200,
        prazoAdicional: 1
      },
      {
        nome: 'Sul',
        estados: ['PR', 'SC', 'RS'],
        freteGratis: 200,
        prazoAdicional: 2
      },
      {
        nome: 'Centro-Oeste',
        estados: ['GO', 'MT', 'MS', 'DF'],
        freteGratis: 250,
        prazoAdicional: 3
      },
      {
        nome: 'Nordeste',
        estados: ['BA', 'SE', 'PE', 'AL', 'PB', 'RN', 'CE', 'PI', 'MA'],
        freteGratis: 300,
        prazoAdicional: 5
      },
      {
        nome: 'Norte',
        estados: ['AM', 'RR', 'AP', 'PA', 'TO', 'RO', 'AC'],
        freteGratis: 350,
        prazoAdicional: 7
      }
    ];

    return Response.json(regioes);
  } catch (error) {
    console.error('Erro ao buscar regioes:', error);
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}