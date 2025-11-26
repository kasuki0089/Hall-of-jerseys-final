import MainTemplate from "@/templates/MainTemplate/Index";
import { JsonProductRepository } from "@/repositories/json-product-repository";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

type Props = {
  params: Promise<{ liga: string }>;
};

const productRepository = new JsonProductRepository();

// Mapeamento de nomes de ligas
const ligaNames: { [key: string]: string } = {
  'nba': 'NBA',
  'nfl': 'NFL',
  'nhl': 'NHL',
  'mls': 'MLS'
};

export default async function LigaPage({ params }: Props) {
  const { liga } = await params;
  const ligaLower = liga.toLowerCase();
  const ligaUpper = ligaNames[ligaLower] || liga.toUpperCase();
  
  // Buscar todos os produtos e filtrar pela liga (o campo no model é 'ligue')
  const allProducts = await productRepository.findAll();
  const ligaProducts = allProducts.filter(
    product => product.ligue.toLowerCase() === ligaLower
  );

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
            Confira nossa coleção de jerseys da liga {ligaUpper}. {ligaProducts.length} produtos disponíveis.
          </p>
        </div>

        {/* Conteúdo Principal */}
        <div className="container mx-auto px-4 pb-12">
          {/* Grid */}
          {ligaProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ligaProducts.map((product) => (
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
