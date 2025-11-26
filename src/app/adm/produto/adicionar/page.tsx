"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminTemplate from "@/templates/AdminTemplate";
import { Plus } from "lucide-react";
import AdminInput from "@/components/ADM/AdminInput";
import AdminFormButtons from "@/components/ADM/AdminFormButtons";
import ImageUpload from "@/components/ADM/ImageUpload";
import FormBox from "@/components/ADM/FormBox";

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
  const [codigo, setCodigo] = useState("");
  const [tamanhosSelecionados, setTamanhosSelecionados] = useState<number[]>([]);
  const [imagem, setImagem] = useState<File | null>(null);
  
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

  const handleTamanhoChange = (tamanhoId: number) => {
    setTamanhosSelecionados((prev) =>
      prev.includes(tamanhoId)
        ? prev.filter((t) => t !== tamanhoId)
        : [...prev, tamanhoId]
    );
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

      // Por enquanto, vamos usar apenas o primeiro tamanho selecionado
      // TODO: Atualizar schema para suportar múltiplos tamanhos por produto
      const tamanhoId = tamanhosSelecionados[0];

      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          descricao,
          modelo: categoria || 'JERSEY',
          preco: parseFloat(preco),
          codigo,
          year: new Date().getFullYear(),
          serie: serie || null,
          ligaId: parseInt(ligaId),
          timeId: parseInt(timeId),
          corId: corId ? parseInt(corId) : null,
          tamanhoId: tamanhoId,
          estoque: 10, // Valor padrão
          imagemUrl: null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar produto');
      }

      alert('Produto criado com sucesso!');
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
              className="peer w-full border-b-2 border-gray-300 bg-transparent px-0 py-2 text-gray-900 focus:border-blue-600 focus:outline-none resize-none"
              rows={3}
              placeholder=" "
            />
            <label
              htmlFor="descricao"
              className={`absolute left-0 top-2 text-gray-500 transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-blue-600 peer-placeholder-shown:translate-y-0 ${
                descricao ? "-translate-y-6 text-sm" : ""
              }`}
            >
              Descrição (opcional)
            </label>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative">
              <select
                id="ligaId"
                name="ligaId"
                value={ligaId}
                onChange={(e) => setLigaId(e.target.value)}
                className="peer w-full border-b-2 border-gray-300 bg-transparent px-0 py-2 text-gray-900 focus:border-blue-600 focus:outline-none"
                required
              >
                <option value="" disabled></option>
                {ligas.map((liga) => (
                  <option key={liga.id} value={liga.id}>
                    {liga.sigla} - {liga.nome}
                  </option>
                ))}
              </select>
              <label
                htmlFor="ligaId"
                className={`absolute left-0 top-2 text-gray-500 transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-blue-600 ${
                  ligaId ? "-translate-y-6 text-sm" : ""
                }`}
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
                className="peer w-full border-b-2 border-gray-300 bg-transparent px-0 py-2 text-gray-900 focus:border-blue-600 focus:outline-none"
                required
                disabled={!ligaId}
              >
                <option value="" disabled></option>
                {timesFiltrados.map((time) => (
                  <option key={time.id} value={time.id}>
                    {time.nome}
                  </option>
                ))}
              </select>
              <label
                htmlFor="timeId"
                className={`absolute left-0 top-2 text-gray-500 transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-blue-600 ${
                  timeId ? "-translate-y-6 text-sm" : ""
                }`}
              >
                Time {!ligaId && "(selecione uma liga primeiro)"}
              </label>
            </div>
          </div>

          <div className="relative">
            <select
              id="categoria"
              name="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="peer w-full border-b-2 border-gray-300 bg-transparent px-0 py-2 text-gray-900 focus:border-blue-600 focus:outline-none"
              required
            >
              <option value="" disabled></option>
              <option value="JERSEY">Jersey</option>
              <option value="REGATA">Regata</option>
              <option value="CAMISA">Camisa</option>
            </select>
            <label
              htmlFor="categoria"
              className={`absolute left-0 top-2 text-gray-500 transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-blue-600 ${
                categoria ? "-translate-y-6 text-sm" : ""
              }`}
            >
              Categoria
            </label>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative">
              <select
                id="serie"
                name="serie"
                value={serie}
                onChange={(e) => setSerie(e.target.value)}
                className="peer w-full border-b-2 border-gray-300 bg-transparent px-0 py-2 text-gray-900 focus:border-blue-600 focus:outline-none"
              >
                <option value="">Nenhuma</option>
                <option value="Atual temporada">Atual temporada</option>
                <option value="Retrô">Retrô</option>
                <option value="Especial">Especial</option>
              </select>
              <label
                htmlFor="serie"
                className={`absolute left-0 top-2 text-gray-500 transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-blue-600 ${
                  serie ? "-translate-y-6 text-sm" : ""
                }`}
              >
                Série (opcional)
              </label>
            </div>

            <div className="relative">
              <select
                id="corId"
                name="corId"
                value={corId}
                onChange={(e) => setCorId(e.target.value)}
                className="peer w-full border-b-2 border-gray-300 bg-transparent px-0 py-2 text-gray-900 focus:border-blue-600 focus:outline-none"
              >
                <option value="">Selecione uma cor</option>
                {cores.map((cor) => (
                  <option key={cor.id} value={cor.id}>
                    {cor.nome}
                  </option>
                ))}
              </select>
              <label
                htmlFor="corId"
                className={`absolute left-0 top-2 text-gray-500 transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-blue-600 ${
                  corId ? "-translate-y-6 text-sm" : ""
                }`}
              >
                Cor (opcional)
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

          <ImageUpload
            label="Imagem do produto (em breve)"
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
