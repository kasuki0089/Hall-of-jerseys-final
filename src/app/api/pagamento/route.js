// Sistema de simulação de pagamento independente do banco de dados

// Simulação de dados de transações em memória
const transacoesSimuladas = new Map();
let contadorTransacao = 1;

export async function POST(req) {
  try {
    const { 
      pedidoId, 
      formaPagamento, 
      dadosPagamento,
      valor 
    } = await req.json();

    console.log('🏦 Processando pagamento simulado:', {
      pedidoId,
      formaPagamento,
      valor
    });

    if (!pedidoId || !formaPagamento || !valor) {
      return new Response(JSON.stringify({ error: 'Dados obrigatórios faltando' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Gerar ID único para transação
    const transacaoId = `TXN_${Date.now()}_${contadorTransacao++}`;

    let resultadoPagamento;

    // Processar pagamento baseado na forma
    switch (formaPagamento.toUpperCase()) {
      case 'PIX':
        resultadoPagamento = await processarPIX(dadosPagamento, valor, transacaoId);
        break;
      case 'CARTAO':
        resultadoPagamento = await processarCartao(dadosPagamento, valor, transacaoId);
        break;
      case 'BOLETO':
        resultadoPagamento = await processarBoleto(dadosPagamento, valor, transacaoId);
        break;
      default:
        return new Response(JSON.stringify({ error: 'Forma de pagamento não suportada' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    // Salvar transação simulada na memória
    const transacao = {
      id: transacaoId,
      pedidoId: parseInt(pedidoId),
      tipo: formaPagamento.toUpperCase(),
      valor: parseFloat(valor),
      status: resultadoPagamento.status,
      dadosGateway: JSON.stringify(resultadoPagamento.dados),
      erro: resultadoPagamento.erro || null,
      processadoEm: new Date(),
      dados: resultadoPagamento.dados
    };

    transacoesSimuladas.set(transacaoId, transacao);

    console.log('✅ Transação simulada criada:', transacaoId, transacao.status);

    return new Response(JSON.stringify({
      success: true,
      transacao: {
        id: transacao.id,
        status: transacao.status,
        tipo: transacao.tipo,
        valor: transacao.valor,
        dados: resultadoPagamento.dados,
        message: resultadoPagamento.message
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Erro ao processar pagamento:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Simulação de processamento PIX
async function processarPIX(dados, valor, transacaoId) {
  console.log('📱 Processando PIX simulado...');
  
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Gerar código PIX simulado
  const codigoPIX = `00020101021243650016COM.MERCADOLIVRE02013063200007190204048154040`+Math.random().toString(36).substr(2, 20).toUpperCase();
  
  // Simular QR Code (base64 de uma imagem SVG simples)
  const qrCodeSVG = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="white"/>
    <rect x="10" y="10" width="20" height="20" fill="black"/>
    <rect x="40" y="10" width="20" height="20" fill="black"/>
    <rect x="70" y="10" width="20" height="20" fill="black"/>
    <text x="100" y="100" font-size="12" text-anchor="middle" fill="black">PIX</text>
    <text x="100" y="120" font-size="10" text-anchor="middle" fill="black">${transacaoId}</text>
    <text x="100" y="140" font-size="10" text-anchor="middle" fill="black">R$ ${parseFloat(valor).toFixed(2)}</text>
  </svg>`;
  
  const qrCodeData = `data:image/svg+xml;base64,${Buffer.from(qrCodeSVG).toString('base64')}`;

  // Simular aprovação instantânea (95% de chance)
  const aprovado = Math.random() > 0.05;

  console.log(`📱 PIX ${aprovado ? 'APROVADO' : 'REJEITADO'}`);

  return {
    status: aprovado ? 'APROVADO' : 'REJEITADO',
    dados: {
      codigoPIX: codigoPIX,
      qrCode: qrCodeData,
      validade: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
      banco: 'BANCO_CENTRAL',
      chave: dados.chavePix || 'hallojerseys@pix.com.br',
      valor: parseFloat(valor),
      beneficiario: 'HALL OF JERSEYS LTDA'
    },
    message: aprovado ? 'PIX gerado com sucesso! Escaneie o QR Code para pagar.' : 'Falha na geração do PIX',
    erro: aprovado ? null : 'Erro na comunicação com o Banco Central'
  };
}

// Simulação de processamento Cartão
async function processarCartao(dados, valor, transacaoId) {
  console.log('💳 Processando cartão simulado...');
  
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Validações básicas do cartão
  const numeroCartao = dados.numero?.replace(/\s/g, '') || '';
  const cvv = dados.cvv || '';
  const validade = dados.validade || '';

  if (!numeroCartao || numeroCartao.length < 16) {
    console.log('❌ Cartão rejeitado: número inválido');
    return {
      status: 'REJEITADO',
      dados: { motivo: 'Número do cartão inválido' },
      message: 'Cartão rejeitado',
      erro: 'Número do cartão inválido'
    };
  }

  if (!cvv || cvv.length < 3) {
    console.log('❌ Cartão rejeitado: CVV inválido');
    return {
      status: 'REJEITADO',
      dados: { motivo: 'CVV inválido' },
      message: 'Cartão rejeitado',
      erro: 'CVV inválido'
    };
  }

  // Simular diferentes cenários baseado no final do cartão
  const ultimoDigito = numeroCartao.slice(-1);
  let aprovado = true;
  let motivo = '';

  if (ultimoDigito === '1') {
    aprovado = false;
    motivo = 'Cartão bloqueado';
  } else if (ultimoDigito === '2') {
    aprovado = false;
    motivo = 'Saldo insuficiente';
  } else if (ultimoDigito === '3') {
    aprovado = false;
    motivo = 'Cartão expirado';
  } else {
    // 85% de chance de aprovação para outros casos
    aprovado = Math.random() > 0.15;
    motivo = aprovado ? '' : 'Transação não autorizada pela operadora';
  }

  const codigoAutorizacao = aprovado ? `AUTH_${Math.random().toString(36).substr(2, 8).toUpperCase()}` : null;

  console.log(`💳 Cartão ${aprovado ? 'APROVADO' : 'REJEITADO'}${motivo ? ': ' + motivo : ''}`);

  return {
    status: aprovado ? 'APROVADO' : 'REJEITADO',
    dados: {
      codigoAutorizacao,
      nsu: `NSU${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      bandeira: detectarBandeira(numeroCartao),
      ultimosDigitos: numeroCartao.slice(-4),
      parcelas: dados.parcelas || 1,
      valor: parseFloat(valor),
      motivo: motivo || undefined,
      tid: `TID${Math.random().toString(36).substr(2, 10).toUpperCase()}`
    },
    message: aprovado ? `Transação aprovada! Código: ${codigoAutorizacao}` : `Transação rejeitada: ${motivo}`,
    erro: aprovado ? null : motivo
  };
}

// Simulação de processamento Boleto
async function processarBoleto(dados, valor, transacaoId) {
  console.log('🧾 Gerando boleto simulado...');
  
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 500));

  // Gerar linha digitável do boleto
  const linhaDigitavel = `34191.79001 01043.510047 91020.150008 1 ${Math.floor(Date.now() / 1000).toString().substr(-4)}${Math.floor(valor * 100).toString().padStart(10, '0')}`;
  
  // Gerar código de barras
  const codigoBarras = `34191${Math.floor(Date.now() / 1000).toString().substr(-4)}${Math.floor(valor * 100).toString().padStart(10, '0')}7900010435100479102015000`;

  // Data de vencimento (3 dias úteis)
  const dataVencimento = new Date();
  dataVencimento.setDate(dataVencimento.getDate() + 3);

  // Gerar nosso número
  const nossoNumero = `00000${Math.floor(Math.random() * 99999).toString().padStart(5, '0')}-${Math.floor(Math.random() * 9)}`;

  console.log('🧾 Boleto gerado com sucesso');

  return {
    status: 'PENDENTE', // Boleto sempre fica pendente até o pagamento
    dados: {
      linhaDigitavel,
      codigoBarras,
      dataVencimento: dataVencimento.toISOString(),
      valor: parseFloat(valor),
      cedente: 'HALL OF JERSEYS LTDA',
      cnpjCedente: '12.345.678/0001-90',
      banco: '341 - Itaú Unibanco S.A.',
      agencia: '1790',
      conta: '01043-5',
      nossoNumero,
      documentoNumero: transacaoId,
      instrucoes: [
        '- Pagar até a data de vencimento',
        '- Após vencimento multa de 2% + juros de 1% ao mês',
        '- Em caso de dúvidas entre em contato conosco'
      ]
    },
    message: 'Boleto gerado com sucesso! Efetue o pagamento até a data de vencimento.',
    erro: null
  };
}

// Função auxiliar para detectar bandeira do cartão
function detectarBandeira(numero) {
  const first4 = numero.substring(0, 4);
  const first2 = numero.substring(0, 2);
  const first1 = numero.substring(0, 1);

  if (first1 === '4') return 'Visa';
  if (first2 >= '51' && first2 <= '55') return 'Mastercard';
  if (first4 >= '2221' && first4 <= '2720') return 'Mastercard'; // Nova faixa Mastercard
  if (first2 === '34' || first2 === '37') return 'American Express';
  if (first4 === '6011' || first2 === '65') return 'Discover';
  if (first2 === '30' || first2 === '38') return 'Diners Club';
  if (first4 === '5066' || first4 === '5067') return 'Elo';
  if (first4 === '4011' || first4 === '4312') return 'Elo';
  
  return 'Desconhecida';
}

// GET /api/pagamento - Consultar status de transação
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const transacaoId = searchParams.get('transacaoId');
    const pedidoId = searchParams.get('pedidoId');

    console.log('🔍 Consultando transação:', { transacaoId, pedidoId });

    if (!transacaoId && !pedidoId) {
      return new Response(JSON.stringify({ error: 'transacaoId ou pedidoId é obrigatório' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let transacao;

    if (transacaoId) {
      transacao = transacoesSimuladas.get(transacaoId);
    } else {
      // Buscar por pedidoId
      for (const [id, txn] of transacoesSimuladas.entries()) {
        if (txn.pedidoId === parseInt(pedidoId)) {
          transacao = txn;
          break;
        }
      }
    }

    if (!transacao) {
      console.log('❌ Transação não encontrada');
      return new Response(JSON.stringify({ error: 'Transação não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Simular mudança de status para boleto após um tempo
    if (transacao.tipo === 'BOLETO' && transacao.status === 'PENDENTE') {
      const tempoDecorrido = Date.now() - new Date(transacao.processadoEm).getTime();
      
      // Simular pagamento do boleto após 1 minuto (para demonstração)
      if (tempoDecorrido > 1 * 60 * 1000 && Math.random() > 0.5) {
        transacao.status = 'APROVADO';
        transacao.dados.dataPagamento = new Date().toISOString();
        console.log('🧾 Boleto pago automaticamente (simulação)');
      }
    }

    console.log('✅ Transação encontrada:', transacao.id, transacao.status);

    return new Response(JSON.stringify({
      success: true,
      transacao: {
        id: transacao.id,
        status: transacao.status,
        tipo: transacao.tipo,
        valor: transacao.valor,
        dados: transacao.dados,
        processadoEm: transacao.processadoEm,
        erro: transacao.erro
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Erro ao consultar transação:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}