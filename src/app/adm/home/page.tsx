'use client';
import { useState, useEffect } from "react";
import AdminTemplate from "@/templates/AdminTemplate";
import { LayoutDashboard, Package, Users, ShoppingCart, DollarSign } from "lucide-react";

export default function AdminHomePage() {
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalUsuarios: 0,
    totalPedidos: 0,
    totalAdmins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      // Buscar produtos
      const produtosRes = await fetch('/api/produtos');
      const produtos = await produtosRes.json();

      // Buscar usuários
      const usuariosRes = await fetch('/api/usuarios');
      const usuarios = await usuariosRes.json();

      // Buscar administradores
      const adminsRes = await fetch('/api/administradores');
      const admins = await adminsRes.json();

      setStats({
        totalProdutos: produtos.total || produtos.length || 0,
        totalUsuarios: usuarios.total || usuarios.length || 0,
        totalPedidos: 0, // TODO: implementar quando tiver API de pedidos
        totalAdmins: admins.length || 0,
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
          <div className="w-full h-80 bg-gray-100 rounded flex items-center justify-center text-gray-500">
            Em desenvolvimento
          </div>
        </div>

        {/* Gráfico 2 - Vendas Mensais */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Vendas Mensais</h3>
          <div className="w-full h-80 bg-gray-100 rounded flex items-center justify-center text-gray-500">
            Em desenvolvimento
          </div>
        </div>

        {/* Gráfico 3 - Produtos Mais Vendidos */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Produtos Mais Vendidos</h3>
          <div className="w-full h-80 bg-gray-100 rounded flex items-center justify-center text-gray-500">
            Em desenvolvimento
          </div>
        </div>
      </div>
    </AdminTemplate>
  );
}
