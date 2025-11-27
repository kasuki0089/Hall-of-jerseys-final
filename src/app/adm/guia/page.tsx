"use client";
import AdminTemplate from "@/templates/AdminTemplate";
import { HelpCircle, Plus, Upload, Users, Palette, ShirtIcon } from "lucide-react";

export default function GuiaAdicionarProdutos() {
  return (
    <AdminTemplate>
      <div className="mb-8 flex items-center gap-3">
        <HelpCircle className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-800">Como Adicionar Produtos</h1>
      </div>

      <div className="grid gap-6">
        {/* Card de Introdução */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="w-6 h-6 text-blue-500" />
            Guia Completo de Adição de Produtos
          </h2>
          <p className="text-gray-600 mb-4">
            Siga este guia passo a passo para adicionar novos produtos ao sistema.
          </p>
        </div>

        {/* Passo 1: Preparação */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
            Preparação
          </h3>
          <div className="space-y-3 text-gray-700">
            <p><strong>Antes de começar, você precisará de:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Uma imagem do produto (formato JPG, PNG ou WebP)</li>
              <li>Nome do produto (ex: "Jersey Lakers Home 2024")</li>
              <li>Descrição do produto</li>
              <li>Preço do produto</li>
              <li>Código único do produto (ex: "LAL-NBA-HOME-2024-M-ROXO")</li>
            </ul>
          </div>
        </div>

        {/* Passo 2: Informações Básicas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
            Informações Básicas
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Campos Obrigatórios:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li><strong>Nome:</strong> Nome descritivo do produto</li>
                <li><strong>Código:</strong> Identificador único (sem espaços)</li>
                <li><strong>Preço:</strong> Valor em reais (ex: 279.99)</li>
                <li><strong>Liga:</strong> Selecione a liga esportiva</li>
                <li><strong>Time:</strong> Selecione o time</li>
                <li><strong>Categoria:</strong> Jersey, Regata ou Camisa</li>
                <li><strong>Ano:</strong> Agora disponível de 1990 a 2025</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Campos Opcionais:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li><strong>Descrição:</strong> Detalhes sobre o produto</li>
                <li><strong>Série:</strong> Atual temporada, Retrô ou Especial</li>
                <li><strong>Cor:</strong> Cor principal do produto</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Passo 3: Upload de Imagem */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Upload className="w-6 h-6 text-green-500" />
            Upload de Imagem
          </h3>
          <div className="space-y-3 text-gray-700">
            <p><strong>Requisitos da imagem:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Formato: JPG, PNG ou WebP</li>
              <li>Tamanho máximo: 5MB</li>
              <li>Resolução recomendada: 800x800px (quadrada)</li>
              <li>Fundo limpo e neutro</li>
            </ul>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-800 text-sm">
                💡 <strong>Dica:</strong> Use imagens com boa iluminação e que mostrem bem os detalhes do produto.
              </p>
            </div>
          </div>
        </div>

        {/* Passo 4: Tamanhos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ShirtIcon className="w-6 h-6 text-purple-500" />
            Seleção de Tamanhos
          </h3>
          <div className="space-y-3 text-gray-700">
            <p><strong>Sistema de Multi-Tamanhos:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Selecione TODOS os tamanhos disponíveis para este produto</li>
              <li>O sistema criará automaticamente um produto para cada tamanho</li>
              <li>Cada tamanho terá seu próprio código único</li>
              <li>Tamanhos disponíveis: PP, P, M, G, GG, XG, XGG</li>
            </ul>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                💡 <strong>Exemplo:</strong> Se você selecionar P, M e G, serão criados 3 produtos:
                <br />• Jersey Lakers P - Código: LAL-NBA-HOME-2024-P-ROXO
                <br />• Jersey Lakers M - Código: LAL-NBA-HOME-2024-M-ROXO  
                <br />• Jersey Lakers G - Código: LAL-NBA-HOME-2024-G-ROXO
              </p>
            </div>
          </div>
        </div>

        {/* Passo 5: Anos Disponíveis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">✨</span>
            Anos Disponíveis (NOVO!)
          </h3>
          <div className="space-y-3 text-gray-700">
            <p><strong>Range expandido de anos:</strong></p>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-yellow-800">
                📅 <strong>Agora disponível:</strong> Anos de 1990 a 2025 (35 anos de história!)
              </p>
              <p className="text-yellow-700 text-sm mt-2">
                Isso permite adicionar produtos vintage, clássicos e históricos dos esportes americanos.
              </p>
            </div>
          </div>
        </div>

        {/* Passo 6: Finalizando */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">✓</span>
            Finalizando
          </h3>
          <div className="space-y-3 text-gray-700">
            <ol className="list-decimal list-inside space-y-2">
              <li>Revise todas as informações preenchidas</li>
              <li>Verifique se a imagem foi carregada corretamente</li>
              <li>Confirme os tamanhos selecionados</li>
              <li>Clique em "Salvar Produto"</li>
              <li>Aguarde a confirmação de sucesso</li>
            </ol>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-800 text-sm">
                ✅ <strong>Após salvar:</strong> O produto estará disponível na loja e pode ser visualizado na página de produtos.
              </p>
            </div>
          </div>
        </div>

        {/* Links Úteis */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Links Úteis</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <a 
              href="/adm/produto/adicionar" 
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Adicionar Novo Produto
            </a>
            <a 
              href="/adm/produto/gerenciarProdutos" 
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Users className="w-5 h-5" />
              Gerenciar Produtos
            </a>
          </div>
        </div>
      </div>
    </AdminTemplate>
  );
}