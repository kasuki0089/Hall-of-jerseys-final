'use client';
import AdminTemplate from "@/templates/AdminTemplate";
import { Shield, Edit, Trash2, Plus } from "lucide-react";

const adminsData = [
  { id: 1, nome: "SysOP", login: "susop@hof.com", poder: 9 },
  { id: 2, nome: "dann.ksz", login: "dann.ksz@hof.com", poder: 8 },
  { id: 3, nome: "zaratustra", login: "zaratustra@hof.com", poder: 7 },
];

export default function AdministradoresPage() {
  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Administradores</h1>
        </div>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Adicionar administrador</span>
        </button>
      </div>

      {/* Tabela de Administradores */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ADMINISTRADOR</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">LOGIN</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">PODER</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {adminsData.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-800">#{admin.id}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{admin.nome}</td>
                <td className="px-6 py-4 text-sm text-gray-800 underline">{admin.login}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{admin.poder}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center justify-center gap-3">
                    <button className="text-blue-500 hover:text-blue-700 transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 className="w-5 h-5" />
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
