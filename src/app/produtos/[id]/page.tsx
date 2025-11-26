import MainTemplate from "@/templates/MainTemplate/Index";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { ShoppingCart } from "lucide-react";

type ProductPageProps = {
  params: {
    id: string;
  };
};

async function getProduct(id: string) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/produtos/${id}`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return null;
  }
}

async function getRelatedProducts() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/produtos?limit=4`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.produtos || [];
    }
    return [];
  } catch (error) {
    console.error('Erro ao buscar produtos relacionados:', error);
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  const relatedProducts = await getRelatedProducts();

  if (!product) {
    return (
      <MainTemplate>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h1>
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
            <Link href="/" className="hover:text-blue-600">HALL OF JERSEYS</Link>
            <span className="mx-2">/</span>
            <Link href="/produtos" className="hover:text-blue-600">PRODUTOS</Link>
            <span className="mx-2">/</span>
            <span>{product.nome}</span>
          </div>
        </div>

        {/* Produto principal */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Imagem do produto */}
            <div className="aspect-square bg-gray-200 rounded-lg relative overflow-hidden">
              <Image
                src={product.imagemUrl || '/images/produto-placeholder.jpg'}
                alt={product.nome}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            </div>

            {/* Detalhes do produto */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.nome}</h1>
                <p className="text-gray-600">Código: #{product.codigo}</p>
                <p className="text-sm text-gray-600">{product.time?.nome} - {product.time?.liga?.nome}</p>
              </div>

              <div>
                <p className="text-gray-700 mb-4">Tamanho disponível:</p>
                <div className="flex gap-2">
                  <button className="w-12 h-12 border border-gray-300 rounded hover:border-blue-600 hover:bg-blue-50 transition-colors duration-300">
                    {product.tamanho?.nome}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-gray-700 mb-2">Cor:</p>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded border border-gray-300"
                    style={{ backgroundColor: product.cor?.codigo }}
                  ></div>
                  <span className="text-gray-700">{product.cor?.nome}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-800">R$ {product.preco?.toFixed(2)}</p>
                <p className="text-sm text-gray-600">ou 3x de R$ {(product.preco / 3)?.toFixed(2)}</p>
              </div>

              <button className="w-full flex justify-center items-center bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer">
                <ShoppingCart color="#ffffff" size={20} className="mr-3"/>COMPRAR
              </button>
            </div>
          </div>

          {/* Descrição */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">DESCRIÇÃO</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.descricao || `Jersey oficial do ${product.time?.nome} da temporada ${product.year}. ${product.modelo} de alta qualidade com tecnologia avançada para máximo conforto.`}
            </p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <strong>Time:</strong> {product.time?.nome}
              </div>
              <div>
                <strong>Liga:</strong> {product.ligue}
              </div>
              <div>
                <strong>Esporte:</strong> {product.sport}
              </div>
              <div>
                <strong>Liga:</strong> {product.time?.liga?.sigla}
              </div>
              <div>
                <strong>Ano:</strong> {product.year}
              </div>
              <div>
                <strong>Modelo:</strong> {product.modelo}
              </div>
              <div>
                <strong>Série:</strong> {product.serie || 'Home'}
              </div>
            </div>
          </div>

          {/* Produtos relacionados */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Mais produtos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct: any) => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={{
                    id: relatedProduct.id.toString(),
                    nome: relatedProduct.nome,
                    preco: relatedProduct.preco.toString(),
                    imagemUrl: relatedProduct.imagemUrl || '/images/produto-placeholder.jpg',
                    liga: relatedProduct.time?.liga?.sigla
                  }} 
                />
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
  const product = await getProduct(id);
  
  if (!product) {
    return {
      title: 'Produto não encontrado - Hall Of Jerseys',
      description: 'Produto não encontrado',
    };
  }
  
  return {
    title: `${product.nome} - Hall Of Jerseys`,
    description: product.descricao || `Jersey oficial do ${product.time?.nome}`,
  };
}