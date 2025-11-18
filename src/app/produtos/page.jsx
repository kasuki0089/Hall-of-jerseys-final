'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    liga: '',
    time: '',
    busca: '',
    precoMin: '',
    precoMax: ''
  });
  const [paginacao, setPaginacao] = useState({ pagina: 1, totalPaginas: 1 });

  useEffect(() => {
    carregarProdutos();
  }, [filtros, paginacao.pagina]);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filtros.liga) queryParams.append('liga', filtros.liga);
      if (filtros.time) queryParams.append('time', filtros.time);
      if (filtros.busca) queryParams.append('busca', filtros.busca);
      if (filtros.precoMin) queryParams.append('precoMin', filtros.precoMin);
      if (filtros.precoMax) queryParams.append('precoMax', filtros.precoMax);
      queryParams.append('pagina', paginacao.pagina);
      queryParams.append('limite', '12');

      const res = await fetch(`/api/produtos?${queryParams}`);
      const data = await res.json();
      
      setProdutos(data.produtos || []);
      setPaginacao(prev => ({ 
        ...prev, 
        totalPaginas: data.paginacao?.totalPaginas || 1 
      }));
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrar = () => {
    setPaginacao(prev => ({ ...prev, pagina: 1 }));
    carregarProdutos();
  };

  const limparFiltros = () => {
    setFiltros({ liga: '', time: '', busca: '', precoMin: '', precoMax: '' });
    setPaginacao(prev => ({ ...prev, pagina: 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hall of Jerseys</h1>
          <p className="text-xl">As melhores camisas de NBA, NFL e MLB</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Buscar produto..."
              value={filtros.busca}
              onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <select
              value={filtros.liga}
              onChange={(e) => setFiltros({ ...filtros, liga: e.target.value })}
              className="border rounded px-3 py-2"
            >
              <option value="">Todas as Ligas</option>
              <option value="NBA">NBA</option>
              <option value="NFL">NFL</option>
              <option value="MLB">MLB</option>
            </select>
            <input
              type="number"
              placeholder="Preço mín"
              value={filtros.precoMin}
              onChange={(e) => setFiltros({ ...filtros, precoMin: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Preço máx"
              value={filtros.precoMax}
              onChange={(e) => setFiltros({ ...filtros, precoMax: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <div className="flex gap-2">
              <button
                onClick={handleFiltrar}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1"
              >
                Filtrar
              </button>
              <button
                onClick={limparFiltros}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando produtos...</p>
          </div>
        )}

        {/* Grid de Produtos */}
        {!loading && produtos.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {produtos.map((produto) => (
                <Link 
                  href={`/produtos/${produto.id}`} 
                  key={produto.id}
                  className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow overflow-hidden group"
                >
                  <div className="relative h-64 bg-gray-200 overflow-hidden">
                    {produto.imagemUrl ? (
                      <img
                        src={produto.imagemUrl}
                        alt={produto.nome}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      {produto.liga}
                    </div>
                    {produto.estoque <= 5 && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        Últimas unidades!
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-gray-900 line-clamp-2 group-hover:text-blue-600">
                      {produto.nome}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{produto.time}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        R$ {produto.preco.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Tam. {produto.tamanho}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <span className={produto.estoque > 0 ? 'text-green-600' : 'text-red-600'}>
                        {produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Esgotado'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Paginação */}
            {paginacao.totalPaginas > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPaginacao(prev => ({ ...prev, pagina: Math.max(1, prev.pagina - 1) }))}
                  disabled={paginacao.pagina === 1}
                  className="px-4 py-2 bg-white border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 bg-blue-600 text-white rounded">
                  {paginacao.pagina} / {paginacao.totalPaginas}
                </span>
                <button
                  onClick={() => setPaginacao(prev => ({ ...prev, pagina: Math.min(paginacao.totalPaginas, prev.pagina + 1) }))}
                  disabled={paginacao.pagina === paginacao.totalPaginas}
                  className="px-4 py-2 bg-white border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}

        {/* Sem Resultados */}
        {!loading && produtos.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-600 mb-4">Tente ajustar os filtros ou limpe-os para ver todos os produtos</p>
            <button
              onClick={limparFiltros}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
