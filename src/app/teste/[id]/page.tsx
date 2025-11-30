"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Product {
  id: number;
  nome: string;
  preco: string;
  year?: string;
  modelo?: string;
  time?: {
    nome: string;
    liga?: {
      nome: string;
    };
  };
  liga?: {
    nome: string;
  };
  imagemUrl?: string;
}

export default function TestePage() {
  const params = useParams();
  const id = params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        console.log('Carregando produto ID:', id);
        const response = await fetch(`/api/produtos/${id}`);
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Produto carregado:', data);
          setProduct(data);
        } else {
          setError(`Erro ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        console.error('Erro ao carregar:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return <div style={{padding: '20px'}}>Carregando produto {id}...</div>;
  }

  if (error) {
    return <div style={{padding: '20px', color: 'red'}}>Erro: {error}</div>;
  }

  if (!product) {
    return <div style={{padding: '20px', color: 'orange'}}>Produto não encontrado</div>;
  }

  return (
    <div style={{padding: '20px'}}>
      <h1>✅ Produto Encontrado!</h1>
      <p><strong>ID:</strong> {product.id}</p>
      <p><strong>Nome:</strong> {product.nome}</p>
      <p><strong>Preço:</strong> R$ {product.preco}</p>
      <p><strong>Time:</strong> {product.time?.nome}</p>
      <p><strong>Liga:</strong> {product.time?.liga?.nome}</p>
      <p><strong>Ano:</strong> {product.year}</p>
      <p><strong>Categoria:</strong> {product.modelo}</p>
    </div>
  );
}