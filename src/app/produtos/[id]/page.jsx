'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MainTemplate from '../../../../templates/MainTemplate';

export default function ProdutoDetalhes() {
  const params = useParams();
  const router = useRouter();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    carregarProduto();
  }, [params.id]);

  const carregarProduto = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/produtos/${params.id}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          alert('Produto não encontrado');
          router.push('/produtos');
          return;
        }
        throw new Error('Erro ao carregar produto');
      }

      const data = await res.json();
      setProduto(data);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      alert('Erro ao carregar produto');
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionarCarrinho = () => {
    // TODO: Implementar lógica do carrinho
    alert(`Adicionado ao carrinho: ${quantidade}x ${produto.nome}`);
  };

  if (loading) {
    return (
      <MainTemplate>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando produto...</p>
          </div>
        </div>
      </MainTemplate>
    );
  }

  if (!produto) {
    return (
      <MainTemplate>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h2>
            <Link href="/produtos" className="text-blue-600 hover:underline">
              Voltar para produtos
            </Link>
          </div>
        </div>
      </MainTemplate>
    );
  }

  return (
    <MainTemplate>
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-blue-600 hover:underline">Home</Link>
          {' / '}
          <Link href="/produtos" className="text-blue-600 hover:underline">Produtos</Link>
          {' / '}
          <span className="text-gray-600">{produto.nome}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Imagem */}
            <div className="relative">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                {produto.imagemUrl ? (
                  <img
                    src={produto.imagemUrl}
                    alt={produto.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {produto.liga}
                </span>
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {produto.categoria}
                </span>
              </div>

              {produto.estoque <= 5 && produto.estoque > 0 && (
                <div className="absolute top-4 right-4">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Últimas unidades!
                  </span>
                </div>
              )}
            </div>

            {/* Informações */}
            <div className="flex flex-col">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{produto.nome}</h1>
                <p className="text-lg text-gray-600">{produto.time}</p>
              </div>

              {/* Preço */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">
                  R$ {produto.preco.toFixed(2)}
                </span>
              </div>

              {/* Descrição */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h2>
                <p className="text-gray-700 leading-relaxed">{produto.descricao}</p>
              </div>

              {/* Detalhes */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <span className="text-sm text-gray-600">Tamanho</span>
                  <p className="text-lg font-semibold text-gray-900">{produto.tamanho}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <span className="text-sm text-gray-600">Estoque</span>
                  <p className={`text-lg font-semibold ${produto.estoque > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {produto.estoque > 0 ? `${produto.estoque} disponíveis` : 'Esgotado'}
                  </p>
                </div>
                {produto.sku && (
                  <div className="border rounded-lg p-4 col-span-2">
                    <span className="text-sm text-gray-600">SKU</span>
                    <p className="text-lg font-semibold text-gray-900">{produto.sku}</p>
                  </div>
                )}
              </div>

              {/* Quantidade e Adicionar ao Carrinho */}
              {produto.estoque > 0 ? (
                <div className="mt-auto">
                  <div className="flex items-center gap-4 mb-4">
                    <label className="text-sm font-semibold text-gray-900">Quantidade:</label>
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-6 py-2 border-x">{quantidade}</span>
                      <button
                        onClick={() => setQuantidade(Math.min(produto.estoque, quantidade + 1))}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAdicionarCarrinho}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
              ) : (
                <div className="mt-auto">
                  <button
                    disabled
                    className="w-full bg-gray-400 text-white py-4 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Produto Esgotado
                  </button>
                </div>
              )}

              {/* Informações Adicionais */}
              <div className="mt-6 border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Informações Adicionais</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Produto oficial licenciado
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Tecido respirável de alta qualidade
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Frete grátis acima de R$ 299
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Botão Voltar */}
        <div className="mt-6">
          <Link 
            href="/produtos" 
            className="inline-flex items-center text-blue-600 hover:underline"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para produtos
          </Link>
        </div>
      </div>
    </MainTemplate>
  );
}
