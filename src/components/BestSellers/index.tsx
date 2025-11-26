import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function BestSellers() {
  let products = [];
  
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/produtos?limit=7`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      products = data.produtos || [];
    }
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }

  return (
    <section className="py-10 flex justify-center items-center">
      <div className="w-full max-w-[1750px] px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-8">
          {products.map((product: any) => {
            const imagePath = product.imagem_url || '/images/produto-placeholder.jpg';

            return (
              <article
                key={product.id}
                className="bg-gray rounded-2xl p-4 flex flex-col items-start shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative w-full h-48 rounded-xl overflow-hidden">
                  <Image
                    src={imagePath}
                    alt={product.nome}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    priority
                    unoptimized
                  />
                </div>

                <h3 className="text-sm font-medium text-gray-800 mt-3">
                  {product.nome}
                </h3>

                <div className="mt-3 text-sm text-gray-800 font-semibold">
                  R$ {product.preco ? parseFloat(product.preco).toFixed(2) : '0.00'}
                </div>

                <Link
                  href={`/produtos/${product.id}`}
                  className="mt-4 w-full flex justify-center"
                >
                  <button className="px-6 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-all">
                    Ver produto
                  </button>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
