"use client";
import AdminTemplate from "@/templates/AdminTemplate";
import { Star, StarHalf } from "lucide-react";

const avaliacoesData = [
  {
    id: 1,
    produto: "Regata Golden State Warriors",
    avaliadoEm: "26/11/25",
    avaliacao: 4.5,
    usuario: "Daniel Pereira",
    avaliacaoEscrita:
      "A regata do Golden State Warriors é leve, confortável e bem-acabada, ótima para treinos ou uso casual. Com nota 4.5, destaca-se pela qualidade e estilo.",
  },
  {
    id: 2,
    produto: "Camisa Chicago Bulls - Michael Jordan #23",
    avaliadoEm: "25/11/25",
    avaliacao: 5,
    usuario: "Maria Silva",
    avaliacaoEscrita:
      "Produto excelente! A qualidade do material é impecável e o design é fiel ao original. Recomendo muito!",
  },
  {
    id: 3,
    produto: "Regata Los Angeles Lakers - LeBron James #6",
    avaliadoEm: "24/11/25",
    avaliacao: 4,
    usuario: "João Santos",
    avaliacaoEscrita:
      "Boa qualidade, mas o tamanho veio um pouco menor do que esperado. No geral, é um bom produto.",
  },
];

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, index) => (
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
                AVALIAÇÃO ESCRITA
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {avaliacoesData.map((avaliacao) => (
              <tr key={avaliacao.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-800">
                  #{avaliacao.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {avaliacao.produto}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 text-center">
                  {avaliacao.avaliadoEm}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center justify-center">
                    {renderStars(avaliacao.avaliacao)}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {avaliacao.usuario}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {avaliacao.avaliacaoEscrita}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminTemplate>
  );
}
