import MainTemplate from "@/templates/MainTemplate/Index";
import { JsonProductRepository } from "@/repositories/json-product-repository";
import { ProductModel } from "@/models/product/product-model";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";

type ProductPageProps = {
  params: {
    id: string;
  };
};

const productRepository = new JsonProductRepository();

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await productRepository.findById(id);
  const relatedProducts = await productRepository.findFirstSeven();

  return (
    <MainTemplate>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">HALL OF JERSEYS</Link>
            <span className="mx-2">/</span>
            <Link href="/produtos" className="hover:text-blue-600">PRODUTOS</Link>
            <span className="mx-2">/</span>
            <span>{product.name}</span>
          </div>
        </div>

        {/* Produto principal */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Imagem do produto */}
            <div className="aspect-square bg-gray-200 rounded-lg relative overflow-hidden">
              <Image
                src={product.coverImageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Detalhes do produto */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <p className="text-gray-600">Código: #{product.code}</p>
              </div>

              <div>
                <p className="text-gray-700 mb-4">Selecione uma opção para tamanho:</p>
                <div className="flex gap-2">
                  {Array.isArray(product.size) ? (
                    product.size.map((size) => (
                      <button
                        key={size}
                        className="w-12 h-12 border border-gray-300 rounded hover:border-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        {size}
                      </button>
                    ))
                  ) : (
                    <button className="w-12 h-12 border border-gray-300 rounded hover:border-blue-600 hover:bg-blue-50 transition-colors">
                      {product.size}
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-800">{product.price}</p>
                <p className="text-sm text-gray-600">ou 3x de R$ 100,00</p>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                🛒 COMPRAR
              </button>
            </div>
          </div>

          {/* Descrição */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">DESCRIÇÃO</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <strong>Time:</strong> {product.time}
              </div>
              <div>
                <strong>Liga:</strong> {product.ligue}
              </div>
              <div>
                <strong>Esporte:</strong> {product.sport}
              </div>
              <div>
                <strong>Ano:</strong> {product.year}
              </div>
              {product.color && (
                <div>
                  <strong>Cor:</strong> {product.color}
                </div>
              )}
              <div>
                <strong>Série:</strong> {product.serie}
              </div>
            </div>
          </div>

          {/* Produtos relacionados */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Mais produtos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct: ProductModel) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await productRepository.findById(id);
  
  return {
    title: `${product.name} - Hall Of Jerseys`,
    description: product.description,
  };
}