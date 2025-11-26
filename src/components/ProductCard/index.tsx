import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  product: {
    id: string;
    nome: string;
    preco: string;
    imagem_url: string;
    esporte?: string;
    liga?: string;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  const imagePath = product.imagem_url || '/images/produto-placeholder.jpg';
  const preco = product.preco ? `R$ ${parseFloat(product.preco).toFixed(2)}` : 'Preço não disponível';

  return (
    <Link href={`/produtos/${product.id}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="aspect-square bg-gray-200 rounded-t-lg relative overflow-hidden">
          <Image
            src={imagePath}
            alt={product.nome}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            unoptimized
          />
        </div>
        <div className="p-4">
          <p className="text-[1.005rem] font-bold text-gray-600 mb-1">{product.nome}</p>
          <p className="text-gray-600 mb-1">{product.liga || product.esporte}</p>
          <p className="text-xs text-gray-600 mb-2">Original</p>
          <p className="font-bold text-gray-800">{preco}</p>
        </div>
      </div>
    </Link>
  );
}