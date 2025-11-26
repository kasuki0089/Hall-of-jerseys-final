'use client';
import AdminTemplate from "@/templates/AdminTemplate";
import { Package, Edit, Trash2, Search } from "lucide-react";
import { useState, useEffect } from "react";
import AddButton from "@/components/ADM/AddButton";
import Link from "next/link";

export default function GerenciarProdutosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const res = await fetch('/api/produtos');
      const data = await res.json();
      // A API retorna { produtos: [...], pagination: {...} }
      setProdutos(Array.isArray(data) ? data : (data.produtos || []));
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const res = await fetch(`/api/produtos/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'Produto processado com sucesso!');
        carregarProdutos(); // Recarrega a lista
      } else {
        alert(data.error || 'Erro ao excluir produto');
        console.error('Erro do servidor:', data);
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro de conexão. Tente novamente.');
    }
  };

  const filteredProducts = produtos.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminTemplate>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Carregando produtos...</p>
        </div>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-800">
              Gerenciar Produtos ({filteredProducts.length})
            </h1>
          </div>
          <AddButton href="/adm/produto/adicionar" text="Adicionar produto" />
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
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800">#{product.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 uppercase">{product.nome}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{product.serie || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">R$ {parseFloat(product.preco).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center justify-center gap-3">
                      <Link href={`/adm/produto/alterar/${product.id}`} className="text-blue-500 hover:text-blue-700 transition-colors">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
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
        </div>
      </div>
    </AdminTemplate>
  );
}
