'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Carrinho() {
  const [carrinho, setCarrinho] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Carregar carrinho do localStorage
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      setCarrinho(JSON.parse(carrinhoSalvo));
    }
    setLoading(false);
  }, []);

  const atualizarQuantidade = (produtoId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerItem(produtoId);
      return;
    }

    const novoCarrinho = carrinho.map(item => 
      item.id === produtoId 
        ? { ...item, quantidade: novaQuantidade, subtotal: item.preco * novaQuantidade }
        : item
    );
    
    setCarrinho(novoCarrinho);
    localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
  };

  const removerItem = (produtoId) => {
    const novoCarrinho = carrinho.filter(item => item.id !== produtoId);
    setCarrinho(novoCarrinho);
    localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
    setMensagem('Item removido do carrinho');
    setTimeout(() => setMensagem(''), 3000);
  };

  const limparCarrinho = () => {
    setCarrinho([]);
    localStorage.removeItem('carrinho');
    setMensagem('Carrinho limpo');
    setTimeout(() => setMensagem(''), 3000);
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + item.subtotal, 0);
  };

  const finalizarCompra = () => {
    if (carrinho.length === 0) {
      setMensagem('Carrinho vazio');
      return;
    }
    
    // Redirecionar para checkout
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando carrinho...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Inicio
              </Link>
              <span>›</span>
              <Link href="/produtos" className="text-blue-600 hover:text-blue-800">
                Produtos
              </Link>
              <span>›</span>
              <span className="text-gray-500">Carrinho</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/perfil"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Meu Perfil
              </Link>
              <Link
                href="/admin"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Titulo */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold">Meu Carrinho</h1>
            <p className="text-blue-100">
              {carrinho.length} {carrinho.length === 1 ? 'item' : 'itens'} no carrinho
            </p>
          </div>

          {/* Mensagem */}
          {mensagem && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <p className="text-green-700">{mensagem}</p>
            </div>
          )}

          {carrinho.length === 0 ? (
            /* Carrinho Vazio */
            <div className="p-8 text-center">
              <div className="mb-6">
                <svg className="mx-auto h-24 w-24 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zM8 6V4a2 2 0 114 0v2H8zm1 5a1 1 0 112 0v1a1 1 0 11-2 0v-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Seu carrinho esta vazio
              </h3>
              <p className="text-gray-500 mb-6">
                Adicione alguns produtos incriveis a sua colecao!
              </p>
              <Link
                href="/produtos"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition"
              >
                Explorar Produtos
              </Link>
            </div>
          ) : (
            /* Lista de Itens */
            <div className="p-6">
              <div className="space-y-4">
                {carrinho.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                    {/* Imagem */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.imagemUrl ? (
                        <Image
                          src={item.imagemUrl}
                          alt={item.nome}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/images/placeholder.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Detalhes */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        <Link
                          href={`/produtos/${item.id}`}
                          className="hover:text-blue-600"
                        >
                          {item.nome}
                        </Link>
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {item.liga?.sigla}
                        </span>
                        {item.time && (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {item.time.nome}
                          </span>
                        )}
                        <span>Cor: {item.cor?.nome}</span>
                        <span>Tamanho: {item.tamanho?.nome}</span>
                      </div>
                    </div>

                    {/* Quantidade */}
                    <div className="flex items-center border rounded">
                      <button
                        type="button"
                        className="px-3 py-1 hover:bg-gray-100"
                        onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 min-w-[60px] text-center">
                        {item.quantidade}
                      </span>
                      <button
                        type="button"
                        className="px-3 py-1 hover:bg-gray-100"
                        onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* Preco */}
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        R$ {item.subtotal.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        R$ {item.preco.toFixed(2)} cada
                      </div>
                    </div>

                    {/* Remover */}
                    <button
                      onClick={() => removerItem(item.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Remover item"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 112 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 112 0v3a1 1 0 11-2 0V9z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Resumo */}
              <div className="mt-8 border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-semibold text-gray-900">
                    Total: R$ {calcularTotal().toFixed(2)}
                  </div>
                  <button
                    onClick={limparCarrinho}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Limpar Carrinho
                  </button>
                </div>

                <div className="flex space-x-4">
                  <Link
                    href="/produtos"
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 font-semibold text-center transition"
                  >
                    Continuar Comprando
                  </Link>
                  <button
                    onClick={finalizarCompra}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-semibold transition"
                  >
                    Finalizar Compra
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}