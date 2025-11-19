'use client';
import AdminTemplate from "@/templates/AdminTemplate";
import { Package, Edit, Trash2, Plus } from "lucide-react";
import productsData from "@/db/seed/products.json";

export default function ProdutosPage() {
  const totalProducts = productsData.length;

  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-800">
            Gerenciar Produtos ({totalProducts})
          </h1>
        </div>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Adicionar produto</span>
        </button>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">NOME DO PRODUTO</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">CATEGORIA</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">PREÇO</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productsData.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800">#{product.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 uppercase">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{product.serie}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{product.price.replace('R$ ', '').replace(',', '.')}</td>
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
      </div>
    </AdminTemplate>
  );
}
