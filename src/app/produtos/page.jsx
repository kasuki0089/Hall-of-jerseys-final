'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainTemplate from '../../templates/MainTemplate';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    categoria: '',
    busca: '',
    sale: false
  });
  const [paginacao, setPaginacao] = useState({ pagina: 1, totalPaginas: 1 });

  useEffect(() => {
    carregarProdutos();
  }, [filtros, paginacao.pagina]);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filtros.categoria) queryParams.append('categoria', filtros.categoria);
      if (filtros.busca) queryParams.append('busca', filtros.busca);
      if (filtros.sale) queryParams.append('sale', 'true');
      queryParams.append('pagina', paginacao.pagina.toString());
      queryParams.append('limite', '12');

      const response = await fetch(`/api/produtos?${queryParams}`);
      const data = await response.json();
      
      if (response.ok) {
        setProdutos(data.produtos);
        setPaginacao({
          pagina: data.paginacao.paginaAtual,
          totalPaginas: data.paginacao.totalPaginas
        });
      } else {
        console.error('Erro ao carregar produtos:', data.error);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPaginacao(prev => ({ ...prev, pagina: 1 }));
  };

  const trocarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= paginacao.totalPaginas) {
      setPaginacao(prev => ({ ...prev, pagina: novaPagina }));
    }
  };

  const formatarPreco = (preco) => {
    return `R$ ${(preco / 100).toFixed(2).replace('.', ',')}`;
  };

  return (
    <MainTemplate>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Produtos</h1>

          {/* Filtros */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Filtros</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Buscar</label>
                <input
                  type="text"
                  value={filtros.busca}
                  onChange={(e) => handleFiltroChange('busca', e.target.value)}
                  placeholder="Nome do produto..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <select
                  value={filtros.categoria}
                  onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas as categorias</option>
                  <option value="JERSEY">Jersey</option>
                  <option value="CAMISA">Camisa</option>
                  <option value="REGATA">Regata</option>
                  <option value="CAMISA_MANGA_LONGA">Camisa Manga Longa</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filtros.sale}
                    onChange={(e) => handleFiltroChange('sale', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Apenas em promoção</span>
                </label>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Carregando produtos...</p>
              </div>
            </div>
          ) : (
            <div>
              {/* Lista de Produtos */}
              {produtos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">Nenhum produto encontrado.</p>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {produtos.map((produto) => (
                      <div key={produto.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">Sem imagem</span>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                            {produto.nome}
                          </h3>
                          {produto.liga && (
                            <p className="text-sm text-blue-600 mb-1">
                              {produto.liga.nome} - {produto.time?.nome}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{produto.descricao}</p>
                          
                          <div className="flex justify-between items-center mb-3">
                            <span className={`text-xl font-bold ${produto.sale ? 'text-red-600' : 'text-green-600'}`}>
                              {formatarPreco(produto.preco)}
                              {produto.sale && (
                                <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                  PROMOÇÃO
                                </span>
                              )}
                            </span>
                            {produto.tamanho && (
                              <span className="text-sm text-gray-500">
                                Tamanho: {produto.tamanho}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Link 
                              href={`/produtos/${produto.id}`}
                              className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm"
                            >
                              Ver Detalhes
                            </Link>
                            <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors text-sm">
                              Carrinho
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Paginação */}
                  {paginacao.totalPaginas > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => trocarPagina(paginacao.pagina - 1)}
                        disabled={paginacao.pagina === 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      
                      <span className="mx-4 text-gray-600">
                        Página {paginacao.pagina} de {paginacao.totalPaginas}
                      </span>
                      
                      <button
                        onClick={() => trocarPagina(paginacao.pagina + 1)}
                        disabled={paginacao.pagina === paginacao.totalPaginas}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Próxima
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainTemplate>
  );
}