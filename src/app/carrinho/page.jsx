'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MainTemplate from '@/templates/MainTemplate/Index';
import { notifications } from '@/components/Toast';

export default function Carrinho() {
  const { data: session } = useSession();
  const [carrinho, setCarrinho] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [atualizando, setAtualizando] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      carregarCarrinho();
    } else {
      setLoading(false);
    }
  }, [session]);

  const carregarCarrinho = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/carrinho');
      const data = await response.json();
      
      if (data.success) {
        setCarrinho(data.itens);
      } else {
        console.error('Erro ao carregar carrinho:', data.error);
        if (data.error === 'Não autorizado') {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarQuantidade = async (itemId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerItem(itemId);
      return;
    }

    try {
      setAtualizando(true);
      const response = await fetch('/api/carrinho', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: itemId,
          quantidade: novaQuantidade,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        carregarCarrinho(); // Recarregar carrinho atualizado
        setMensagem('Quantidade atualizada!');
        setTimeout(() => setMensagem(''), 3000);
      } else {
        notifications.error('Erro ao atualizar quantidade: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      notifications.error('Erro ao atualizar quantidade');
    } finally {
      setAtualizando(false);
    }
  };

  const removerItem = async (itemId) => {
    try {
      setAtualizando(true);
      const response = await fetch(`/api/carrinho?itemId=${itemId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        carregarCarrinho(); // Recarregar carrinho
        setMensagem('Item removido do carrinho');
        setTimeout(() => setMensagem(''), 3000);
      } else {
        notifications.error('Erro ao remover item: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao remover item:', error);
      notifications.error('Erro ao remover item');
    } finally {
      setAtualizando(false);
    }
  };

  const limparCarrinho = async () => {
    if (!confirm('Tem certeza que deseja limpar todo o carrinho?')) {
      return;
    }

    try {
      setAtualizando(true);
      const response = await fetch('/api/carrinho?limpar=true', {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        setCarrinho([]);
        setMensagem('Carrinho limpo com sucesso');
        setTimeout(() => setMensagem(''), 3000);
      } else {
        notifications.error('Erro ao limpar carrinho: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      notifications.error('Erro ao limpar carrinho');
    } finally {
      setAtualizando(false);
    }
  };

  const calcularTotal = () => {
    return carrinho.reduce((acc, item) => 
      acc + (parseFloat(item.produto.preco) * item.quantidade), 0
    );
  };

  const finalizarCompra = () => {
    if (carrinho.length === 0) {
      notifications.warning('Seu carrinho está vazio!');
      return;
    }
    router.push('/checkout');
  };

  if (!session) {
    return (
      <MainTemplate>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Acesse sua conta</h1>
            <p className="text-gray-600 mb-4">Você precisa estar logado para ver seu carrinho.</p>
            <Link 
              href="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              Fazer Login
            </Link>
          </div>
        </div>
      </MainTemplate>
    );
  }

  if (loading) {
    return (
      <MainTemplate>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </MainTemplate>
    );
  }

  return (
    <MainTemplate>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Meu Carrinho</h1>
        
        {mensagem && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {mensagem}
          </div>
        )}

        {carrinho.length === 0 ? (
          <div className="text-center py-8">
            <h2 className="text-xl text-gray-600 mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-500 mb-6">Que tal adicionar alguns produtos incríveis?</p>
            <Link 
              href="/produtos"
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              Ver Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Itens do Carrinho */}
            <div className="lg:col-span-2 space-y-6">
              {carrinho.map((item) => (
                <div key={`${item.produtoId}-${item.tamanhoId || 'default'}`} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex gap-4">
                    {/* Imagem do Produto */}
                    <div className="w-24 h-24 relative flex-shrink-0">
                      <Image
                        src={item.produto.imagemUrl || '/images/produto-placeholder.jpg'}
                        alt={item.produto.nome}
                        fill
                        className="object-cover rounded"
                      />
                    </div>

                    {/* Informações do Produto */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{item.produto.nome}</h3>
                      <p className="text-gray-600 mb-1">
                        {item.produto.time?.nome} - {item.produto.liga?.sigla}
                      </p>
                      {item.produto.cor && (
                        <p className="text-gray-600 mb-1">Cor: {item.produto.cor.nome}</p>
                      )}
                      {item.produto.tamanho && (
                        <p className="text-gray-600 mb-1">Tamanho: {item.produto.tamanho.nome}</p>
                      )}
                      <p className="text-xl font-bold text-blue-600">
                        R$ {parseFloat(item.produto.preco).toFixed(2)}
                      </p>
                    </div>

                    {/* Controles */}
                    <div className="flex flex-col items-end gap-3">
                      {/* Quantidade */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                          disabled={atualizando}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantidade}</span>
                        <button
                          onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                          disabled={atualizando}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <p className="text-lg font-semibold">
                        R$ {(parseFloat(item.produto.preco) * item.quantidade).toFixed(2)}
                      </p>

                      {/* Remover */}
                      <button
                        onClick={() => removerItem(item.id)}
                        disabled={atualizando}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Ações do Carrinho */}
              <div className="flex gap-4">
                <button
                  onClick={limparCarrinho}
                  disabled={atualizando}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  Limpar Carrinho
                </button>
                <Link 
                  href="/produtos"
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Continuar Comprando
                </Link>
              </div>
            </div>

            {/* Resumo do Carrinho */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {calcularTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frete:</span>
                    <span className="text-green-600">A calcular</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>R$ {calcularTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={finalizarCompra}
                  disabled={atualizando || carrinho.length === 0}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Finalizar Compra
                </button>

                <div className="mt-4 text-sm text-gray-600 text-center">
                  <p>✅ Compra 100% segura</p>
                  <p>🚚 Entrega em todo o Brasil</p>
                  <p>💳 Parcelamento em até 12x</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainTemplate>
  );
}