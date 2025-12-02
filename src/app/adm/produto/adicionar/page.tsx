"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminTemplate from "@/templates/AdminTemplate";
import { Plus } from "lucide-react";
import AdminInput from "@/components/ADM/AdminInput";
import AdminFormButtons from "@/components/ADM/AdminFormButtons";
import ImageUpload from "@/components/ADM/ImageUpload";
import FormBox from "@/components/ADM/FormBox";
import { notifications } from "@/components/Toast";

export default function AdicionarProduto() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [ligaId, setLigaId] = useState("");
  const [timeId, setTimeId] = useState("");
  const [corId, setCorId] = useState("");
  const [categoria, setCategoria] = useState("");
  const [serie, setSerie] = useState("");
  const [year, setYear] = useState("");
  const [codigo, setCodigo] = useState("");
  const [sale, setSale] = useState(false);
  const [desconto, setDesconto] = useState(0);
  const [tamanhosSelecionados, setTamanhosSelecionados] = useState<{[key: number]: number}>({});
  const [imagem, setImagem] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  
  const [ligas, setLigas] = useState<any[]>([]);
  const [times, setTimes] = useState<any[]>([]);
  const [cores, setCores] = useState<any[]>([]);
  const [tamanhos, setTamanhos] = useState<any[]>([]);
  const [timesFiltrados, setTimesFiltrados] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (ligaId) {
      const timesDaLiga = times.filter(t => t.ligaId === parseInt(ligaId));
      setTimesFiltrados(timesDaLiga);
      setTimeId(""); // Resetar time selecionado
    } else {
      setTimesFiltrados([]);
    }
  }, [ligaId, times]);

  const carregarDados = async () => {
    try {
      const [ligasRes, timesRes, coresRes, tamanhosRes] = await Promise.all([
        fetch('/api/ligas'),
        fetch('/api/times'),
        fetch('/api/cores'),
        fetch('/api/tamanhos')
      ]);

      const ligasData = await ligasRes.json();
      const timesData = await timesRes.json();
      const coresData = await coresRes.json();
      const tamanhosData = await tamanhosRes.json();

      // Validar se os dados são arrays
      setLigas(Array.isArray(ligasData) ? ligasData : []);
      setTimes(Array.isArray(timesData) ? timesData : []);
      setCores(Array.isArray(coresData) ? coresData : []);
      setTamanhos(Array.isArray(tamanhosData) ? tamanhosData : []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados do formulário');
    } finally {
      setLoading(false);
    }
  };

  const handleTamanhoChange = (tamanhoId: number, quantidade: number) => {
    setTamanhosSelecionados(prev => {
      if (quantidade <= 0) {
        const newState = { ...prev };
        delete newState[tamanhoId];
        return newState;
      }
      return {
        ...prev,
        [tamanhoId]: quantidade
      };
    });
  };

  const uploadImagem = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erro no upload da imagem');
    }

    return data.imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Validação: pelo menos um tamanho deve ser selecionado
      if (Object.keys(tamanhosSelecionados).length === 0) {
        setError('Selecione pelo menos um tamanho com estoque');
        setSaving(false);
        return;
      }

      // Validação: cor deve ser selecionada
      if (!corId) {
        setError('Selecione uma cor');
        setSaving(false);
        return;
      }

      // Preparar estoques
      const estoques = Object.entries(tamanhosSelecionados).map(([tamanhoId, quantidade]) => ({
        tamanhoId: parseInt(tamanhoId),
        quantidade: quantidade
      }));

      let imagemUrl = null;
      
      // Fazer upload da imagem se foi selecionada
      if (imagem) {
        try {
          imagemUrl = await uploadImagem(imagem);
        } catch (uploadError: any) {
          setError('Erro ao fazer upload da imagem: ' + uploadError.message);
          setSaving(false);
          return;
        }
      }

      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          descricao,
          modelo: categoria || 'Jersey Home',
          preco: parseFloat(preco),
          year: parseInt(year) || new Date().getFullYear(),
          serie: serie || 'HOME',
          codigo: codigo || `PROD-${Date.now()}`,
          ligaId: parseInt(ligaId),
          timeId: timeId ? parseInt(timeId) : null,
          corId: parseInt(corId),
          imagemUrl: imagemUrl,
          sale: sale,
          desconto: sale ? desconto : 0,
          estoques: estoques
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar produto');
      }

      notifications.success('Produto criado com sucesso!');
      router.push('/adm/produto/gerenciarProdutos');
    } catch (err: any) {
      setError(err.message);
      notifications.error(err.message || 'Erro ao criar produto');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminTemplate>
        <div className="mb-8 flex items-center gap-3">
          <Plus className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-800">Adicionar produto</h1>
        </div>
        <FormBox>
          <p className="text-center text-gray-500">Carregando...</p>
        </FormBox>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate>
      <div className="mb-8 flex items-center gap-3">
        <Plus className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-800">Adicionar produto</h1>
      </div>

      <FormBox>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="grid grid-cols-2 gap-6">
            <AdminInput
              label="Nome"
              name="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <AdminInput
              label="Preço"
              name="preco"
              type="number"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <textarea
              id="descricao"
              name="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 resize-none"
              rows={3}
              placeholder="Digite uma descrição do produto..."
            />
            <label
              htmlFor="descricao"
              className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200"
            >
              Descrição
            </label>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative">
              <select
                id="ligaId"
                name="ligaId"
                value={ligaId}
                onChange={(e) => setLigaId(e.target.value)}
                className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 cursor-pointer"
                required
              >
                <option value="" disabled className="text-gray-500">Selecione uma liga</option>
                {ligas.map((liga) => (
                  <option key={liga.id} value={liga.id} className="text-gray-900 py-2">
                    {liga.sigla} - {liga.nome}
                  </option>
                ))}
              </select>
              <label
                htmlFor="ligaId"
                className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200"
              >
                Liga *
              </label>
            </div>

            <div className="relative">
              <select
                id="timeId"
                name="timeId"
                value={timeId}
                onChange={(e) => setTimeId(e.target.value)}
                className={`peer w-full border-2 rounded-lg px-4 py-3 text-gray-900 transition-all duration-200 focus:ring-2 focus:ring-blue-200 focus:outline-none cursor-pointer ${
                  !ligaId 
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500'
                }`}
                required
                disabled={!ligaId}
              >
                <option value="" disabled className="text-gray-500">
                  {!ligaId ? 'Selecione uma liga primeiro' : 'Selecione um time'}
                </option>
                {timesFiltrados.map((time) => (
                  <option key={time.id} value={time.id} className="text-gray-900 py-2">
                    {time.nome}
                  </option>
                ))}
              </select>
              <label
                htmlFor="timeId"
                className={`absolute -top-3 left-3 bg-white px-2 text-sm font-medium transition-all duration-200 ${
                  !ligaId ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Time *
              </label>
            </div>
          </div>

          <div className="relative">
            <select
              id="categoria"
              name="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 cursor-pointer"
              required
            >
              <option value="" disabled className="text-gray-500">Selecione uma categoria</option>
              <option value="JERSEY" className="text-gray-900 py-2">Jersey</option>
              <option value="REGATA" className="text-gray-900 py-2">Regata</option>
              <option value="CAMISA" className="text-gray-900 py-2">Camisa</option>
            </select>
            <label
              htmlFor="categoria"
              className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200"
            >
              Categoria *
            </label>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative">
              <select
                id="serie"
                name="serie"
                value={serie}
                onChange={(e) => setSerie(e.target.value)}
                className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 cursor-pointer"
              >
                <option value="" className="text-gray-500">Selecione uma série (opcional)</option>
                <option value="Atual temporada" className="text-gray-900 py-2">⭐ Atual temporada</option>
                <option value="Retrô" className="text-gray-900 py-2">🕰️ Retrô</option>
                <option value="Especial" className="text-gray-900 py-2">✨ Especial</option>
              </select>
              <label
                htmlFor="serie"
                className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200"
              >
                Série
              </label>
            </div>

            <div className="relative">
              <select
                id="year"
                name="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 cursor-pointer"
                required
              >
                <option value="" disabled className="text-gray-500">Selecione o ano</option>
                {Array.from({ length: 35 }, (_, i) => new Date().getFullYear() - i).map(ano => (
                  <option key={ano} value={ano} className="text-gray-900 py-2">
                    {ano}
                  </option>
                ))}
              </select>
              <label
                htmlFor="year"
                className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200"
              >
                Ano *
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative">
              <select
                id="corId"
                name="corId"
                value={corId}
                onChange={(e) => setCorId(e.target.value)}
                className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 cursor-pointer"
              >
                <option value="" className="text-gray-500">Selecione uma cor (opcional)</option>
                {cores.map((cor) => (
                  <option key={cor.id} value={cor.id} className="text-gray-900 py-2">
                    🎨 {cor.nome}
                  </option>
                ))}
              </select>
              <label
                htmlFor="corId"
                className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200"
              >
                Cor
              </label>
            </div>
          </div>

          <AdminInput
            label="Código"
            name="codigo"
            type="number"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Estoque por tamanho
            </label>
            <div className="space-y-3">
              {tamanhos.map((tamanho) => (
                <div key={tamanho.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 w-8">{tamanho.nome}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Quantidade:</label>
                    <input
                      type="number"
                      min="0"
                      value={tamanhosSelecionados[tamanho.id] || 0}
                      onChange={(e) => handleTamanhoChange(tamanho.id, parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="0"
                    />
                  </div>
                  {tamanhosSelecionados[tamanho.id] > 0 && (
                    <span className="text-xs text-green-600">✓ Incluído</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Configure a quantidade disponível para cada tamanho. Deixe em 0 para não incluir o tamanho.
            </p>
          </div>

          {/* Campo de Promoção */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <input
                  id="sale"
                  name="sale"
                  type="checkbox"
                  checked={sale}
                  onChange={(e) => setSale(e.target.checked)}
                  className="w-5 h-5 text-red-600 bg-white border-2 border-red-300 rounded focus:ring-red-500 focus:ring-2"
                />
                <label
                  htmlFor="sale"
                  className="ml-3 text-lg font-semibold text-red-700 cursor-pointer flex items-center gap-2"
                >
                  🔥 Produto em Promoção
                </label>
              </div>
              {sale && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full border border-red-300 animate-pulse">
                  🏷️ PROMOÇÃO ATIVA
                </span>
              )}
            </div>
            
            {sale && (
              <div className="mt-4 ml-8">
                <label htmlFor="desconto" className="block text-sm font-medium text-red-700 mb-2">
                  Desconto (%)
                </label>
                <input
                  type="number"
                  id="desconto"
                  name="desconto"
                  min="0"
                  max="100"
                  value={desconto}
                  onChange={(e) => setDesconto(Number(e.target.value))}
                  className="w-24 px-3 py-2 border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="0"
                />
                <span className="ml-2 text-sm text-red-600">
                  {desconto > 0 && `${desconto}% de desconto`}
                </span>
              </div>
            )}
            
            <p className="text-sm text-red-600 mt-2 ml-8">
              Marque esta opção para destacar o produto como em promoção na loja.
              {sale && " O produto aparecerá com badge de promoção para os clientes."}
            </p>
          </div>

          <ImageUpload
            label="Imagem do produto"
            value={imagem}
            onChange={setImagem}
          />

          <AdminFormButtons
            cancelHref="/adm/produto/gerenciarProdutos"
            submitText={saving ? "Salvando..." : "Enviar"}
          />
        </form>
      </FormBox>
    </AdminTemplate>
  );
}
