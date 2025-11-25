"use client";

import { useState, useEffect, useCallback } from "react";

export default function ProductsClient({ initialProducts = [] }) {
  const [produtos, setProdutos] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  const totalPages = Math.ceil(produtos.length / productsPerPage);
  const currentProducts = produtos.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <span className="ml-2 text-gray-600">Carregando produtos...</span>
        </div>
      )}

      {/* Resultados */}
      {!loading && (
        <>
          {/* Header de resultados */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Todos os Produtos
            </h1>
            <p className="text-sm text-gray-600">
              {produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'} encontrados
            </p>
          </div>

          {/* Grid de produtos */}
          {produtos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((produto) => (
                <div key={produto.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-square bg-gray-200">
                    <img
                      src={`/images/prodImages/${produto.imagem}`}
                      alt={produto.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{produto.nome}</h3>
                    <p className="text-gray-600">{produto.time?.nome}</p>
                    <p className="text-xl font-bold text-green-600">
                      R$ {produto.preco?.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 rounded-md text-sm font-medium border ${
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}