"use client";
import AdminTemplate from "@/templates/AdminTemplate";
import { MessageSquare } from "lucide-react";

const mensagensData = [
  {
    id: 1,
    usuario: "Isaac Cardoso",
    email: "tc.sous4@gmail.com",
    motivo: "Compras",
    enviadoEm: "26/11/25",
    resumo: "O Pedido veio errado.",
  },
  {
    id: 2,
    usuario: "Maria Silva",
    email: "maria.silva@gmail.com",
    motivo: "Dúvidas",
    enviadoEm: "25/11/25",
    resumo: "Gostaria de saber sobre o prazo de entrega.",
  },
  {
    id: 3,
    usuario: "João Santos",
    email: "joao.santos@gmail.com",
    motivo: "Reclamação",
    enviadoEm: "24/11/25",
    resumo: "Produto chegou com defeito.",
  },
];

export default function MensagensPage() {
  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-800">Mensagens</h1>
        </div>
      </div>

      {/* Tabela de Mensagens */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                USUÁRIO
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                EMAIL
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                MOTIVO
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                ENVIADO EM
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                RESUMO
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mensagensData.map((mensagem) => (
              <tr key={mensagem.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-800">
                  #{mensagem.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {mensagem.usuario}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {mensagem.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {mensagem.motivo}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center">
                  {mensagem.enviadoEm}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {mensagem.resumo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminTemplate>
  );
}
