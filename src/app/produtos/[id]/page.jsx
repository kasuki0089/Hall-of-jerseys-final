'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import MainTemplate from '../../../templates/MainTemplate';

export default function ProdutoDetalhes() {
  const params = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarProduto();
  }, [params.id]);

  const carregarProduto = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/produtos/${params.id}`);
      
      if (res.ok) {
        const data = await res.json();
        setProduto(data);
      } else {
        console.error('Produto não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainTemplate>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando produto...</p>
          </div>
        </div>
      </MainTemplate>
    );
  }

  if (!produto) {
    return (
      <MainTemplate>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h1>
            <Link href="/produtos" className="text-blue-600 hover:underline">
              Voltar para produtos
            </Link>
          </div>
        </div>
      </MainTemplate>
    );
  }

  return (
    <MainTemplate>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/produtos" className="text-blue-600 hover:underline flex items-center">
              Voltar para produtos
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg relative overflow-hidden">
              {produto.imagemUrl ? (
                <img
                  src={produto.imagemUrl}
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">Sem imagem</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{produto.nome}</h1>
                <p className="text-gray-600">Código: {produto.codigo}</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-gray-800">{produto.preco}</p>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                COMPRAR
              </button>

              {produto.descricao && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-3">Descrição</h2>
                  <p className="text-gray-700 leading-relaxed">{produto.descricao}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}
