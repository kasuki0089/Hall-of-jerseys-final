'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MainTemplate from '@/templates/MainTemplate/Index';
import { Users, Package, ShoppingCart, TrendingUp, Settings } from 'lucide-react';

export default function SimpleAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    if (session.user?.tipo !== 'ADMIN') {
      router.push('/');
      return;
    }

    loadStats();
  }, [session, status, router]);

  const loadStats = async () => {
    try {
      // Carregar estatísticas básicas
      const productsRes = await fetch('/api/produtos');
      if (productsRes.ok) {
        const data = await productsRes.json();
        setStats(prev => ({ ...prev, products: data.produtos?.length || 0 }));
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  if (!mounted || status === 'loading') {
    return (
      <MainTemplate>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Carregando painel administrativo...</h2>
          </div>
        </div>
      </MainTemplate>
    );
  }

  if (!session || session.user?.tipo !== 'ADMIN') {
    return null;
  }

  return (
    <MainTemplate>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-600 mt-2">Bem-vindo, {session.user?.nome || session.user?.email}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Usuários</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Produtos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.products}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pedidos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Faturamento</p>
                  <p className="text-2xl font-bold text-gray-900">R$ {stats.revenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Gerenciar Produtos</h3>
              <p className="text-gray-600 mb-4">Adicionar, editar ou remover produtos do catálogo.</p>
              <button 
                onClick={() => router.push('/admin/produtos')}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Gerenciar Produtos
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Gerenciar Usuários</h3>
              <p className="text-gray-600 mb-4">Visualizar e gerenciar contas de usuários.</p>
              <button 
                onClick={() => router.push('/admin/usuarios')}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Gerenciar Usuários
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pedidos</h3>
              <p className="text-gray-600 mb-4">Acompanhar e gerenciar pedidos dos clientes.</p>
              <button 
                onClick={() => router.push('/admin/pedidos')}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Ver Pedidos
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações</h3>
              <p className="text-gray-600 mb-4">Configurar parâmetros do sistema e loja.</p>
              <button 
                onClick={() => router.push('/admin/configuracoes')}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Configurações
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Relatórios</h3>
              <p className="text-gray-600 mb-4">Visualizar relatórios de vendas e analytics.</p>
              <button 
                onClick={() => router.push('/admin/relatorios')}
                className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
              >
                Ver Relatórios
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Backup</h3>
              <p className="text-gray-600 mb-4">Fazer backup dos dados do sistema.</p>
              <button 
                onClick={() => alert('Funcionalidade em desenvolvimento')}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Backup Dados
              </button>
            </div>
          </div>

        </div>
      </div>
    </MainTemplate>
  );
}