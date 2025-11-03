import Link from "next/link";
import Image from "next/image";
import { ProductModel } from "@/models/product/product-model";

type ProductCardProps = {
  product: ProductModel;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/produtos/${product.id}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="aspect-square bg-gray-200 rounded-t-lg mb-4 relative overflow-hidden">
          <Image
            src={product.coverImageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2 text-sm">#{product.code}</h3>
          <p className="text-xs text-gray-600 mb-1">{product.name}</p>
          <p className="text-xs text-gray-600 mb-1">Esportivo / {product.sport}</p>
          <p className="text-xs text-gray-600 mb-2">Original</p>
          <p className="font-bold text-gray-800">{product.price}</p>
        </div>
      </div>
    </Link>
  );
}