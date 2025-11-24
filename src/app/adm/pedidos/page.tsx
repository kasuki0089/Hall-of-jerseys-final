"use client";
import { useState } from "react";
import AdminTemplate from "@/templates/AdminTemplate";
import { Send, Info } from "lucide-react";

type Pedido = {
  id: number;
  produto: string;
  status: string;
  quantidade: number;
  pedidoEm: string;
};

const initialPedidosData: Pedido[] = [
  {
    id: 1,
    produto: "Regata Golden State Warriors",
    status: "Enviado",
    quantidade: 2,
    pedidoEm: "26/11/25",
  },
  {
    id: 2,
    produto: "Camisa Chicago Bulls - Michael Jordan #23",
    status: "Pendente",
    quantidade: 1,
    pedidoEm: "25/11/25",
  },
  {
    id: 3,
    produto: "Regata Los Angeles Lakers - LeBron James #6",
    status: "Entregue",
    quantidade: 3,
    pedidoEm: "24/11/25",
  },
];

const STATUS_OPTIONS = [
  "Todos",
  "Pendente",
  "Pago",
  "Preparando",
  "Enviado",
  "Entregue",
  "Cancelado",
];

const STATUS_COLORS: { [key: string]: string } = {
  Pendente: "bg-yellow-100 text-yellow-800",
  Pago: "bg-blue-100 text-blue-800",
  Preparando: "bg-orange-100 text-orange-800",
  Enviado: "bg-purple-100 text-purple-800",
  Entregue: "bg-green-100 text-green-800",
  Cancelado: "bg-red-100 text-red-800",
};

export default function PedidosPage() {
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [pedidosData, setPedidosData] = useState<Pedido[]>(initialPedidosData);

  const filteredPedidos =
    statusFilter === "Todos"
      ? pedidosData
      : pedidosData.filter((pedido) => pedido.status === statusFilter);

  const handleStatusChange = (pedidoId: number, newStatus: string) => {
    setPedidosData((prev) =>
      prev.map((pedido) =>
        pedido.id === pedidoId ? { ...pedido, status: newStatus } : pedido
      )
    );
  };

  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Send className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-800">Pedidos</h1>
          </div>
        </div>

        {/* Filtro de Status */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="status-filter"
            className="text-sm font-medium text-gray-700"
          >
            Filtrar por status:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de Pedidos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                PRODUTO
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                STATUS
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                QUANTIDADE
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                PEDIDO EM
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPedidos.map((pedido) => (
              <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-800">
                  #{pedido.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {pedido.produto}
                </td>
                <td className="px-6 py-4 text-sm">
                  <select
                    value={pedido.status}
                    onChange={(e) => handleStatusChange(pedido.id, e.target.value)}
                    className={`px-3 py-1.5 pr-8 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer ${
                      STATUS_COLORS[pedido.status] || "bg-gray-100 text-gray-800"
                    }`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='currentColor' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.5rem center',
                    }}
                  >
                    {STATUS_OPTIONS.filter((s) => s !== "Todos").map(
                      (status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      )
                    )}
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center">
                  {pedido.quantidade}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center">
                  {pedido.pedidoEm}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center justify-center">
                    <button className="text-blue-500 hover:text-blue-700 transition-colors">
                      <Info className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminTemplate>
  );
}
