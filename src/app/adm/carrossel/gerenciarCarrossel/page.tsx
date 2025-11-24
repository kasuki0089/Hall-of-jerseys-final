"use client";
import { useState } from "react";
import AdminTemplate from "@/templates/AdminTemplate";
import { Image as ImageIcon, Edit, Trash2 } from "lucide-react";
import AddButton from "@/components/ADM/AddButton";
import Link from "next/link";

type Slide = {
  id: number;
  nome: string;
  status: string;
};

const initialSlidesData: Slide[] = [
  { id: 1, nome: "Slide 1", status: "Ativo" },
  { id: 2, nome: "Slide 2", status: "Inativo" },
  { id: 3, nome: "Slide 3", status: "Ativo" },
];

const STATUS_COLORS: { [key: string]: string } = {
  Ativo: "bg-green-100 text-green-800",
  Inativo: "bg-gray-100 text-gray-800",
};

export default function GerenciarCarrosselPage() {
  const [slidesData, setSlidesData] = useState<Slide[]>(initialSlidesData);

  const handleStatusChange = (slideId: number, newStatus: string) => {
    setSlidesData((prev) =>
      prev.map((slide) =>
        slide.id === slideId ? { ...slide, status: newStatus } : slide
      )
    );
  };

  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar carrossel</h1>
        </div>
        <AddButton href="/adm/carrossel/adicionar" text="Adicionar carrossel" />
      </div>

      {/* Tabela de Slides */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                SLIDE
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                STATUS
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {slidesData.map((slide) => (
              <tr key={slide.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-800">#{slide.id}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{slide.nome}</td>
                <td className="px-6 py-4 text-sm">
                  <select
                    value={slide.status}
                    onChange={(e) => handleStatusChange(slide.id, e.target.value)}
                    className={`px-3 py-1.5 pr-8 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer ${
                      STATUS_COLORS[slide.status] || "bg-gray-100 text-gray-800"
                    }`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='currentColor' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.5rem center',
                    }}
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center justify-center gap-3">
                    <Link
                      href={`/adm/carrossel/alterar/${slide.id}`}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
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
