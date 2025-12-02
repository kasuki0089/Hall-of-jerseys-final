"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import ProductCard from "@/components/ProductCard";
import ProductSearch from "@/components/ProductSearch";

type Product = {
  id: number;
  nome: string;
  preco: number;
  imagemUrl?: string;
  imagem?: string;
  time?: {
    liga?: {
      sigla: string;
    };
  };
};

type ProductsClientProps = {
  products: Product[];
};

const PRODUCTS_PER_PAGE = 16;
const LEAGUES = [
  { id: "ALL", name: "TODAS" },
  { id: "NBA", name: "NBA" },
  { id: "NFL", name: "NFL" },
  { id: "NHL", name: "NHL" },
  { id: "MLS", name: "MLS" },
];

export default function ProductsClient({ products: initialProducts }: ProductsClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  // Carregar produtos da API se não foram fornecidos
  useEffect(() => {
    if (!initialProducts || initialProducts.length === 0) {
      carregarProdutos();
    }
  }, []);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      // Buscar todos os produtos sem limite para exibição na loja
      const response = await fetch('/api/produtos?limit=1000');
      const result = await response.json();
      
      if (result.success) {
        setProducts(result.produtos || []);
      } else {
        console.error('Erro ao carregar produtos:', result.error);
        // Mostrar erro para o usuário se não conseguir carregar
        setProducts([]);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filtro por liga
    if (activeFilter !== "ALL") {
      filtered = filtered.filter(product => {
        const liga = product.time?.liga?.sigla;
        return liga === activeFilter;
      });
    }

    // Filtro por busca
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => {
        const nome = product.nome?.toLowerCase() || "";
        const liga = product.time?.liga?.sigla?.toLowerCase() || "";
        
        return nome.includes(query) || liga.includes(query);
      });
    }
    
    return filtered;
  }, [products, activeFilter, searchQuery]);

  // Função para lidar com a busca
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Resetar para primeira página quando buscar
  }, []);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <>
      {/* Barra de Pesquisa */}
      <div className="container mx-auto px-4 mb-6">
        <ProductSearch onSearch={handleSearch} />
      </div>

      {/* Filtros */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex gap-4 text-sm">
          {LEAGUES.map((league) => (
            <button
              key={league.id}
              onClick={() => handleFilterChange(league.id)}
              className={`px-4 py-2 border rounded hover:cursor-pointer transition-colors duration-200 ${
                activeFilter === league.id 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {league.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="container mx-auto px-4 mb-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Carregando produtos...</span>
          </div>
        </div>
      )}

      {/* Lista de produtos */}
      {!loading && (
        <div className="container mx-auto px-4 mb-8">
          {currentProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                {searchQuery.trim() !== "" 
                  ? `Nenhum produto encontrado para "${searchQuery}".`
                  : filteredProducts.length === 0 
                    ? `Nenhum produto encontrado para ${LEAGUES.find(l => l.id === activeFilter)?.name || 'esta categoria'}.`
                    : 'Nenhum produto encontrado.'
                }
              </p>
              <div className="flex gap-3 justify-center">
                {searchQuery.trim() !== "" && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    Limpar busca
                  </button>
                )}
                <button
                  onClick={() => {
                    handleFilterChange('ALL');
                    setSearchQuery("");
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Ver todos os produtos
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    id: product.id.toString(),
                    nome: product.nome,
                    preco: product.preco.toString(),
                    imagemUrl: product.imagemUrl || product.imagem || '/images/prodImages/placeholder.svg',
                    liga: product.time?.liga?.sigla
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Paginação */}
      {!loading && totalPages > 1 && (
        <div className="container mx-auto px-4 pb-8">
          <div className="flex justify-center">
            <div className="flex gap-2">
              {getVisiblePages().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded flex items-center justify-center text-sm ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}