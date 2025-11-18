import Image from "next/image";
import Link from "next/link";
import React from "react";
import { JsonProductRepository } from "@/repositories/json-product-repository";
import { ProductModel } from "@/models/product/product-model";

export default async function BestSellers() {
  const repo = new JsonProductRepository();
  const products: ProductModel[] = await repo.findFirstSeven();

  return (
    <section className="py-10 flex justify-center items-center">
      <div className="w-full max-w-[1750px] px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-8">
          {products.map((product) => {
            const imagePath = product.coverImageUrl
              .replace(/^src\/public/, "")
              .replace(/^\/?images/, "/images");

            return (
              <article
                key={product.id}
                className="bg-gray rounded-2xl p-4 flex flex-col items-start shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative w-full h-48 rounded-xl overflow-hidden">
                  <Image
                    src={imagePath}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    priority
                    unoptimized
                  />
                </div>

                <h3 className="text-sm font-medium text-gray-800 mt-3">
                  {product.name}
                </h3>

                <div className="mt-3 text-sm text-gray-800 font-semibold">
                  {product.price}
                </div>

                <Link
                  href={`/products/${product.id}`}
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
