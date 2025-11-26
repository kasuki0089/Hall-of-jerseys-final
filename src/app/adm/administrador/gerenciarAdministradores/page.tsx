'use client';
import { useState, useEffect } from "react";
import AdminTemplate from "@/templates/AdminTemplate";
import { Shield, Edit, Trash2 } from "lucide-react";
import AddButton from "@/components/ADM/AddButton";
import Link from "next/link";

export default function AdministradoresPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    carregarAdministradores();
  }, []);

  const carregarAdministradores = async () => {
    try {
      const response = await fetch('/api/administradores');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar administradores');
      }

      setAdmins(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja deletar o administrador ${nome}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/administradores/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao deletar administrador');
      }

      alert('Administrador deletado com sucesso!');
      carregarAdministradores();
    } catch (err: any) {
      alert(err.message);
    }
  };
  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Administradores</h1>
        </div>
        <AddButton href="/adm/administrador/adicionar" text="Adicionar administrador" />
      </div>

      {/* Tabela de Administradores */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : admins.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nenhum administrador encontrado</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">NOME</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">EMAIL</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">TELEFONE</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admins.map((admin: any) => (
                <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800">#{admin.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{admin.nome}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 underline">{admin.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{admin.telefone || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center justify-center gap-3">
                      <Link href={`/adm/administrador/alterar/${admin.id}`} className="text-blue-500 hover:text-blue-700 transition-colors">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(admin.id, admin.nome)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminTemplate>
  );
}
