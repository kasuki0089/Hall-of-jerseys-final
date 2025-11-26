'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminProdutos() {
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);
  const [filtros, setFiltros] = useState({ liga: '', time: '', busca: '' });
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [criando, setCriando] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    estoque: '',
    liga: 'NBA',
    time: '',
    tamanho: 'M',
    categoria: 'Jersey',
    imagemUrl: '',
    sku: '',
    ativo: true
  });

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filtros.liga) queryParams.append('liga', filtros.liga);
      if (filtros.time) queryParams.append('time', filtros.time);
      if (filtros.busca) queryParams.append('busca', filtros.busca);
      queryParams.append('ativo', 'false'); // Mostrar todos no admin

      const res = await fetch(`/api/produtos?${queryParams}`);
      const data = await res.json();
      setProdutos(data.produtos || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      alert('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editando ? `/api/produtos/${editando}` : '/api/produtos';
      const method = editando ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          preco: parseFloat(formData.preco),
          estoque: parseInt(formData.estoque)
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao salvar produto');
      }

      alert(editando ? 'Produto atualizado!' : 'Produto criado!');
      setEditando(null);
      setCriando(false);
      resetForm();
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert(error.message);
    }
  };

  const handleEditar = (produto) => {
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      estoque: produto.estoque,
      liga: produto.liga,
      time: produto.time,
      tamanho: produto.tamanho,
      categoria: produto.categoria,
      imagemUrl: produto.imagemUrl || '',
      sku: produto.sku || '',
      ativo: produto.ativo
    });
    setEditando(produto.id);
    setCriando(false);
  };

  const handleDeletar = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;

    try {
      const res = await fetch(`/api/produtos/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao deletar produto');
      }
      alert('Produto deletado!');
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert(error.message);
    }
  };

  const handleToggleAtivo = async (produto) => {
    try {
      const res = await fetch(`/api/produtos/${produto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: !produto.ativo })
      });

      if (!res.ok) throw new Error('Erro ao atualizar status');
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do produto');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      estoque: '',
      liga: 'NBA',
      time: '',
      tamanho: 'M',
      categoria: 'Jersey',
      imagemUrl: '',
      sku: '',
      ativo: true
    });
  };

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  if (session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Produtos</h1>
          <button
            onClick={() => { setCriando(true); setEditando(null); resetForm(); }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            + Novo Produto
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Buscar por nome, time..."
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
            <button
              onClick={carregarProdutos}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Filtrar
            </button>
          </div>
        </div>

        {/* Formulário */}
        {(criando || editando) && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editando ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome do Produto *"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Time *"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                className="border rounded px-3 py-2"
              />
              <textarea
                placeholder="Descrição *"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                required
                className="border rounded px-3 py-2 col-span-2"
                rows="3"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Preço *"
                value={formData.preco}
                onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                required
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Estoque *"
                value={formData.estoque}
                onChange={(e) => setFormData({ ...formData, estoque: e.target.value })}
                required
                className="border rounded px-3 py-2"
              />
              <select
                value={formData.liga}
                onChange={(e) => setFormData({ ...formData, liga: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option value="NBA">NBA</option>
                <option value="NFL">NFL</option>
                <option value="MLB">MLB</option>
              </select>
              <select
                value={formData.tamanho}
                onChange={(e) => setFormData({ ...formData, tamanho: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option value="P">P</option>
                <option value="M">M</option>
                <option value="G">G</option>
                <option value="GG">GG</option>
                <option value="XGG">XGG</option>
              </select>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option value="Jersey">Jersey</option>
                <option value="Camisa Treino">Camisa Treino</option>
                <option value="Edição Especial">Edição Especial</option>
              </select>
              <input
                type="text"
                placeholder="SKU (opcional)"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="URL da Imagem (opcional)"
                value={formData.imagemUrl}
                onChange={(e) => setFormData({ ...formData, imagemUrl: e.target.value })}
                className="border rounded px-3 py-2 col-span-2"
              />
              <label className="flex items-center col-span-2">
                <input
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  className="mr-2"
                />
                Produto Ativo
              </label>
              <div className="col-span-2 flex gap-2">
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                  {editando ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={() => { setCriando(false); setEditando(null); resetForm(); }}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabela de Produtos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liga/Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estoque</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {produtos.map((produto) => (
                <tr key={produto.id} className={!produto.ativo ? 'bg-gray-100' : ''}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {produto.imagemUrl && (
                        <img src={produto.imagemUrl} alt={produto.nome} className="h-12 w-12 object-cover rounded mr-3" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{produto.nome}</div>
                        <div className="text-sm text-gray-500">{produto.tamanho} - {produto.categoria}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>{produto.liga}</div>
                    <div className="text-gray-500">{produto.time}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">R$ {produto.preco.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{produto.estoque}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleAtivo(produto)}
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        produto.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {produto.ativo ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleEditar(produto)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeletar(produto.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {produtos.length === 0 && (
            <div className="text-center py-8 text-gray-500">Nenhum produto encontrado</div>
          )}
        </div>
      </div>
    </div>
  );
}
