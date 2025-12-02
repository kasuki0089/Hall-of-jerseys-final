"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/Toast";
import MainTemplate from "@/templates/MainTemplate/Index";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import ReviewSection from "@/components/ReviewSection";
import { ShoppingCart } from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { showToast } = useToast();
  const id = params.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [productSizes, setProductSizes] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [adicionandoCarrinho, setAdicionandoCarrinho] = useState(false);
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      console.log('🔄 Carregando produto ID:', id);
      
      // Buscar dados do produto
      const productResponse = await fetch(`/api/produtos/${id}`);
      let productData = null;
      if (productResponse.ok) {
        productData = await productResponse.json();
        console.log('✅ Produto carregado:', productData);
      }
      
      // Buscar tamanhos disponíveis
      const sizesResponse = await fetch(`/api/produtos/${id}/tamanhos`);
      let sizesData = null;
      if (sizesResponse.ok) {
        sizesData = await sizesResponse.json();
        console.log('✅ Tamanhos carregados:', sizesData);
      }
      
      // Buscar produtos relacionados
      const relatedResponse = await fetch('/api/produtos?limit=4');
      let relatedData = [];
      if (relatedResponse.ok) {
        const data = await relatedResponse.json();
        relatedData = data.produtos || [];
      }
      
      if (productData) {
        setProduct(productData);
        setSelectedSize(productData.tamanho);
      }
      setProductSizes(sizesData);
      setRelatedProducts(relatedData);
      
    } catch (err: any) {
      console.error('❌ Erro ao carregar dados:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = (tamanho: any) => {
    setSelectedSize(tamanho);
    if (tamanho.produtoId && tamanho.produtoId !== parseInt(id)) {
      router.push(`/produtos/${tamanho.produtoId}`);
    }
  };

  const adicionarAoCarrinho = async () => {
    if (!session) {
      showToast('Você precisa estar logado para adicionar produtos ao carrinho.', 'warning');
      router.push('/login');
      return;
    }

    if (!selectedSize?.disponivel) {
      showToast('Por favor, selecione um tamanho disponível.', 'warning');
      return;
    }

    try {
      setAdicionandoCarrinho(true);
      
      const response = await fetch('/api/carrinho', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          produtoId: product.id,
          quantidade: quantidade,
          tamanhoId: selectedSize?.id
        }),
      });

      const result = await response.json();

      if (result.success) {
        showToast('Produto adicionado ao carrinho com sucesso!', 'success');
        // Opcional: redirecionar para o carrinho
        // router.push('/carrinho');
      } else {
        showToast('Erro ao adicionar produto ao carrinho: ' + result.error, 'error');
      }
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      showToast('Erro ao adicionar produto ao carrinho. Tente novamente.', 'error');
    } finally {
      setAdicionandoCarrinho(false);
    }
  };

  if (loading) {
    return (
      <MainTemplate>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Carregando produto {id}...</p>
          </div>
        </div>
      </MainTemplate>
    );
  }

  if (error) {
    return (
      <MainTemplate>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Erro</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/produtos" className="text-blue-600 hover:text-blue-800">
              Voltar para produtos
            </Link>
          </div>
        </div>
      </MainTemplate>
    );
  }

  if (!product) {
    return (
      <MainTemplate>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h1>
            <p className="text-gray-600 mb-4">O produto ID {id} não foi encontrado.</p>
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
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    {product.time?.nome}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
                    {product.time?.liga?.nome}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Categoria</p>
                  <p className="text-gray-800">{product.modelo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Série</p>
                  <p className="text-gray-800">{product.serie || 'Standard'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Ano</p>
                  <p className="text-gray-800">{product.year}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-700 mb-4 font-medium">Tamanhos disponíveis:</p>
                <div className="flex gap-2 flex-wrap">
                  {productSizes?.tamanhosDisponiveis?.map((tamanho: any) => (
                    <button 
                      key={tamanho.id}
                      onClick={() => setSelectedSize(tamanho)}
                      className={`w-12 h-12 border rounded transition-all duration-300 font-medium ${
                        selectedSize?.id === tamanho.id
                          ? 'border-blue-600 bg-blue-50 text-blue-600 scale-110 shadow-md' 
                          : tamanho.disponivel
                          ? 'border-gray-300 hover:border-blue-600 hover:bg-blue-50 hover:scale-105'
                          : 'border-gray-200 text-gray-400'
                      }`}
                      title={`Tamanho ${tamanho.nome}${!tamanho.disponivel ? ' (Indisponível - Estoque: 0)' : ` (Estoque: ${tamanho.estoque || 'N/A'})`}`}
                    >
                      {tamanho.nome}
                    </button>
                  )) || (
                    <button className="w-12 h-12 border border-blue-600 bg-blue-50 text-blue-600 font-medium rounded scale-110 shadow-md">
                      {product.tamanho?.nome}
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Tamanho selecionado: <strong>{selectedSize?.nome || product.tamanho?.nome}</strong>
                  {selectedSize?.disponivel === false && ' (Indisponível)'}
                </p>
              </div>

              <div>
                <p className="text-gray-700 mb-2 font-medium">Cor:</p>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor: product.cor?.codigo }}
                    title={product.cor?.nome}
                  ></div>
                  <span className="text-gray-700 font-medium">{product.cor?.nome}</span>
                </div>
              </div>

              <div className="space-y-2 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-3xl font-bold text-green-800">R$ {product.preco?.toFixed(2)}</p>
                <p className="text-sm text-green-600">ou 3x de R$ {(product.preco / 3)?.toFixed(2)} sem juros</p>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <label className="text-gray-700 font-medium">Quantidade:</label>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x border-gray-300">{quantidade}</span>
                    <button
                      onClick={() => setQuantidade(Math.min(selectedSize?.estoque || 1, quantidade + 1))}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Estoque: {selectedSize?.estoque || 0} unidades
                </div>
              </div>

              <button 
                onClick={adicionarAoCarrinho}
                disabled={!selectedSize?.disponivel || adicionandoCarrinho || quantidade > (selectedSize?.estoque || 0)}
                className="w-full flex justify-center items-center bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart color="#ffffff" size={24} className="mr-3"/>
                {adicionandoCarrinho ? 'ADICIONANDO...' : 
                 !selectedSize?.disponivel ? 'PRODUTO INDISPONÍVEL' :
                 quantidade > (selectedSize?.estoque || 0) ? 'ESTOQUE INSUFICIENTE' :
                 'ADICIONAR AO CARRINHO'}
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
                <strong>Liga:</strong> {product.time?.liga?.nome}
              </div>
              <div>
                <strong>Sigla:</strong> {product.time?.liga?.sigla}
              </div>
              <div>
                <strong>Cidade:</strong> {product.time?.cidade}
              </div>
              <div>
                <strong>Ano:</strong> {product.year}
              </div>
              <div>
                <strong>Modelo:</strong> {product.modelo}
              </div>
              <div>
                <strong>Série:</strong> {product.serie || 'Standard'}
              </div>
              <div>
                <strong>Cor:</strong> {product.cor?.nome}
              </div>
            </div>
          </div>

          {/* Sistema de avaliações */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-16">
            <ReviewSection produtoId={parseInt(id)} />
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