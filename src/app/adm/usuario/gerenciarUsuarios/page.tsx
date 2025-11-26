'use client';
import AdminTemplate from "@/templates/AdminTemplate";
import { Users, Info, Trash2, Search } from "lucide-react";
import { useState } from "react";

const usersData = [
  { id: 1, nome: "Pedro Henrique Zillisg", email: "phz@gmail.com", dataIngresso: "26/11/2025" },
  { id: 2, nome: "Isaac Cardoso de Souza", email: "tc.souz4@gmail.com", dataIngresso: "26/11/2025" },
  { id: 3, nome: "Guilherme Machado da Silva", email: "amocasadas@gmail.com", dataIngresso: "26/11/2025" },
];

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = usersData.filter(user =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-800">Gerenciar Usuário</h1>
          </div>
        </div>

        {/* Campo de Pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Pesquisar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">USUÁRIO</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">E-MAIL</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">DATA DE INGRESSÃO</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-800">#{user.id}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{user.nome}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center">{user.dataIngresso}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center justify-center gap-3">
                    <button className="text-blue-500 hover:text-blue-700 transition-colors">
                      <Info className="w-5 h-5" />
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
