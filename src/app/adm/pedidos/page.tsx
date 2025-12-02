'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AdminTemplate from '@/templates/AdminTemplate/index';

interface Usuario {
  nome: string;
  email: string;
}

interface Endereco {
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface ItemPedido {
  quantidade?: number;
  preco?: number;
  produto?: {
    nome: string;
    time?: {
      nome: string;
    };
    liga?: {
      sigla: string;
    };
  };
}

interface Pedido {
  id: number;
  status: string;
  criadoEm: string;
  total?: string | number;
  usuario?: Usuario;
  valorTotal?: number;
  itens?: ItemPedido[];
  itensPedido?: ItemPedido[];
  formaPagamento?: string;
  enderecoEntrega?: string | Endereco;
}

export default function PedidosAdmin() {
  const { data: session } = useSession();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [novoStatus, setNovoStatus] = useState('');

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
    carregarPedidos();
  }, [filtroStatus]);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const url = filtroStatus 
        ? `/api/pedidos?admin=true&status=${filtroStatus}`
        : '/api/pedidos?admin=true';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setPedidos(data.pedidos);
      } else {
        console.error('Erro ao carregar pedidos:', data.error);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatusPedido = async (pedidoId: number, status: string) => {
    try {
      const response = await fetch('/api/pedidos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pedidoId: pedidoId,
          status: status
        }),
      });

      const result = await response.json();

      if (result.success) {
        notifications.success('Status atualizado com sucesso!');
        carregarPedidos();
        setPedidoSelecionado(null);
        setNovoStatus('');
      } else {
        notifications.error('Erro ao atualizar status: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      notifications.error('Erro ao atualizar status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'PENDENTE': 'bg-yellow-100 text-yellow-800',
      'CONFIRMADO': 'bg-blue-100 text-blue-800',
      'PREPARANDO': 'bg-orange-100 text-orange-800',
      'ENVIADO': 'bg-purple-100 text-purple-800',
      'ENTREGUE': 'bg-green-100 text-green-800',
      'CANCELADO': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <AdminTemplate>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate>
      <div>
        <h1 className="text-3xl font-bold mb-6">Gestão de Pedidos</h1>

        {/* Filtros */}
        <div className="mb-6 flex gap-4">
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

        {/* Lista de Pedidos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID / Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Itens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">#{pedido.id}</div>
                        <div className="text-sm text-gray-500">{pedido.usuario?.nome}</div>
                        <div className="text-xs text-gray-400">{pedido.usuario?.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(pedido.criadoEm).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(pedido.criadoEm).toLocaleTimeString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {(pedido.itens || pedido.itensPedido)?.length || 0} item(s)
                      </div>
                      <div className="text-xs text-gray-500">
                        {(pedido.itens || pedido.itensPedido)?.map(item => item.produto?.nome).join(', ').substring(0, 50)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        R$ {parseFloat(String(pedido.total || 0)).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pedido.status)}`}>
                        {pedido.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setPedidoSelecionado(pedido)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {pedidos.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum pedido encontrado</p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes do Pedido */}
      {pedidoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Pedido #{pedidoSelecionado.id}</h2>
                <button
                  onClick={() => setPedidoSelecionado(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Informações do Cliente */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Cliente</h3>
                  <div className="space-y-2">
                    <p><strong>Nome:</strong> {pedidoSelecionado.usuario?.nome}</p>
                    <p><strong>Email:</strong> {pedidoSelecionado.usuario?.email}</p>
                    <p><strong>Data do Pedido:</strong> {new Date(pedidoSelecionado.criadoEm).toLocaleString('pt-BR')}</p>
                    <p><strong>Forma de Pagamento:</strong> {pedidoSelecionado.formaPagamento}</p>
                  </div>
                </div>

                {/* Endereço de Entrega */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Endereço de Entrega</h3>
                  {pedidoSelecionado.enderecoEntrega && (
                    <div className="space-y-1 text-sm">
                      {(() => {
                        const endereco = typeof pedidoSelecionado.enderecoEntrega === 'string' 
                          ? JSON.parse(pedidoSelecionado.enderecoEntrega)
                          : pedidoSelecionado.enderecoEntrega;
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
                  )}
                </div>
              </div>

              {/* Itens do Pedido */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Itens do Pedido</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Preço Unit.</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(pedidoSelecionado.itens || pedidoSelecionado.itensPedido)?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">
                            <div>
                              <p className="font-medium">{item.produto?.nome}</p>
                              <p className="text-sm text-gray-500">
                                {item.produto?.time?.nome} - {item.produto?.liga?.sigla}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-2">{item.quantidade}</td>
                          <td className="px-4 py-2">R$ {parseFloat(String(item.preco || 0)).toFixed(2)}</td>
                          <td className="px-4 py-2">R$ {(parseFloat(String(item.preco || 0)) * (item.quantidade || 0)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right font-medium">Total do Pedido:</td>
                        <td className="px-4 py-2 font-bold">R$ {parseFloat(String(pedidoSelecionado.total || 0)).toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Atualizar Status */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-3">Atualizar Status</h3>
                <div className="flex gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Novo Status</label>
                    <select
                      value={novoStatus}
                      onChange={(e) => setNovoStatus(e.target.value)}
                      className="mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione...</option>
                      {statusOptions.slice(1).map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => atualizarStatusPedido(pedidoSelecionado.id, novoStatus)}
                    disabled={!novoStatus}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Atualizar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminTemplate>
  );
}
