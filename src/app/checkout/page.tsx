'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MainTemplate from '@/templates/MainTemplate/Index';
import Image from 'next/image';

interface CarrinhoItem {
  id: number;
  quantidade: number;
  produtoId: number;
  tamanhoId?: number;
  produto: {
    id: number;
    nome: string;
    preco: string;
    imagemUrl?: string;
    time?: {
      nome: string;
    };
    liga?: {
      sigla: string;
    };
    tamanho?: {
      nome: string;
    };
  };
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [endereco, setEndereco] = useState({
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });
  const [pagamento, setPagamento] = useState({
    tipo: 'cartao',
    numero: '',
    nome: '',
    validade: '',
    cvv: '',
  });

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    carregarCarrinho();
  }, [session]);

  const carregarCarrinho = async () => {
    try {
      const response = await fetch('/api/carrinho');
      const data = await response.json();
      
      if (data.success) {
        setCarrinho(data.itens);
      } else {
        console.error('Erro ao carregar carrinho:', data.error);
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularTotal = () => {
    return carrinho.reduce((acc, item) => 
      acc + (parseFloat(item.produto.preco) * item.quantidade), 0
    );
  };

  const finalizarPedido = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessando(true);

    try {
      // Validação básica
      if (!endereco.cep || !endereco.rua || !endereco.numero || !endereco.cidade) {
        alert('Por favor, preencha todos os campos obrigatórios do endereço.');
        setProcessando(false);
        return;
      }

      if (pagamento.tipo === 'cartao' && (!pagamento.numero || !pagamento.nome || !pagamento.validade || !pagamento.cvv)) {
        alert('Por favor, preencha todos os dados do cartão.');
        setProcessando(false);
        return;
      }

      const pedidoData = {
        itens: carrinho.map(item => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          preco: item.produto.preco,
          tamanhoId: item.tamanhoId
        })),
        endereco,
        formaPagamento: pagamento.tipo,
        total: calcularTotal()
      };

      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoData),
      });

      const result = await response.json();

      if (result.success) {
        // Limpar carrinho
        await fetch('/api/carrinho?limpar=true', { method: 'DELETE' });
        
        // Redirecionar para página de pagamento
        const valorTotal = calcularTotal();
        router.push(`/pagamento?pedido=${result.pedido.id}&valor=${valorTotal}`);
      } else {
        alert('Erro ao finalizar pedido: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      alert('Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setProcessando(false);
    }
  };

  const buscarCEP = async (cep: string) => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setEndereco(prev => ({
            ...prev,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  if (loading) {
    return (
      <MainTemplate>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </MainTemplate>
    );
  }

  if (!carrinho.length) {
    return (
      <MainTemplate>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
            <p className="text-gray-600 mb-4">Adicione produtos ao carrinho antes de finalizar o pedido.</p>
            <button 
              onClick={() => router.push('/produtos')}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              Ver Produtos
            </button>
          </div>
        </div>
      </MainTemplate>
    );
  }

  return (
    <MainTemplate>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Pedido</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de Dados */}
          <div className="space-y-8">
            {/* Endereço de Entrega */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Endereço de Entrega</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">CEP*</label>
                  <input
                    type="text"
                    value={endereco.cep}
                    onChange={(e) => {
                      const cep = e.target.value.replace(/\D/g, '');
                      setEndereco(prev => ({ ...prev, cep }));
                      buscarCEP(cep);
                    }}
                    placeholder="00000000"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    maxLength={8}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rua*</label>
                  <input
                    type="text"
                    value={endereco.rua}
                    onChange={(e) => setEndereco(prev => ({ ...prev, rua: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Número*</label>
                  <input
                    type="text"
                    value={endereco.numero}
                    onChange={(e) => setEndereco(prev => ({ ...prev, numero: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Complemento</label>
                  <input
                    type="text"
                    value={endereco.complemento}
                    onChange={(e) => setEndereco(prev => ({ ...prev, complemento: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bairro*</label>
                  <input
                    type="text"
                    value={endereco.bairro}
                    onChange={(e) => setEndereco(prev => ({ ...prev, bairro: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cidade*</label>
                  <input
                    type="text"
                    value={endereco.cidade}
                    onChange={(e) => setEndereco(prev => ({ ...prev, cidade: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado*</label>
                  <input
                    type="text"
                    value={endereco.estado}
                    onChange={(e) => setEndereco(prev => ({ ...prev, estado: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>

            {/* Forma de Pagamento */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Forma de Pagamento</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo de Pagamento</label>
                  <select
                    value={pagamento.tipo}
                    onChange={(e) => setPagamento(prev => ({ ...prev, tipo: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="cartao">Cartão de Crédito</option>
                    <option value="pix">PIX</option>
                    <option value="boleto">Boleto Bancário</option>
                  </select>
                </div>

                {pagamento.tipo === 'cartao' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Número do Cartão</label>
                      <input
                        type="text"
                        value={pagamento.numero}
                        onChange={(e) => setPagamento(prev => ({ ...prev, numero: e.target.value }))}
                        placeholder="0000 0000 0000 0000"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Nome no Cartão</label>
                      <input
                        type="text"
                        value={pagamento.nome}
                        onChange={(e) => setPagamento(prev => ({ ...prev, nome: e.target.value }))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Validade</label>
                      <input
                        type="text"
                        value={pagamento.validade}
                        onChange={(e) => setPagamento(prev => ({ ...prev, validade: e.target.value }))}
                        placeholder="MM/AA"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CVV</label>
                      <input
                        type="text"
                        value={pagamento.cvv}
                        onChange={(e) => setPagamento(prev => ({ ...prev, cvv: e.target.value }))}
                        placeholder="000"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        maxLength={4}
                      />
                    </div>
                  </div>
                )}

                {pagamento.tipo === 'pix' && (
                  <div className="p-4 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      Após finalizar o pedido, você receberá o código PIX para pagamento.
                    </p>
                  </div>
                )}

                {pagamento.tipo === 'boleto' && (
                  <div className="p-4 bg-yellow-50 rounded-md">
                    <p className="text-sm text-yellow-800">
                      O boleto bancário será gerado após a confirmação do pedido.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
            
            <div className="space-y-4 mb-6">
              {carrinho.map((item) => (
                <div key={`${item.produtoId}-${item.tamanhoId}`} className="flex gap-4">
                  <div className="w-16 h-16 relative">
                    <Image
                      src={item.produto.imagemUrl || '/images/produto-placeholder.jpg'}
                      alt={item.produto.nome}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.produto.nome}</h3>
                    <p className="text-sm text-gray-600">
                      {item.produto.time?.nome} - {item.produto.liga?.sigla}
                    </p>
                    {item.produto.tamanho && (
                      <p className="text-sm text-gray-600">
                        Tamanho: {item.produto.tamanho.nome}
                      </p>
                    )}
                    <p className="text-sm">
                      Qtd: {item.quantidade} × R$ {parseFloat(item.produto.preco).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      R$ {(parseFloat(item.produto.preco) * item.quantidade).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>R$ {calcularTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={finalizarPedido}
              disabled={processando}
              className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processando ? 'Processando...' : 'Finalizar Pedido'}
            </button>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}