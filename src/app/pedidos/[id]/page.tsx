'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import MainTemplate from '@/templates/MainTemplate/Index';
import StatusPedido from '@/components/StatusPedido/Index';
import Image from 'next/image';
import { Calendar, MapPin, CreditCard, Package, Download } from 'lucide-react';

interface PedidoItem {
  id: number;
  quantidade: number;
  preco: string;
  produto: {
    nome: string;
    imagemUrl?: string;
    time?: string;
    liga?: string;
  };
  tamanho?: {
    nome: string;
  };
}

interface Pedido {
  id: number;
  status: string;
  criadoEm: string;
  total: string;
  valorTotal?: number;
  valorFrete?: number;
  enderecoEntrega?: string;
  formaPagamento?: {
    tipo: string;
  };
  itens: PedidoItem[];
}

export default function PedidoDetalhePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const pedidoId = params.id;

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    
    if (pedidoId) {
      carregarPedido();
    }
  }, [session, pedidoId]);

  const carregarPedido = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pedidos/${pedidoId}`);
      const result = await response.json();

      if (result.success) {
        setPedido(result.pedido);
      } else {
        setError(result.error || 'Erro ao carregar pedido');
      }
    } catch (error) {
      console.error('Erro ao carregar pedido:', error);
      setError('Erro ao conectar com servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (novoStatus: string) => {
    if (pedido) {
      setPedido(prev => prev ? { ...prev, status: novoStatus } : null);
    }
  };

  const gerarNotaFiscal = () => {
    if (!pedido) return;
    
    const notaHTML = `
      <html>
        <head><title>Nota Fiscal - Pedido #${pedido.id}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px;">
            <h1>HALL OF JERSEYS</h1>
            <p>CNPJ: 12.345.678/0001-99</p>
            <p>Rua das Camisetas, 123 - São Paulo/SP</p>
            <h2>NOTA FISCAL ELETRÔNICA</h2>
            <p>Série: 001 | Número: ${String(pedido.id).padStart(6, '0')}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3>DADOS DO CLIENTE</h3>
            <p><strong>Nome:</strong> ${session?.user?.name || 'Cliente'}</p>
            <p><strong>Email:</strong> ${session?.user?.email || 'email@cliente.com'}</p>
            <p><strong>Endereço:</strong> ${pedido.enderecoEntrega}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3>PRODUTOS</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f0f0f0;">
                  <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Produto</th>
                  <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Qtd</th>
                  <th style="border: 1px solid #ccc; padding: 8px; text-align: right;">Valor Unit.</th>
                  <th style="border: 1px solid #ccc; padding: 8px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${pedido.itens.map(item => `
                  <tr>
                    <td style="border: 1px solid #ccc; padding: 8px;">${item.produto.nome}</td>
                    <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${item.quantidade}</td>
                    <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">R$ ${parseFloat(item.preco).toFixed(2)}</td>
                    <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">R$ ${(item.quantidade * parseFloat(item.preco)).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div style="text-align: right; margin-top: 20px; border-top: 2px solid #000; padding-top: 15px;">
            <p><strong>Subtotal: R$ ${((pedido.valorTotal || 0) - (pedido.valorFrete || 0)).toFixed(2)}</strong></p>
            ${pedido.valorFrete ? `<p><strong>Frete: R$ ${pedido.valorFrete.toFixed(2)}</strong></p>` : ''}
            <p style="font-size: 20px;"><strong>TOTAL: R$ ${(pedido.valorTotal || 0).toFixed(2)}</strong></p>
          </div>
          
          <div style="margin-top: 30px; text-align: center; color: #666;">
            <p>Nota fiscal emitida em ${new Date().toLocaleString('pt-BR')}</p>
            <p>Esta é uma simulação para fins acadêmicos</p>
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([notaHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nota-fiscal-${pedido.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!session) {
    return <MainTemplate><div>Carregando...</div></MainTemplate>;
  }

  if (loading) {
    return (
      <MainTemplate>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Carregando pedido...</p>
          </div>
        </div>
      </MainTemplate>
    );
  }

  if (error || !pedido) {
    return (
      <MainTemplate>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Erro</h1>
            <p className="text-gray-600">{error || 'Pedido não encontrado'}</p>
            <button
              onClick={() => router.push('/pedidos')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Voltar aos Pedidos
            </button>
          </div>
        </div>
      </MainTemplate>
    );
  }

  return (
    <MainTemplate>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">Pedido #{pedido.id}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Pedido realizado em {new Date(pedido.criadoEm).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    <span>{pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  R$ {(pedido.valorTotal || 0).toFixed(2)}
                </div>
                <button
                  onClick={gerarNotaFiscal}
                  className="mt-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Nota Fiscal
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status do Pedido */}
              <StatusPedido 
                pedidoId={pedido.id} 
                statusAtual={pedido.status} 
                onStatusChange={handleStatusChange}
              />

              {/* Itens do Pedido */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Itens do Pedido</h2>
                <div className="space-y-4">
                  {pedido.itens.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        {item.produto.imagemUrl ? (
                          <Image
                            src={item.produto.imagemUrl}
                            alt={item.produto.nome}
                            width={64}
                            height={64}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.produto.nome}</h3>
                        <div className="text-sm text-gray-600">
                          {item.produto.time} • {item.produto.liga}
                        </div>
                        {item.tamanho && (
                          <div className="text-sm text-gray-600">
                            Tamanho: {item.tamanho.nome}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {item.quantidade}x R$ {parseFloat(item.preco).toFixed(2)}
                        </div>
                        <div className="text-lg font-bold">
                          R$ {(item.quantidade * parseFloat(item.preco)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Resumo do Pedido */}
                <div className="mt-6 pt-6 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>R$ {((pedido.valorTotal || 0) - (pedido.valorFrete || 0)).toFixed(2)}</span>
                    </div>
                    {(pedido.valorFrete || 0) > 0 && (
                      <div className="flex justify-between">
                        <span>Frete:</span>
                        <span>R$ {(pedido.valorFrete || 0).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>R$ {(pedido.valorTotal || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Informações de Entrega */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Endereço de Entrega
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>{session?.user?.name || 'Cliente'}</div>
                  <div>{pedido.enderecoEntrega}</div>
                </div>
              </div>

              {/* Informações de Pagamento */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Forma de Pagamento
                </h3>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    {pedido.formaPagamento?.tipo === 'pix' && <span>📱 PIX</span>}
                    {pedido.formaPagamento?.tipo === 'cartao' && <span>💳 Cartão de Crédito</span>}
                    {pedido.formaPagamento?.tipo === 'boleto' && <span>🧾 Boleto Bancário</span>}
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">Ações</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/pedidos')}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                  >
                    Meus Pedidos
                  </button>
                  <button
                    onClick={() => router.push('/produtos')}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    Continuar Comprando
                  </button>
                  {(pedido.status === 'ENTREGUE') && (
                    <button className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
                      Avaliar Produtos
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}