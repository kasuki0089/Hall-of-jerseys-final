"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MainTemplate from "@/templates/MainTemplate/Index";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import OrderCard from "@/components/Profile/OrderCard";
import OrderListItem from "@/components/Profile/OrderListItem";
import { Package } from "lucide-react";

type OrderItem = {
  id: number;
  quantidade: number;
  preco: number;
  produto: {
    nome: string;
    imagemUrl: string | null;
    liga?: {
      nome: string;
      sigla: string;
    };
    time?: {
      nome: string;
      sigla: string;
    };
  };
  tamanho?: {
    nome: string;
  };
};

type Order = {
  id: number;
  status: string;
  total: number;
  criadoEm: string;
  itens: OrderItem[];
  usuario?: {
    nome: string;
    email: string;
    endereco?: {
      endereco: string;
      numero: string;
      cidade: string;
    };
  };
};

export default function UserOrders() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, [session]);

  const loadOrders = async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/pedidos`);
      if (!response.ok) {
        throw new Error("Erro ao carregar pedidos");
      }
      const data = await response.json();
      
      if (data.success && Array.isArray(data.pedidos)) {
        setOrders(data.pedidos);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError("Erro ao carregar pedidos. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const mostRecentOrder = orders[0];
  const otherOrders = orders.slice(1);

  return (
    <MainTemplate>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <ProfileSidebar activePage="pedidos" />
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Package size={32} className="text-gray-900" />
              <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Carregando pedidos...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg mb-4">
                  Você ainda não tem pedidos
                </p>
                <a
                  href="/produtos"
                  className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver Produtos
                </a>
              </div>
            ) : (
              <>
                {/* Pedido mais recente em destaque */}
                {mostRecentOrder && (
                  <div className="mb-8">
                    <OrderCard
                      id={mostRecentOrder.id}
                      status={mostRecentOrder.status}
                      total={mostRecentOrder.total}
                      criadoEm={mostRecentOrder.criadoEm}
                      itens={mostRecentOrder.itens}
                      enderecoEntrega={
                        mostRecentOrder.usuario?.endereco
                          ? `${mostRecentOrder.usuario.endereco.endereco}, ${mostRecentOrder.usuario.endereco.numero}`
                          : undefined
                      }
                    />
                  </div>
                )}

                {/* Lista de outros pedidos */}
                {otherOrders.length > 0 && (
                  <div className="space-y-4">
                    {/* Cabeçalho da tabela */}
                    <div className="grid grid-cols-6 gap-4 px-4 py-2 bg-gray-200 rounded-lg font-semibold text-gray-700 text-sm">
                      <div>ID</div>
                      <div className="col-span-2">PRODUTO</div>
                      <div>STATUS</div>
                      <div className="text-center">QUANTIDADE</div>
                      <div>PEDIDO EM</div>
                    </div>

                    {/* Lista de pedidos */}
                    {otherOrders.map((order) => (
                      <OrderListItem
                        key={order.id}
                        id={order.id}
                        status={order.status}
                        total={order.total}
                        criadoEm={order.criadoEm}
                        itens={order.itens}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
    </MainTemplate>
  );
}
