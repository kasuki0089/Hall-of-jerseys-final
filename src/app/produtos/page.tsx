import MainTemplate from "@/templates/MainTemplate/Index";
import { JsonProductRepository } from "@/repositories/json-product-repository";
import Link from "next/link";
import { ProductModel } from "@/models/product/product-model";
import ProductCard from "@/components/ProductCard";
import ProductsClient from "./ProductsClient";

export const metadata = {
  title: "Produtos - Hall Of Jerseys",
  description: "Confira nossa coleção completa de jerseys esportivos americanos.",
};

const productRepository = new JsonProductRepository();

export default async function ProductsPage() {
  const allProducts = await productRepository.findAll();

  return (
    <MainTemplate>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">HALL OF JERSEYS</Link>
            <span className="mx-2">/</span>
            <span>Produtos</span>
          </div>
        </div>

        {/* Título da página */}
        <div className="container mx-auto px-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">PRODUTOS</h1>
          <p className="text-gray-600">Compre jerseys originais e réplicas dos times das principais ligas americanas.</p>
        </div>

        <ProductsClient products={allProducts} />
      </div>
    </MainTemplate>
  );
}