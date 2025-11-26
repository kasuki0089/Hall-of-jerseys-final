import prisma from '../../../lib/db';
import crypto from 'crypto';

// Simular processamento de pagamentos
const processarPagamento = async (dadosPagamento) => {
  const { tipo, valor, dados } = dadosPagamento;
  
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simular taxa de sucesso (95%)
  const sucesso = Math.random() < 0.95;
  
  if (!sucesso) {
    throw new Error('Pagamento recusado pelo gateway');
  }
  
  const transacaoId = crypto.randomUUID();
  
  switch (tipo) {
    case 'pix':
      return {
        transacaoId,
        status: 'aprovado',
        tipo: 'pix',
        qrCode: `00020126580014BR.GOV.BCB.PIX${transacaoId}`,
        codigoPix: `PIX${transacaoId.substring(0, 8).toUpperCase()}`,
        prazoVencimento: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
        observacoes: 'Pagamento via PIX processado instantaneamente'
      };
      
    case 'cartao':
      return {
        transacaoId,
        status: 'aprovado',
        tipo: 'cartao',
        bandeira: dados.numero.startsWith('4') ? 'Visa' : 'Mastercard',
        ultimosDigitos: dados.numero.slice(-4),
        autorizacao: `AUTH${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        parcelas: dados.parcelas || 1,
        observacoes: `Pagamento aprovado em ${dados.parcelas || 1}x`
      };
      
    case 'boleto':
      return {
        transacaoId,
        status: 'pendente',
        tipo: 'boleto',
        codigoBarras: '34191234567890123456789012345678901234567890',
        linhaDigitavel: '34191.23456 78901.234567 89012.345678 9 01234567890',
        prazoVencimento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dias
        urlBoleto: `/api/pagamento/boleto/${transacaoId}`,
        observacoes: 'Boleto bancario com vencimento em 3 dias uteis'
      };
      
    default:
      throw new Error('Metodo de pagamento nao suportado');
  }
};

// POST /api/pagamento - Processar pagamento
export async function POST(req) {
  try {
    const {
      pedidoId,
      metodoPagamento,
      dadosPagamento,
      valorTotal,
      dadosEntrega
    } = await req.json();

    // Validacoes basicas
    if (!pedidoId || !metodoPagamento || !valorTotal) {
      return Response.json(
        { error: 'Dados obrigatorios: pedidoId, metodoPagamento, valorTotal' },
        { status: 400 }
      );
    }

    if (valorTotal <= 0) {
      return Response.json(
        { error: 'Valor deve ser maior que zero' },
        { status: 400 }
      );
    }

    // Verificar se o pedido existe
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        itens: {
          include: {
            produto: true
          }
        },
        usuario: true
      }
    });

    if (!pedido) {
      return Response.json(
        { error: 'Pedido nao encontrado' },
        { status: 404 }
      );
    }

    if (pedido.status !== 'PENDENTE') {
      return Response.json(
        { error: 'Pedido ja foi processado' },
        { status: 400 }
      );
    }

    // Validacoes especificas por metodo de pagamento
    switch (metodoPagamento) {
      case 'cartao':
        if (!dadosPagamento.numero || !dadosPagamento.cvv || !dadosPagamento.validade) {
          return Response.json(
            { error: 'Dados do cartao incompletos' },
            { status: 400 }
          );
        }
        break;
        
      case 'pix':
        // PIX nao precisa de dados adicionais
        break;
        
      case 'boleto':
        // Boleto nao precisa de dados adicionais
        break;
        
      default:
        return Response.json(
          { error: 'Metodo de pagamento nao suportado' },
          { status: 400 }
        );
    }

    try {
      // Processar pagamento
      const resultadoPagamento = await processarPagamento({
        tipo: metodoPagamento,
        valor: valorTotal,
        dados: dadosPagamento
      });

      // Salvar transacao
      const transacao = await prisma.transacao.create({
        data: {
          id: resultadoPagamento.transacaoId,
          pedidoId: pedido.id,
          tipo: metodoPagamento.toUpperCase(),
          valor: valorTotal,
          status: resultadoPagamento.status.toUpperCase(),
          dadosGateway: JSON.stringify(resultadoPagamento),
          processadoEm: new Date()
        }
      });

      // Atualizar status do pedido
      let novoStatusPedido = 'PENDENTE';
      if (resultadoPagamento.status === 'aprovado') {
        novoStatusPedido = 'CONFIRMADO';
      } else if (resultadoPagamento.status === 'pendente') {
        novoStatusPedido = 'AGUARDANDO_PAGAMENTO';
      }

      await prisma.pedido.update({
        where: { id: pedido.id },
        data: {
          status: novoStatusPedido,
          transacaoId: transacao.id,
          confirmadoEm: resultadoPagamento.status === 'aprovado' ? new Date() : null
        }
      });

      return Response.json({
        sucesso: true,
        transacao: {
          id: transacao.id,
          status: resultadoPagamento.status,
          tipo: metodoPagamento
        },
        pagamento: resultadoPagamento,
        pedido: {
          id: pedido.id,
          status: novoStatusPedido
        }
      });

    } catch (error) {
      // Salvar tentativa de pagamento com erro
      await prisma.transacao.create({
        data: {
          id: crypto.randomUUID(),
          pedidoId: pedido.id,
          tipo: metodoPagamento.toUpperCase(),
          valor: valorTotal,
          status: 'REJEITADO',
          erro: error.message,
          processadoEm: new Date()
        }
      });

      return Response.json(
        { error: error.message },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    return Response.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// GET /api/pagamento - Listar metodos de pagamento disponiveis
export async function GET(req) {
  try {
    const metodos = [
      {
        codigo: 'pix',
        nome: 'PIX',
        descricao: 'Pagamento instantaneo via PIX',
        icone: '💰',
        ativo: true,
        taxas: {
          percentual: 0,
          fixo: 0
        },
        prazoProcessamento: 'Instantaneo',
        observacoes: 'Aprovacao imediata, disponivel 24h'
      },
      {
        codigo: 'cartao',
        nome: 'Cartao de Credito',
        descricao: 'Visa, Mastercard, Elo',
        icone: '💳',
        ativo: true,
        parcelamento: {
          maximo: 12,
          semJuros: 3,
          comJuros: 12
        },
        taxas: {
          percentual: 2.99,
          fixo: 0.39
        },
        prazoProcessamento: '1-2 dias uteis',
        observacoes: 'Parcelamento em ate 12x, as 3 primeiras sem juros'
      },
      {
        codigo: 'boleto',
        nome: 'Boleto Bancario',
        descricao: 'Pagamento via boleto',
        icone: '📄',
        ativo: true,
        taxas: {
          percentual: 0,
          fixo: 3.99
        },
        prazoProcessamento: '1-3 dias uteis',
        prazoVencimento: 3,
        observacoes: 'Vencimento em 3 dias uteis, confirmacao em ate 3 dias'
      }
    ];

    return Response.json(metodos);
  } catch (error) {
    console.error('Erro ao buscar metodos de pagamento:', error);
    return Response.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}