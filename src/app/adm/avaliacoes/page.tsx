"use client";
import { useState, useEffect } from "react";
import AdminTemplate from "@/templates/AdminTemplate";
import { Star, StarHalf, Trash2, Eye } from "lucide-react";
import { notifications } from "@/components/Toast";

interface Avaliacao {
  id: number;
  rating: number;
  comentario?: string;
  criadoEm: string;
  usuario: {
    nome: string;
    email: string;
  };
  produto: {
    nome: string;
    id: number;
  };
}

const renderStars = (rating: number) => {
  // Validar rating
  const validRating = Math.max(0, Math.min(5, rating || 0));
  const fullStars = Math.floor(validRating);
  const hasHalfStar = validRating % 1 !== 0;

  return (
    <div className="flex items-center gap-0.5">
      {fullStars > 0 && [...Array(fullStars)].map((_, index) => (
        <Star
          key={`full-${index}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      ))}
      {hasHalfStar && (
        <StarHalf
          key="half"
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      )}
    </div>
  );
};

export default function AvaliacoesPage() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    carregarAvaliacoes();
  }, []);

  const carregarAvaliacoes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/avaliacoes?admin=true');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar avaliações');
      }
      
      // Garantir que data é um array
      setAvaliacoes(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setError(error.message);
      setAvaliacoes([]); // Definir array vazio em caso de erro
      notifications.error(error.message || 'Erro ao carregar avaliações');
    } finally {
      setLoading(false);
    }
  };

  const excluirAvaliacao = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta avaliação?')) return;
    
    try {
      const response = await fetch(`/api/avaliacoes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erro ao excluir avaliação');
      }
      
      await carregarAvaliacoes(); // Recarregar lista
    } catch (error: any) {
      notifications.error('Erro ao excluir avaliação: ' + error.message);
    }
  };

  if (loading) {
    return (
      <AdminTemplate>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminTemplate>
    );
  }

  if (error) {
    return (
      <AdminTemplate>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Erro: {error}
        </div>
      </AdminTemplate>
    );
  }
  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Star className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-800">Avaliação</h1>
        </div>
      </div>

      {/* Tabela de Avaliações */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {avaliacoes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg">Nenhuma avaliação encontrada</p>
            <p className="text-sm">As avaliações aparecerão aqui quando os clientes avaliarem produtos</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  PRODUTO
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  AVALIADO EM
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  AVALIAÇÃO
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  USUÁRIO
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  COMENTÁRIO
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  AÇÕES
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {avaliacoes.map((avaliacao) => (
                <tr key={avaliacao.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    #{avaliacao.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {avaliacao.produto.nome}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">
                    {new Date(avaliacao.criadoEm).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {renderStars(avaliacao.rating)}
                      <span className="text-sm font-semibold text-gray-700">
                        {avaliacao.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <div>
                      <div className="font-medium">{avaliacao.usuario.nome}</div>
                      <div className="text-gray-500 text-xs">{avaliacao.usuario.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="max-w-xs">
                      <p className="truncate">
                        {avaliacao.comentario || 'Sem comentário'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => window.open(`/produtos/${avaliacao.produto.id}`, '_blank')}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Ver produto"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => excluirAvaliacao(avaliacao.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Excluir avaliação"
                      >
                        <Trash2 className="w-4 h-4" />
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
