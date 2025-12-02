"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MainTemplate from "@/templates/MainTemplate/Index";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import OrderStatusBadge from "@/components/Profile/OrderStatusBadge";
import { Package, ArrowLeft, MapPin, CreditCard } from "lucide-react";

type OrderItem = {
  id: number;
  quantidade: number;
  preco: number;
  produto: {
    nome: string;
    imagemUrl: string | null;
    liga?: { nome: string; sigla: string };
    time?: { nome: string; sigla: string };
    cor?: { nome: string; codigo: string };
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
  confirmadoEm?: string | null;
  itens: OrderItem[];
  usuario?: {
    nome: string;
    email: string;
    telefone?: string;
    endereco?: {
      endereco: string;
      numero: string;
      complemento?: string;
      bairro: string;
      cidade: string;
      cep: string;
      estado: {
        uf: string;
        nome: string;
      };
    };
  };
  formaPagamento?: {
    tipo: string;
    numeroCartao?: string;
    bandeiraCartao?: string;
  };
};

type OrderDetailsProps = {
  orderId: string;
};

export default function OrderDetails({ orderId }: OrderDetailsProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      const response = await fetch(`/api/pedidos/${orderId}`);
      if (!response.ok) {
        throw new Error("Pedido não encontrado");
      }
      const data = await response.json();
      
      if (data.success && data.pedido) {
        setOrder(data.pedido);
      } else {
        throw new Error("Pedido não encontrado");
      }
    } catch (err) {
      setError("Erro ao carregar detalhes do pedido");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPaymentType = (type: string) => {
    const types: { [key: string]: string } = {
      cartao_credito: "Cartão de Crédito",
      cartao_debito: "Cartão de Débito",
      pix: "PIX",
      boleto: "Boleto"
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <MainTemplate>
        <div className="bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </MainTemplate>
    );
  }

  if (error || !order) {
    return (
      <MainTemplate>
        <div className="bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Pedido não encontrado"}</p>
            <button
              onClick={() => router.push("/perfil/pedidos")}
              className="text-blue-600 hover:underline"
            >
              Voltar para pedidos
            </button>
          </div>
        </div>
      </MainTemplate>
    );
  }

  const codigo = `#${order.id.toString().padStart(6, '0')}`;
  const dataFormatada = new Date(order.criadoEm).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <MainTemplate>
      <div className="bg-gray-50">
        <div className="flex">
          <ProfileSidebar activePage="pedidos" />
          
          <main className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={() => router.push("/perfil/pedidos")}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
              >
                <ArrowLeft size={20} />
                Voltar para pedidos
              </button>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package size={32} className="text-gray-900" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Pedido {codigo}
                    </h1>
                    <p className="text-gray-600">{dataFormatada}</p>
                  </div>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna Principal - Itens do Pedido */}
              <div className="lg:col-span-2 space-y-6">
                {/* Produtos */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Itens do Pedido</h2>
                  <div className="space-y-4">
                    {order.itens.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 pb-4 border-b last:border-b-0"
                      >
                        {item.produto.imagemUrl ? (
                          <img
                            src={item.produto.imagemUrl}
                            alt={item.produto.nome}
                            className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package size={32} className="text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {item.produto.nome}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.produto.time?.nome} - {item.produto.liga?.sigla}
                          </p>
                          {(item.tamanho || item.produto.cor) && (
                            <p className="text-sm text-gray-600">
                              {item.tamanho && `Tamanho: ${item.tamanho.nome}`}
                              {item.tamanho && item.produto.cor && ' | '}
                              {item.produto.cor && `Cor: ${item.produto.cor.nome}`}
                            </p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Quantidade: {item.quantidade}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(item.preco * item.quantidade)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total</span>
                      <span className="text-green-600">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna Lateral - Informações */}
              <div className="space-y-6">
                {/* Endereço de Entrega */}
                {order.usuario?.endereco && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin size={20} className="text-gray-700" />
                      <h2 className="text-lg font-bold">Endereço de Entrega</h2>
                    </div>
                    <div className="text-gray-700 space-y-1">
                      <p className="font-medium">{order.usuario?.nome}</p>
                      <p>
                        {order.usuario.endereco.endereco}, {order.usuario.endereco.numero}
                      </p>
                      {order.usuario.endereco.complemento && (
                        <p>{order.usuario.endereco.complemento}</p>
                      )}
                      <p>
                        {order.usuario.endereco.bairro}, {order.usuario.endereco.cidade} - {order.usuario.endereco.estado.uf}
                      </p>
                      <p>CEP: {order.usuario.endereco.cep}</p>
                      {order.usuario.telefone && (
                        <p className="pt-2">{order.usuario.telefone}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Forma de Pagamento */}
                {order.formaPagamento && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard size={20} className="text-gray-700" />
                      <h2 className="text-lg font-bold">Pagamento</h2>
                    </div>
                    <div className="text-gray-700 space-y-1">
                      <p className="font-medium">
                        {formatPaymentType(order.formaPagamento.tipo)}
                      </p>
                      {order.formaPagamento.bandeiraCartao && (
                        <p>{order.formaPagamento.bandeiraCartao}</p>
                      )}
                      {order.formaPagamento.numeroCartao && (
                        <p>{order.formaPagamento.numeroCartao}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Resumo do Pedido */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-lg font-bold mb-4">Resumo</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pedido</span>
                      <span className="font-medium">{codigo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data</span>
                      <span className="font-medium">
                        {new Date(order.criadoEm).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {order.confirmadoEm && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confirmado em</span>
                        <span className="font-medium">
                          {new Date(order.confirmadoEm).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-gray-600">Itens</span>
                      <span className="font-medium">
                        {order.itens.reduce((acc, item) => acc + item.quantidade, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      </div>
    </MainTemplate>
  );
}
