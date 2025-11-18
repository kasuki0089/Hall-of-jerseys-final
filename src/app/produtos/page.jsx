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

      const response = await fetch(`/api/produtos?${queryParams}`);
      const data = await response.json();
      
      setProdutos(data.produtos || []);
      setPaginacao(prev => ({
        ...prev,
        totalPaginas: data.paginacao?.totalPaginas || 1
      }));
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPaginacao(prev => ({ ...prev, pagina: 1 }));
  };

  const limparFiltros = () => {
    setFiltros({
      liga: '',
      time: '',
      busca: '',
      precoMin: '',
      precoMax: ''
    });
    setPaginacao(prev => ({ ...prev, pagina: 1 }));
  };

  const trocarPagina = (novaPagina) => {
    setPaginacao(prev => ({ ...prev, pagina: novaPagina }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Produtos</h1>

      {/* Filtros */}
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Nome do produto..."
              value={filtros.busca}
              onChange={(e) => handleFiltroChange('busca', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Liga</label>
            <select
              value={filtros.liga}
              onChange={(e) => handleFiltroChange('liga', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as ligas</option>
              <option value="NBA">NBA</option>
              <option value="NFL">NFL</option>
              <option value="MLB">MLB</option>
              <option value="NHL">NHL</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Time</label>
            <input
              type="text"
              placeholder="Nome do time..."
              value={filtros.time}
              onChange={(e) => handleFiltroChange('time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Preço Mín.</label>
            <input
              type="number"
              placeholder="R$ 0,00"
              value={filtros.precoMin}
              onChange={(e) => handleFiltroChange('precoMin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Preço Máx.</label>
            <input
              type="number"
              placeholder="R$ 999,99"
              value={filtros.precoMax}
              onChange={(e) => handleFiltroChange('precoMax', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={limparFiltros}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Carregando produtos...</p>
        </div>
      )}

      {/* Lista de Produtos */}
      {!loading && (
        <div>
          {produtos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">Nenhum produto encontrado.</p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {produtos.map((produto) => (
                  <div key={produto.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {produto.imagemUrl && (
                      <img
                        src={produto.imagemUrl}
                        alt={produto.nome}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{produto.nome}</h3>
                      <p className="text-sm text-gray-600 mb-2">{produto.liga} - {produto.time}</p>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{produto.descricao}</p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xl font-bold text-green-600">
                          R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-sm text-gray-500">
                          Estoque: {produto.estoque}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/produtos/${produto.id}`}
                          className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                        >
                          Ver Detalhes
                        </Link>
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
  );
}