"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  nome: string;
  preco: number;
  imagemUrl?: string;
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

export default function ProductsClient({ products }: ProductsClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredProducts = useMemo(() => {
    if (activeFilter === "ALL") {
      return products;
    }
    
    const filtered = products.filter(product => {
      const liga = product.time?.liga?.sigla;
      return liga === activeFilter;
    });
    
    return filtered;
  }, [products, activeFilter]);

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
      {/* Filtros */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex gap-4 text-sm">
          {LEAGUES.map((league) => (
            <button
              key={league.id}
              onClick={() => handleFilterChange(league.id)}
              className={`px-4 py-2 border rounded hover:cursor-pointer transition-colors duration-200 ${
                activeFilter === league.id 
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" 
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {league.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de produtos 4x4 */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product: Product) => (
            <ProductCard 
              key={product.id} 
              product={{
                id: product.id.toString(),
                nome: product.nome,
                preco: product.preco.toString(),
                imagemUrl: product.imagemUrl || '/images/produto-placeholder.jpg',
                liga: product.time?.liga?.sigla
              }} 
            />
          ))}
        </div>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="container mx-auto px-4 pb-8">
          <div className="flex justify-center">
            <div className="flex gap-2">
              {/* Páginas visíveis */}
              {getVisiblePages().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded flex items-center justify-center text-sm ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              
              {/* Elipses e última página */}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-2 flex items-center text-sm">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="w-8 h-8 rounded flex items-center justify-center text-sm border border-gray-300 hover:bg-gray-100"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}