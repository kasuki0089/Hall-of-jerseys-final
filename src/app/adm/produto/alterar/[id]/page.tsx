"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminTemplate from "@/templates/AdminTemplate";
import { Edit } from "lucide-react";
import AdminInput from "@/components/ADM/AdminInput";
import AdminFormButtons from "@/components/ADM/AdminFormButtons";
import ImageUpload from "@/components/ADM/ImageUpload";
import FormBox from "@/components/ADM/FormBox";

export default function AlterarProduto() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [ligaId, setLigaId] = useState("");
  const [timeId, setTimeId] = useState("");
  const [corId, setCorId] = useState("");
  const [categoria, setCategoria] = useState("");
  const [serie, setSerie] = useState("");
  const [codigo, setCodigo] = useState("");
  const [tamanhosSelecionados, setTamanhosSelecionados] = useState<number[]>([]);
  const [imagem, setImagem] = useState<File | null>(null);
  const [imagemAtual, setImagemAtual] = useState<string>("");
  
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
    } else {
      setTimesFiltrados([]);
    }
  }, [ligaId, times]);

  const carregarDados = async () => {
    try {
      const [ligasRes, timesRes, coresRes, tamanhosRes, produtoRes] = await Promise.all([
        fetch('/api/ligas'),
        fetch('/api/times'),
        fetch('/api/cores'),
        fetch('/api/tamanhos'),
        fetch(`/api/produtos/${id}`)
      ]);

      const [ligasData, timesData, coresData, tamanhosData, produtoData] = await Promise.all([
        ligasRes.json(),
        timesRes.json(),
        coresRes.json(),
        tamanhosRes.json(),
        produtoRes.json()
      ]);

      // Validar se os dados são arrays
      setLigas(Array.isArray(ligasData) ? ligasData : []);
      setTimes(Array.isArray(timesData) ? timesData : []);
      setCores(Array.isArray(coresData) ? coresData : []);
      setTamanhos(Array.isArray(tamanhosData) ? tamanhosData : []);

      // Preencher dados do produto
      if (produtoData && !produtoData.error) {
        setNome(produtoData.nome);
        setDescricao(produtoData.descricao || "");
        setPreco(produtoData.preco.toString());
        setLigaId(produtoData.ligaId?.toString() || "");
        setTimeId(produtoData.timeId?.toString() || "");
        setCorId(produtoData.corId?.toString() || "");
        setCategoria(produtoData.modelo || "");
        setSerie(produtoData.serie || "");
        setCodigo(produtoData.codigo || "");
        setTamanhosSelecionados(produtoData.tamanhoId ? [produtoData.tamanhoId] : []);
        setImagemAtual(produtoData.imagemUrl || "");
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados do formulário');
    } finally {
      setLoading(false);
    }
  };

  const handleTamanhoChange = (tamanhoId: number) => {
    setTamanhosSelecionados((prev) =>
      prev.includes(tamanhoId)
        ? prev.filter((t) => t !== tamanhoId)
        : [...prev, tamanhoId]
    );
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
      if (tamanhosSelecionados.length === 0) {
        setError('Selecione pelo menos um tamanho');
        setSaving(false);
        return;
      }

      const tamanhoId = tamanhosSelecionados[0];

      let imagemUrl = imagemAtual;
      
      // Fazer upload da nova imagem se foi selecionada
      if (imagem) {
        try {
          imagemUrl = await uploadImagem(imagem);
        } catch (uploadError: any) {
          setError('Erro ao fazer upload da imagem: ' + uploadError.message);
          setSaving(false);
          return;
        }
      }

      const response = await fetch(`/api/produtos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          descricao,
          modelo: categoria || 'JERSEY',
          preco: parseFloat(preco),
          codigo,
          serie: serie || null,
          ligaId: parseInt(ligaId),
          timeId: parseInt(timeId),
          corId: corId ? parseInt(corId) : null,
          tamanhoId: tamanhoId,
          imagemUrl: imagemUrl
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar produto');
      }

      alert('Produto atualizado com sucesso!');
      router.push('/adm/produto/gerenciarProdutos');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminTemplate>
        <div className="mb-8 flex items-center gap-3">
          <Edit className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-800">Alterar produto</h1>
        </div>
        <FormBox>
          <p className="text-center text-gray-500">Carregando...</p>
        </FormBox>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8 flex items-center gap-3">
        <Edit className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-800">Alterar produto</h1>
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
                className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400"
                required
              >
                <option value="">Selecione uma liga</option>
                {ligas.map((liga) => (
                  <option key={liga.id} value={liga.id}>
                    {liga.nome}
                  </option>
                ))}
              </select>
              <label
                htmlFor="ligaId"
                className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200"
              >
                Liga
              </label>
            </div>

            <div className="relative">
              <select
                id="timeId"
                name="timeId"
                value={timeId}
                onChange={(e) => setTimeId(e.target.value)}
                className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400"
                required
                disabled={!ligaId}
              >
                <option value="">Selecione um time</option>
                {timesFiltrados.map((time) => (
                  <option key={time.id} value={time.id}>
                    {time.nome}
                  </option>
                ))}
              </select>
              <label
                htmlFor="timeId"
                className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200"
              >
                Time
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative">
              <select
                id="categoria"
                name="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400"
                required
              >
                <option value="">Selecione uma categoria</option>
                <option value="Jersey">Jersey</option>
                <option value="Camisa">Camisa</option>
                <option value="Regata">Regata</option>
              </select>
              <label
                htmlFor="categoria"
                className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200"
              >
                Categoria
              </label>
            </div>

            <div className="relative">
              <select
                id="serie"
                name="serie"
                value={serie}
                onChange={(e) => setSerie(e.target.value)}
                className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400"
              >
                <option value="">Selecione uma série</option>
                <option value="Home">🏠 Home</option>
                <option value="Away">✈️ Away</option>
                <option value="Retro">⚡ Retro</option>
              </select>
              <label
                htmlFor="serie"
                className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200"
              >
                Série
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
                className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400"
                required
              >
                <option value="">Selecione uma cor</option>
                {cores.map((cor) => (
                  <option key={cor.id} value={cor.id}>
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

            <AdminInput
              label="Código"
              name="codigo"
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tamanhos disponíveis
            </label>
            <div className="flex gap-4 flex-wrap">
              {tamanhos.map((tamanho) => (
                <label key={tamanho.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tamanhosSelecionados.includes(tamanho.id)}
                    onChange={() => handleTamanhoChange(tamanho.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{tamanho.nome}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Imagem do produto
            </label>
            {imagemAtual && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Imagem atual:</p>
                <img 
                  src={imagemAtual} 
                  alt="Imagem atual" 
                  className="w-32 h-32 object-cover border border-gray-300 rounded"
                />
              </div>
            )}
            <ImageUpload
              label="Nova imagem (opcional)"
              value={imagem}
              onChange={setImagem}
            />
          </div>

          <AdminFormButtons
            cancelHref="/adm/produto/gerenciarProdutos"
            submitText={saving ? "Salvando..." : "Atualizar Produto"}
          />
        </form>
      </FormBox>
    </AdminTemplate>
  );
}
