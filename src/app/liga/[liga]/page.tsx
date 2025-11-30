"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MainTemplate from "@/templates/MainTemplate/Index";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

// Mapeamento de nomes de ligas
const ligaNames: { [key: string]: string } = {
  'nba': 'NBA',
  'nfl': 'NFL', 
  'nhl': 'NHL',
  'mls': 'MLS'
};

interface Liga {
  id: number;
  nome: string;
  sigla: string;
}

interface Time {
  id: number;
  nome: string;
  liga?: Liga;
}

interface Produto {
  id: number;
  nome: string;
  preco: string;
  imagemUrl?: string;
  time?: Time;
}

export default function LigaPage() {
  const params = useParams();
  const liga = params.liga as string;
  const [products, setProducts] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const ligaLower = liga?.toLowerCase() || '';
  const ligaUpper = ligaNames[ligaLower] || liga?.toUpperCase() || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔍 Iniciando busca para liga:', ligaUpper);
        
        // Estratégia simplificada: buscar todos os produtos e filtrar no cliente
        // Isso é mais confiável para debug
        const response = await fetch('/api/produtos');
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const allProducts = data.produtos || [];
        console.log('📦 Total de produtos:', allProducts.length);
        
        // Log dos primeiros produtos para debug
        allProducts.slice(0, 3).forEach((produto: any, index: number) => {
          console.log(`Produto ${index + 1}:`, {
            nome: produto.nome,
            time: produto.time?.nome,
            liga: produto.time?.liga?.nome,
            sigla: produto.time?.liga?.sigla
          });
        });
        
        // Filtrar produtos por liga (múltiplas estratégias)
        const ligaProducts = allProducts.filter((product: any) => {
          if (!product.time?.liga) return false;
          
          const ligaNome = product.time.liga.nome || '';
          const ligaSigla = product.time.liga.sigla || '';
          
          // Verificar tanto nome quanto sigla da liga
          const matchNome = ligaNome.toLowerCase() === ligaLower;
          const matchSigla = ligaSigla.toLowerCase() === ligaLower;
          
          return matchNome || matchSigla;
        });
        
        console.log(`🎯 Produtos filtrados para ${ligaUpper}:`, ligaProducts.length);
        console.log('Produtos encontrados:', ligaProducts.map((p: Produto) => p.nome));
        
        setProducts(ligaProducts);
        
      } catch (err: any) {
        console.error('❌ Erro ao carregar produtos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (liga) {
      fetchProducts();
    }
  }, [liga, ligaLower, ligaUpper]);

  if (loading) {
    return (
      <MainTemplate>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600">Carregando produtos da {ligaUpper}...</p>
        </div>
      </MainTemplate>
    );
  }

  if (error) {
    return (
      <MainTemplate>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Erro: {error}</p>
            <Link href="/produtos" className="text-blue-600 hover:text-blue-800">
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
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">HALL OF JERSEYS</Link>
            <span className="mx-2">/</span>
            <Link href="/produtos" className="hover:text-primary transition-colors">Ligas</Link>
            <span className="mx-2">/</span>
            <span className="font-semibold text-primary">{ligaUpper}</span>
          </div>
        </div>

        {/* Título da página */}
        <div className="container mx-auto px-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {ligaUpper}
          </h1>
          <p className="text-gray-600">
            Confira nossa coleção de jerseys da liga {ligaUpper}. {products.length} produtos disponíveis.
          </p>
        </div>

        {/* Conteúdo Principal */}
        <div className="container mx-auto px-4 pb-12">
          {/* Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 text-lg mb-4">
                Nenhum produto encontrado para a liga {ligaUpper}.
              </p>
              <Link 
                href="/produtos" 
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold"
              >
                Ver todos os produtos
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainTemplate>
  );
}
