'use client';
import { useState, useEffect } from 'react';
import MainTemplate from '../../../../templates/MainTemplate/index.jsx';

export default function AdicionarProduto() {
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    preco: '',
    ligaId: '',
    timeId: '',
    categoria: 'JERSEY',
    serie: '',
    year: new Date().getFullYear(),
    tamanho: 'M',
    cor: '',
    sport: '',
    descricao: '',
    estoque: '100',
    ativo: true,
    sale: false,
    imagemUrl: ''
  });

  const [ligas, setLigas] = useState([]);
  const [times, setTimes] = useState([]);
  const [timesFiltrados, setTimesFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categorias = ['JERSEY', 'REGATA', 'CAMISA', 'CAMISA_MANGA_LONGA'];
  const series = ['Atual temporada', 'Temporada anterior', 'Vintage', 'Retrô', 'Legends Collection', 'Championship Era'];
  const anos = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i);
  const tamanhoOptions = ['PP', 'P', 'M', 'G', 'GG', 'XG'];

  useEffect(() => {
    carregarLigas();
    carregarTimes();
  }, []);

  useEffect(() => {
    if (formData.ligaId) {
      const timesDaLiga = times.filter(time => time.ligaId === parseInt(formData.ligaId));
      setTimesFiltrados(timesDaLiga);
      setFormData(prev => ({ ...prev, timeId: '' }));
    } else {
      setTimesFiltrados([]);
    }
  }, [formData.ligaId, times]);

  const carregarLigas = async () => {
    try {
      const res = await fetch('/api/ligas');
      const data = await res.json();
      setLigas(data);
    } catch (error) {
      console.error('Erro ao carregar ligas:', error);
    }
  };

  const carregarTimes = async () => {
    try {
      const res = await fetch('/api/times');
      const data = await res.json();
      setTimes(data);
    } catch (error) {
      console.error('Erro ao carregar times:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!formData.nome || !formData.preco || !formData.ligaId || !formData.timeId || !formData.codigo) {
        setMessage('Por favor, preencha todos os campos obrigatórios');
        setLoading(false);
        return;
      }

      const submitData = {
        nome: formData.nome,
        codigo: formData.codigo,
        preco: parseFloat(formData.preco),
        categoria: formData.categoria,
        tamanho: formData.tamanho,
        cor: formData.cor,
        sport: formData.sport,
        year: parseInt(formData.year),
        serie: formData.serie,
        descricao: formData.descricao,
        estoque: parseInt(formData.estoque) || 100,
        ativo: formData.ativo,
        sale: formData.sale,
        imagemUrl: formData.imagemUrl,
        ligaId: parseInt(formData.ligaId),
        timeId: parseInt(formData.timeId)
      };

      const res = await fetch('/api/admin/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Produto adicionado com sucesso!');
        // Reset form
        setFormData({
          nome: '',
          codigo: '',
          preco: '',
          ligaId: '',
          timeId: '',
          categoria: 'JERSEY',
          serie: '',
          year: new Date().getFullYear(),
          tamanho: 'M',
          cor: '',
          sport: '',
          descricao: '',
          estoque: '100',
          ativo: true,
          sale: false,
          imagemUrl: ''
        });
      } else {
        setMessage(`Erro: ${data.error || 'Falha ao adicionar produto'}`);
      }
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      setMessage('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/admin/produtos';
  };

  return (
    <MainTemplate>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-blue-900 min-h-screen p-6">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-yellow-500 rounded mr-3 flex items-center justify-center">
                <span className="text-blue-900 font-bold">⚡</span>
              </div>
              <span className="text-white font-bold text-lg">HALL OF JERSEYS</span>
            </div>

            <div className="text-white text-right mb-6">
              <p>Bem Vindo, Admin</p>
              <button className="text-red-400 hover:text-red-300">Sair</button>
            </div>

            <nav className="space-y-2">
              <a href="/admin" className="flex items-center text-white py-2 px-3 rounded hover:bg-blue-800">
                <span className="mr-3">📊</span> Dashboard
              </a>
              <a href="/admin/administradores" className="flex items-center text-white py-2 px-3 rounded hover:bg-blue-800">
                <span className="mr-3">👥</span> Administradores
              </a>
              <a href="/admin/usuarios" className="flex items-center text-white py-2 px-3 rounded hover:bg-blue-800">
                <span className="mr-3">👤</span> Usuários
              </a>
              <a href="/admin/produtos" className="flex items-center text-white py-2 px-3 rounded bg-blue-800">
                <span className="mr-3">📦</span> Produtos
              </a>
              <a href="/admin/pedidos" className="flex items-center text-white py-2 px-3 rounded hover:bg-blue-800">
                <span className="mr-3">🛒</span> Pedidos
              </a>
              <a href="/admin/avaliacoes" className="flex items-center text-white py-2 px-3 rounded hover:bg-blue-800">
                <span className="mr-3">⭐</span> Avaliações
              </a>
              <a href="/admin/mensagens" className="flex items-center text-white py-2 px-3 rounded hover:bg-blue-800">
                <span className="mr-3">💬</span> Mensagens
              </a>
              <a href="/admin/carrossel" className="flex items-center text-white py-2 px-3 rounded hover:bg-blue-800">
                <span className="mr-3">🎠</span> Carrossel
              </a>
              <a href="/admin/logs" className="flex items-center text-white py-2 px-3 rounded hover:bg-blue-800">
                <span className="mr-3">📋</span> Logs
              </a>
              <a href="/admin/configuracoes" className="flex items-center text-white py-2 px-3 rounded hover:bg-blue-800">
                <span className="mr-3">⚙️</span> Configurações
              </a>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-800 mb-8">Adicionar produto</h1>

              {message && (
                <div className={`mb-6 p-4 rounded ${message.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Nome do produto *</label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Jersey Lakers #24 Kobe Bryant"
                      required
                    />
                  </div>

                  {/* Código */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Código do produto *</label>
                    <input
                      type="text"
                      name="codigo"
                      value={formData.codigo}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: LAK001"
                      required
                    />
                  </div>

                  {/* Preço */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Preço (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      name="preco"
                      value={formData.preco}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  {/* Estoque */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Estoque</label>
                    <input
                      type="number"
                      name="estoque"
                      value={formData.estoque}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="100"
                    />
                  </div>

                  {/* Liga */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Liga *</label>
                    <select
                      name="ligaId"
                      value={formData.ligaId}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione uma liga</option>
                      {ligas.map(liga => (
                        <option key={liga.id} value={liga.id}>{liga.nome} ({liga.sigla})</option>
                      ))}
                    </select>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Time *</label>
                    <select
                      name="timeId"
                      value={formData.timeId}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={!formData.ligaId}
                    >
                      <option value="">Selecione um time</option>
                      {timesFiltrados.map(time => (
                        <option key={time.id} value={time.id}>{time.nome}</option>
                      ))}
                    </select>
                  </div>

                  {/* Categoria */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Categoria</label>
                    <select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tamanho */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Tamanho</label>
                    <select
                      name="tamanho"
                      value={formData.tamanho}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {tamanhoOptions.map(tam => (
                        <option key={tam} value={tam}>{tam}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sport */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Esporte</label>
                    <input
                      type="text"
                      name="sport"
                      value={formData.sport}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Basquete, Futebol"
                    />
                  </div>

                  {/* Cor */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Cor</label>
                    <input
                      type="text"
                      name="cor"
                      value={formData.cor}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Azul, Vermelho, Branco"
                    />
                  </div>

                  {/* Série */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Série</label>
                    <select
                      name="serie"
                      value={formData.serie}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione uma série</option>
                      {series.map(serie => (
                        <option key={serie} value={serie}>{serie}</option>
                      ))}
                    </select>
                  </div>

                  {/* Ano */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Ano</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione um ano</option>
                      {anos.map(ano => (
                        <option key={ano} value={ano}>{ano}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Descrição</label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descrição detalhada do produto..."
                  />
                </div>

                {/* Opções adicionais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="ativo"
                      checked={formData.ativo}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label className="text-gray-700">Produto ativo</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="sale"
                      checked={formData.sale}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label className="text-gray-700">Em promoção</label>
                  </div>
                </div>

                {/* URL da Imagem */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">URL da imagem</label>
                  <input
                    type="url"
                    name="imagemUrl"
                    value={formData.imagemUrl}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    Cancelar ✕
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
                  >
                    {loading ? 'Enviando...' : 'Enviar ✓'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}