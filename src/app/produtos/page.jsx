import MainTemplate from '../../templates/MainTemplate';
import ProductsClient from './ProductsClient';

export default function ProdutosPage() {
  return (
    <MainTemplate>
      <ProductsClient initialProducts={[]} />
    </MainTemplate>
  );
}