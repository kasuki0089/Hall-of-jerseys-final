import AdminTemplate from "@/templates/AdminTemplate";
import { LayoutDashboard } from "lucide-react";

export default function AdminHomePage() {
  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </div>
        <p className="text-gray-600">Painel de controle da Hall Of Jerseys!</p>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1 */}
        <div className="bg-white rounded-lg shadow-md p-6 h-96">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Gráfico 1</h3>
          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-500">
            Conteúdo do gráfico
          </div>
        </div>

        {/* Gráfico 2 */}
        <div className="bg-white rounded-lg shadow-md p-6 h-96">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Gráfico 2</h3>
          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-500">
            Conteúdo do gráfico
          </div>
        </div>

        {/* Gráfico 3 */}
        <div className="bg-white rounded-lg shadow-md p-6 h-96 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Gráfico 3</h3>
          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-500">
            Conteúdo do gráfico
          </div>
        </div>
      </div>
    </AdminTemplate>
  );
}
