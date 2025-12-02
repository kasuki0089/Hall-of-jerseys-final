'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import MainTemplate from '@/templates/MainTemplate/Index';
import Image from 'next/image';
import { CheckCircle, XCircle, Clock, Copy, Download } from 'lucide-react';

interface TransacaoData {
  qrCode?: string;
  codigoPix?: string;
  codigoBarras?: string;
  numeroComprovanete?: string;
  vencimento?: string;
  banco?: string;
  instrucoes?: string[];
  [key: string]: any;
}

interface Transacao {
  id: string;
  status: 'APROVADO' | 'REJEITADO' | 'PENDENTE';
  tipo: 'PIX' | 'BOLETO' | 'CARTAO';
  message: string;
  dados: TransacaoData;
}

export default function PagamentoPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const pedidoId = searchParams.get('pedido');
  const valor = searchParams.get('valor');

  const [formaPagamento, setFormaPagamento] = useState('pix');
  const [dadosCartao, setDadosCartao] = useState({
    numero: '',
    nome: '',
    validade: '',
    cvv: '',
    parcelas: 1
  });
  const [processando, setProcessando] = useState(false);
  const [transacao, setTransacao] = useState<Transacao | null>(null);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    if (!pedidoId || !valor) {
      router.push('/carrinho');
      return;
    }
  }, [session, pedidoId, valor]);

  const processarPagamento = async () => {
    if (!pedidoId || !valor) {
      showToast('Preencha todos os campos', 'warning');
      return;
    }

    setProcessando(true);
    setMensagem('');

    try {
      let dadosPagamento = {};

      if (formaPagamento === 'cartao') {
        if (!dadosCartao.numero || !dadosCartao.nome || !dadosCartao.validade || !dadosCartao.cvv) {
          showToast('Preencha todos os campos', 'warning');
          setProcessando(false);
          return;
        }
        dadosPagamento = dadosCartao;
      }

      console.log('🔄 Iniciando pagamento:', { pedidoId, valor, formaPagamento });

      const response = await fetch('/api/pagamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pedidoId: parseInt(pedidoId),
          formaPagamento: formaPagamento,
          dadosPagamento: dadosPagamento,
          valor: parseFloat(valor)
        }),
      });

      const result = await response.json();
      console.log('📋 Resultado do pagamento:', result);

      if (result.success) {
        setTransacao(result.transacao);
        setMensagem(result.transacao.message);
        
        if (result.transacao.status === 'APROVADO') {
          setTimeout(() => {
            router.push(`/perfil/pedidos/${pedidoId}`);
          }, 5000);
        }
      } else {
        showToast('Erro no pagamento: ' + result.error, 'error');
      }
    } catch (error) {
      console.error('❌ Erro ao processar pagamento:', error);
      showToast('Erro no pagamento', 'error');
    } finally {
      setProcessando(false);
    }
  };

  const consultarStatusTransacao = async () => {
    if (!transacao) return;

    try {
      const response = await fetch(`/api/pagamento?transacaoId=${transacao.id}`);
      const result = await response.json();

      if (result.success) {
        setTransacao(result.transacao);
        if (result.transacao.status === 'APROVADO' && transacao.status !== 'APROVADO') {
          setMensagem('✅ Pagamento aprovado!');
          setTimeout(() => {
            router.push(`/perfil/pedidos/${pedidoId}`);
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Erro ao consultar status:', error);
    }
  };

  const copiarTexto = (texto: string) => {
    navigator.clipboard.writeText(texto);
    showToast('Copiado para área de transferência!', 'success');
  };

  const gerarBoleto = () => {
    if (!transacao) return;
    const dados = transacao.dados;
    const boletoHTML = `
      <html>
        <head><title>Boleto Bancário</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="border: 2px solid #000; padding: 15px;">
            <h2>BOLETO BANCÁRIO</h2>
            <p><strong>Banco:</strong> ${dados.banco}</p>
            <p><strong>Beneficiário:</strong> ${dados.cedente}</p>
            <p><strong>CNPJ:</strong> ${dados.cnpjCedente}</p>
            <p><strong>Valor:</strong> R$ ${dados.valor.toFixed(2)}</p>
            <p><strong>Vencimento:</strong> ${new Date(dados.dataVencimento).toLocaleDateString('pt-BR')}</p>
            <hr>
            <p><strong>Linha Digitável:</strong></p>
            <p style="font-size: 16px; font-weight: bold;">${dados.linhaDigitavel}</p>
            <hr>
            <h3>Instruções:</h3>
            ${dados.instrucoes?.map((instrucao: string) => `<p>• ${instrucao}</p>`).join('') || ''}
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([boletoHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boleto-${transacao.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!session) {
    return <MainTemplate><div>Carregando...</div></MainTemplate>;
  }

  return (
    <MainTemplate>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Pagamento</h1>
        
        <div className="max-w-2xl mx-auto">
          {/* Resumo do Pedido */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
            <div className="flex justify-between items-center">
              <span>Pedido #{pedidoId}</span>
              <span className="text-2xl font-bold text-green-600">R$ {parseFloat(String(valor || 0)).toFixed(2)}</span>
            </div>
          </div>

          {!transacao ? (
            /* Seleção de Forma de Pagamento */
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Forma de Pagamento</h2>
              
              {/* Botões de Seleção */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => setFormaPagamento('pix')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    formaPagamento === 'pix' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-2">📱</div>
                  <div className="font-medium">PIX</div>
                  <div className="text-sm text-gray-600">Instantâneo</div>
                </button>
                
                <button
                  onClick={() => setFormaPagamento('cartao')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    formaPagamento === 'cartao' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-2">💳</div>
                  <div className="font-medium">Cartão</div>
                  <div className="text-sm text-gray-600">Até 12x</div>
                </button>
                
                <button
                  onClick={() => setFormaPagamento('boleto')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    formaPagamento === 'boleto' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🧾</div>
                  <div className="font-medium">Boleto</div>
                  <div className="text-sm text-gray-600">3 dias úteis</div>
                </button>
              </div>

              {/* Formulário do Cartão */}
              {formaPagamento === 'cartao' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Número do Cartão</label>
                    <input
                      type="text"
                      value={dadosCartao.numero}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
                        setDadosCartao(prev => ({ ...prev, numero: value }));
                      }}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome no Cartão</label>
                    <input
                      type="text"
                      value={dadosCartao.nome}
                      onChange={(e) => setDadosCartao(prev => ({ ...prev, nome: e.target.value.toUpperCase() }))}
                      placeholder="NOME COMO ESTÁ NO CARTÃO"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Validade</label>
                      <input
                        type="text"
                        value={dadosCartao.validade}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + '/' + value.substring(2, 4);
                          }
                          setDadosCartao(prev => ({ ...prev, validade: value }));
                        }}
                        placeholder="MM/AA"
                        maxLength={5}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CVV</label>
                      <input
                        type="text"
                        value={dadosCartao.cvv}
                        onChange={(e) => setDadosCartao(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                        placeholder="123"
                        maxLength={4}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Parcelas</label>
                      <select
                        value={dadosCartao.parcelas}
                        onChange={(e) => setDadosCartao(prev => ({ ...prev, parcelas: parseInt(e.target.value) }))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(i => (
                          <option key={i} value={i}>
                            {i}x de R$ {(parseFloat(String(valor || 0)) / i).toFixed(2)}
                            {i === 1 ? ' à vista' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Informações sobre PIX */}
              {formaPagamento === 'pix' && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-blue-800 mb-2">PIX - Pagamento Instantâneo</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Processamento imediato</li>
                    <li>• Disponível 24h por dia, 7 dias por semana</li>
                    <li>• Use o QR Code ou código PIX para pagar</li>
                    <li>• Confirme os dados antes de finalizar</li>
                  </ul>
                </div>
              )}

              {/* Informações sobre Boleto */}
              {formaPagamento === 'boleto' && (
                <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-yellow-800 mb-2">Boleto Bancário</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Vencimento em 3 dias úteis</li>
                    <li>• Pode ser pago em qualquer banco ou app</li>
                    <li>• Confirmação em até 2 dias úteis após pagamento</li>
                    <li>• Multa de 2% após vencimento</li>
                  </ul>
                </div>
              )}

              <button
                onClick={processarPagamento}
                disabled={processando}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
              >
                {processando ? 'Processando...' : `Pagar R$ ${parseFloat(String(valor || 0)).toFixed(2)}`}
              </button>
            </div>
          ) : (
            /* Resultado do Pagamento */
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                {transacao.status === 'APROVADO' && (
                  <div className="text-green-600">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-800">Pagamento Aprovado!</h2>
                  </div>
                )}
                {transacao.status === 'REJEITADO' && (
                  <div className="text-red-600">
                    <XCircle className="w-16 h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-800">Pagamento Rejeitado</h2>
                  </div>
                )}
                {transacao.status === 'PENDENTE' && (
                  <div className="text-yellow-600">
                    <Clock className="w-16 h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-yellow-800">Aguardando Pagamento</h2>
                  </div>
                )}
                <p className="text-gray-600 mt-2">{mensagem}</p>
              </div>

              {/* Detalhes PIX */}
              {transacao.tipo === 'PIX' && transacao.status === 'APROVADO' && (
                <div className="space-y-4">
                  <div className="text-center">
                  {transacao.dados.qrCode && (
                    <div className="bg-gray-100 p-4 rounded-lg mb-4">
                      <Image
                        src={transacao.dados.qrCode}
                        alt="QR Code PIX"
                        width={200}
                        height={200}
                        className="mx-auto"
                      />
                    </div>
                  )}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={transacao.dados.codigoPIX}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <button
                        onClick={() => copiarTexto(transacao.dados.codigoPIX)}
                        className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Detalhes Cartão */}
              {transacao.tipo === 'CARTAO' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Bandeira:</span> {transacao.dados.bandeira}
                    </div>
                    <div>
                      <span className="font-medium">Final:</span> **** {transacao.dados.ultimosDigitos}
                    </div>
                    {transacao.dados.codigoAutorizacao && (
                      <>
                        <div>
                          <span className="font-medium">Autorização:</span> {transacao.dados.codigoAutorizacao}
                        </div>
                        <div>
                          <span className="font-medium">NSU:</span> {transacao.dados.nsu}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Detalhes Boleto */}
              {transacao.tipo === 'BOLETO' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-center">
                      <h3 className="font-bold mb-2">Linha Digitável</h3>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={transacao.dados.linhaDigitavel}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <button
                          onClick={() => copiarTexto(transacao.dados.linhaDigitavel)}
                          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Vencimento:</span><br />
                      {new Date(transacao.dados.dataVencimento).toLocaleDateString('pt-BR')}
                    </div>
                    <div>
                      <span className="font-medium">Valor:</span><br />
                      R$ {transacao.dados.valor.toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={gerarBoleto}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Baixar Boleto
                  </button>

                  {transacao.status === 'PENDENTE' && (
                    <button
                      onClick={consultarStatusTransacao}
                      className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                    >
                      Verificar Pagamento
                    </button>
                  )}
                </div>
              )}

              {transacao.status === 'APROVADO' && (
                <div className="mt-6 text-center">
                  <p className="text-green-600 mb-4">Redirecionando para seus pedidos em 5 segundos...</p>
                  <button
                    onClick={() => router.push(`/perfil/pedidos/${pedidoId}`)}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                  >
                    Ver Meu Pedido
                  </button>
                </div>
              )}

              {transacao.status === 'REJEITADO' && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setTransacao(null)}
                    className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                  >
                    Tentar Novamente
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainTemplate>
  );
}