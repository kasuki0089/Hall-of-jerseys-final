'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PedidoDetalhes({ params }) {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const response = await fetch(`/api/pedidos/${params.id}`);
        const data = await response.json();
        
        if (response.ok) {
          setPedido(data);
        }
      } catch (error) {
        console.error('Erro ao carregar pedido:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando pedido...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Detalhes do Pedido</h1>
        
        {pedido ? (
          <div className="space-y-4">
            <p><strong>ID:</strong> {pedido.id}</p>
            <p><strong>Total:</strong> R$ {pedido.total?.toFixed(2)}</p>
            <p><strong>Status:</strong> {pedido.status}</p>
            <p><strong>Data:</strong> {new Date(pedido.criadoEm).toLocaleDateString()}</p>
          </div>
        ) : (
          <p className="text-red-600">Pedido nao encontrado</p>
        )}

        <div className="mt-8 flex space-x-4">
          <Link
            href="/perfil"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Voltar ao Perfil
          </Link>
          <Link
            href="/produtos"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}