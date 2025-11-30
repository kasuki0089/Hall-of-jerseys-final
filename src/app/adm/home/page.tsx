'use client';
import { useState, useEffect } from "react";
import AdminTemplate from "@/templates/AdminTemplate";
import { LayoutDashboard, Package, Users, ShoppingCart } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type ChartData = {
  produtosPorLiga: { liga: string; quantidade: number }[];
  vendas: { periodo: string; vendas: number }[];
  topProdutos: { produto: string; vendas: number }[];
  ligasMaisProcuradas: { liga: string; acessos: number }[];
};

export default function AdminHomePage() {
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalEstoque: 0,
    totalUsuarios: 0,
    totalPedidos: 0,
    totalAdmins: 0,
  });
  const [loading, setLoading] = useState(true);
  
  // Estados para os gráficos
  const [periodoVendas, setPeriodoVendas] = useState<'dia' | 'semana' | 'mes' | 'ano'>('mes');
  const [periodoTopProdutos, setPeriodoTopProdutos] = useState<'dia' | 'semana' | 'mes' | 'ano'>('mes');
  const [periodoLigas, setPeriodoLigas] = useState<'dia' | 'semana' | 'mes' | 'ano'>('mes');
  
  const [chartData, setChartData] = useState<ChartData>({
    produtosPorLiga: [],
    vendas: [],
    topProdutos: [],
    ligasMaisProcuradas: []
  });

  useEffect(() => {
    carregarEstatisticas();
    carregarDadosGraficos('mes');
  }, []);

  useEffect(() => {
    carregarDadosGraficos(periodoVendas);
  }, [periodoVendas, periodoTopProdutos, periodoLigas]);

  const carregarDadosGraficos = async (periodo: string) => {
    try {
      const response = await fetch(`/api/dashboard/stats?periodo=${periodo}`);
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Erro ao carregar dados dos gráficos');
        return;
      }
      
      setChartData(data);
    } catch (error) {
      console.error('Erro ao carregar dados dos gráficos:', error);
    }
  };

  const carregarEstatisticas = async () => {
    try {
      // Buscar produtos
      const produtosRes = await fetch('/api/produtos');
      const produtosData = await produtosRes.json();

      // Buscar usuários (apenas usuários comuns, não admins)
      const usuariosRes = await fetch('/api/usuarios');
      const usuariosData = await usuariosRes.json();

      // Buscar administradores
      const adminsRes = await fetch('/api/administradores');
      const adminsData = await adminsRes.json();

      // Buscar pedidos
      const pedidosRes = await fetch('/api/pedidos?admin=true');
      const pedidosData = await pedidosRes.json();

      // Contar apenas usuários comuns (não admins)
      const usuariosComuns = usuariosData.usuarios?.filter((u: any) => u.role !== 'admin') || [];

      // Calcular total de estoque somando todos os produtos e seus tamanhos
      let totalEstoque = 0;
      if (produtosData.produtos && Array.isArray(produtosData.produtos)) {
        produtosData.produtos.forEach((produto: any) => {
          if (produto.estoques && Array.isArray(produto.estoques)) {
            produto.estoques.forEach((estoque: any) => {
              totalEstoque += estoque.quantidade || 0;
            });
          }
        });
      }

      setStats({
        totalProdutos: produtosData.pagination?.totalItems || 0,
        totalEstoque: totalEstoque,
        totalUsuarios: usuariosComuns.length,
        totalPedidos: pedidosData.pedidos?.length || 0,
        totalAdmins: adminsData.length || 0,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </div>
        <p className="text-gray-600">Painel de controle da Hall Of Jerseys!</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total de Produtos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total de Produtos</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {loading ? "..." : stats.totalProdutos}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {loading ? "" : `${stats.totalEstoque} itens em estoque`}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total de Usuários */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total de Usuários</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {loading ? "..." : stats.totalUsuarios}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Total de Administradores */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Administradores</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {loading ? "..." : stats.totalAdmins}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Total de Pedidos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total de Pedidos</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {loading ? "..." : stats.totalPedidos}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <ShoppingCart className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Cards de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1 - Produtos por Liga */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Produtos por Liga</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.produtosPorLiga}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="liga" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantidade" fill="#1e40af" name="Produtos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 2 - Vendas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Vendas</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setPeriodoVendas('dia')}
                className={`px-3 py-1 text-xs rounded ${periodoVendas === 'dia' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Dia
              </button>
              <button
                onClick={() => setPeriodoVendas('semana')}
                className={`px-3 py-1 text-xs rounded ${periodoVendas === 'semana' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Semana
              </button>
              <button
                onClick={() => setPeriodoVendas('mes')}
                className={`px-3 py-1 text-xs rounded ${periodoVendas === 'mes' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Mês
              </button>
              <button
                onClick={() => setPeriodoVendas('ano')}
                className={`px-3 py-1 text-xs rounded ${periodoVendas === 'ano' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Ano
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.vendas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="vendas" stroke="#1e40af" strokeWidth={2} name="Vendas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 3 - Produtos Mais Vendidos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Top 5 Produtos Mais Vendidos</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setPeriodoTopProdutos('dia')}
                className={`px-3 py-1 text-xs rounded ${periodoTopProdutos === 'dia' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Dia
              </button>
              <button
                onClick={() => setPeriodoTopProdutos('semana')}
                className={`px-3 py-1 text-xs rounded ${periodoTopProdutos === 'semana' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Semana
              </button>
              <button
                onClick={() => setPeriodoTopProdutos('mes')}
                className={`px-3 py-1 text-xs rounded ${periodoTopProdutos === 'mes' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Mês
              </button>
              <button
                onClick={() => setPeriodoTopProdutos('ano')}
                className={`px-3 py-1 text-xs rounded ${periodoTopProdutos === 'ano' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Ano
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.topProdutos} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="produto" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="vendas" fill="#16a34a" name="Vendas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 4 - Liga Mais Procurada */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Liga Mais Procurada</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setPeriodoLigas('dia')}
                className={`px-3 py-1 text-xs rounded ${periodoLigas === 'dia' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Dia
              </button>
              <button
                onClick={() => setPeriodoLigas('semana')}
                className={`px-3 py-1 text-xs rounded ${periodoLigas === 'semana' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Semana
              </button>
              <button
                onClick={() => setPeriodoLigas('mes')}
                className={`px-3 py-1 text-xs rounded ${periodoLigas === 'mes' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Mês
              </button>
              <button
                onClick={() => setPeriodoLigas('ano')}
                className={`px-3 py-1 text-xs rounded ${periodoLigas === 'ano' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Ano
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.ligasMaisProcuradas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="liga" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="acessos" fill="#9333ea" name="Acessos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminTemplate>
  );
}
