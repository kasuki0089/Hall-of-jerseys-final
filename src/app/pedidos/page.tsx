'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MainTemplate from '@/templates/MainTemplate/Index';
import Link from 'next/link';
import Image from 'next/image';

interface Pedido {
  id: number;
  status: string;
  criadoEm: string;
  total: string | number;
  itens: any[];
  itensPedido?: any[];
  formaPagamento?: string;
  enderecoEntrega?: string;
  observacoes?: string;
}

export default function MeusPedidos() {
  const { data: session } = useSession();
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('');

  const statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'CONFIRMADO', label: 'Confirmado' },
    { value: 'PREPARANDO', label: 'Preparando' },
    { value: 'ENVIADO', label: 'Enviado' },
    { value: 'ENTREGUE', label: 'Entregue' },
    { value: 'CANCELADO', label: 'Cancelado' }
  ];

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    carregarPedidos();
  }, [session, filtroStatus]);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const url = filtroStatus 
        ? `/api/pedidos?status=${filtroStatus}`
        : '/api/pedidos';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setPedidos(data.pedidos);
      } else {
        console.error('Erro ao carregar pedidos:', data.error);
        if (data.error === 'Não autorizado') {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'PENDENTE': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'CONFIRMADO': 'bg-blue-100 text-blue-800 border-blue-200',
      'PREPARANDO': 'bg-orange-100 text-orange-800 border-orange-200',
      'ENVIADO': 'bg-purple-100 text-purple-800 border-purple-200',
      'ENTREGUE': 'bg-green-100 text-green-800 border-green-200',
      'CANCELADO': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusDescription = (status: string) => {
    const descriptions: { [key: string]: string } = {
      'PENDENTE': 'Aguardando confirmação do pagamento',
      'CONFIRMADO': 'Pagamento confirmado, pedido sendo preparado',
      'PREPARANDO': 'Pedido sendo preparado para envio',
      'ENVIADO': 'Pedido enviado para entrega',
      'ENTREGUE': 'Pedido entregue com sucesso',
      'CANCELADO': 'Pedido cancelado'
    };
    return descriptions[status] || 'Status desconhecido';
  };

  if (!session) {
    return (
      <MainTemplate>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Acesse sua conta</h1>
            <p className="text-gray-600 mb-4">Você precisa estar logado para ver seus pedidos.</p>
            <Link 
              href="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              Fazer Login
            </Link>
          </div>
        </div>
      </MainTemplate>
    );
  }

  if (loading) {
    return (
      <MainTemplate>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </MainTemplate>
    );
  }

  return (
    <MainTemplate>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>
        
        {/* Filtros */}
        <div className="mb-6 flex gap-4 items-center">
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={carregarPedidos}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Atualizar
          </button>
        </div>

        {pedidos.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600 mb-4">Nenhum pedido encontrado</h2>
            <p className="text-gray-500 mb-6">Você ainda não fez nenhum pedido.</p>
            <Link 
              href="/produtos"
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              Ver Produtos
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Cabeçalho do Pedido */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Pedido #{pedido.id}</h2>
                      <p className="text-sm text-gray-600">
                        Feito em {new Date(pedido.criadoEm).toLocaleDateString('pt-BR')} às {new Date(pedido.criadoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(pedido.status)}`}>
                        {pedido.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Conteúdo do Pedido */}
                <div className="p-6">
                  {/* Status Description */}
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800">
                      {getStatusDescription(pedido.status)}
                    </p>
                  </div>

                  {/* Itens do Pedido */}
                  <div className="space-y-4 mb-6">
                    {pedido.itensPedido?.map((item, index) => (
                      <div key={index} className="flex gap-4 items-center">
                        <div className="w-16 h-16 relative flex-shrink-0">
                          <Image
                            src={item.produto?.imagemUrl || '/images/produto-placeholder.jpg'}
                            alt={item.produto?.nome || 'Produto'}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.produto?.nome}</h3>
                          <p className="text-sm text-gray-600">
                            {item.produto?.time?.nome} - {item.produto?.liga?.sigla}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>Qtd: {item.quantidade}</span>
                            <span>•</span>
                            <span>R$ {parseFloat(item.preco).toFixed(2)} cada</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            R$ {(parseFloat(item.preco) * item.quantidade).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Informações de Pagamento e Entrega */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Pagamento</h4>
                      <p className="text-sm text-gray-600">
                        Forma: {pedido.formaPagamento || 'Não informado'}
                      </p>
                      <p className="text-lg font-bold text-green-600 mt-2">
                        Total: R$ {parseFloat(String(pedido.total || 0)).toFixed(2)}
                      </p>
                    </div>
                    
                    {pedido.enderecoEntrega && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Entrega</h4>
                        <div className="text-sm text-gray-600">
                          {(() => {
                            const endereco = typeof pedido.enderecoEntrega === 'string' 
                              ? JSON.parse(pedido.enderecoEntrega)
                              : pedido.enderecoEntrega;
                            return (
                              <>
                                <p>{endereco.rua}, {endereco.numero}</p>
                                {endereco.complemento && <p>{endereco.complemento}</p>}
                                <p>{endereco.bairro}</p>
                                <p>{endereco.cidade} - {endereco.estado}</p>
                                <p>CEP: {endereco.cep}</p>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Observações */}
                  {pedido.observacoes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <h4 className="font-medium text-gray-900 mb-1">Observações</h4>
                      <p className="text-sm text-gray-600">{pedido.observacoes}</p>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="mt-4 flex gap-2">
                    {pedido.status === 'ENTREGUE' && (
                      <button className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                        Avaliar Produtos
                      </button>
                    )}
                    {['PENDENTE', 'CONFIRMADO'].includes(pedido.status) && (
                      <button className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
                        Cancelar Pedido
                      </button>
                    )}
                    <Link 
                      href={`/pedidos/${pedido.id}`}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainTemplate>
  );
}