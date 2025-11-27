"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MainTemplate from "@/templates/MainTemplate/Index";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function TimePage() {
  const params = useParams();
  const timeSlug = params.time as string;
  const [products, setProducts] = useState<any[]>([]);
  const [timeInfo, setTimeInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔍 Buscando produtos para time:', timeSlug);
        
        // Primeiro, buscar todos os times
        const timesResponse = await fetch('/api/times');
        if (!timesResponse.ok) {
          throw new Error('Erro ao buscar times');
        }
        
        const timesData = await timesResponse.json();
        console.log('📋 Times disponíveis:', timesData.length);
        
        // Encontrar o time correspondente (comparar por sigla ou nome)
        const timeEncontrado = timesData.find((t: any) => 
          t.sigla.toLowerCase() === timeSlug.toLowerCase() || 
          t.nome.toLowerCase().replace(/\s+/g, '-') === timeSlug.toLowerCase()
        );
        
        if (!timeEncontrado) {
          console.log('❌ Time não encontrado:', timeSlug);
          setProducts([]);
          setLoading(false);
          return;
        }
        
        console.log('✅ Time encontrado:', timeEncontrado);
        setTimeInfo(timeEncontrado);
        
        // Agora buscar produtos desse time
        const response = await fetch(`/api/produtos?time=${timeEncontrado.id}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar produtos');
        }
        
        const data = await response.json();
        const timeProducts = data.produtos || [];
        console.log(`🎯 Produtos encontrados para ${timeEncontrado.nome}:`, timeProducts.length);
        
        setProducts(timeProducts);
        
      } catch (err: any) {
        console.error('❌ Erro ao carregar produtos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (timeSlug) {
      fetchProducts();
    }
  }, [timeSlug]);

  if (loading) {
    return (
      <MainTemplate>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600">Carregando produtos do time...</p>
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
            <Link href="/produtos" className="hover:text-primary transition-colors">Produtos</Link>
            <span className="mx-2">/</span>
            {timeInfo && (
              <>
                <Link href={`/liga/${timeInfo.liga?.sigla?.toLowerCase()}`} className="hover:text-primary transition-colors">
                  {timeInfo.liga?.sigla}
                </Link>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="font-semibold text-primary">{timeInfo?.nome || timeSlug}</span>
          </div>
        </div>

        {/* Título da página */}
        <div className="container mx-auto px-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {timeInfo?.nome || timeSlug}
          </h1>
          <p className="text-gray-600">
            {timeInfo && (
              <>
                Confira nossa coleção de jerseys do {timeInfo.nome} - {timeInfo.liga?.nome}. 
              </>
            )}
            {products.length} produtos disponíveis.
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
                Nenhum produto encontrado para {timeInfo?.nome || timeSlug}.
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