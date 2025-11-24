"use client";
import { useState } from "react";
import AdminTemplate from "@/templates/AdminTemplate";
import { Plus } from "lucide-react";
import AdminInput from "@/components/ADM/AdminInput";
import AdminFormButtons from "@/components/ADM/AdminFormButtons";
import ImageUpload from "@/components/ADM/ImageUpload";
import FormBox from "@/components/ADM/FormBox";

const NBA_TEAMS = [
  "Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets",
  "Chicago Bulls", "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets",
  "Detroit Pistons", "Golden State Warriors", "Houston Rockets", "Indiana Pacers",
  "LA Clippers", "Los Angeles Lakers", "Memphis Grizzlies", "Miami Heat",
  "Milwaukee Bucks", "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks",
  "Oklahoma City Thunder", "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns",
  "Portland Trail Blazers", "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors",
  "Utah Jazz", "Washington Wizards"
];

export default function AdicionarProduto() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [liga, setLiga] = useState("");
  const [time, setTime] = useState("");
  const [categoria, setCategoria] = useState("");
  const [serie, setSerie] = useState("");
  const [ano, setAno] = useState("");
  const [cor, setCor] = useState("");
  const [codigo, setCodigo] = useState("");
  const [tamanhos, setTamanhos] = useState<string[]>([]);
  const [imagem, setImagem] = useState<File | null>(null);

  const handleTamanhoChange = (tamanho: string) => {
    setTamanhos((prev) =>
      prev.includes(tamanho)
        ? prev.filter((t) => t !== tamanho)
        : [...prev, tamanho]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Produto adicionado:", {
      nome,
      preco,
      liga,
      time,
      categoria,
      serie,
      ano,
      cor,
      codigo,
      tamanhos,
      imagem,
    });
    // TODO: Implementar lógica de criação do produto
  };

  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8 flex items-center gap-3">
        <Plus className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-800">Adicionar produto</h1>
      </div>

      <FormBox>
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
              type="text"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative">
              <select
                id="liga"
                name="liga"
                value={liga}
                onChange={(e) => setLiga(e.target.value)}
                className="peer w-full border-b-2 border-gray-300 bg-transparent px-0 py-2 text-gray-900 focus:border-blue-600 focus:outline-none"
                required
              >
                <option value="" disabled></option>
                <option value="NBA">NBA</option>
                <option value="NHL">NHL</option>
                <option value="NFL">NFL</option>
                <option value="MLS">MLS</option>
              </select>
              <label
                htmlFor="liga"
                className={`absolute left-0 top-2 text-gray-500 transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-blue-600 ${
                  liga ? "-translate-y-6 text-sm" : ""
                }`}
              >
                Liga
              </label>
            </div>

            <div className="relative">
              <select
                id="time"
                name="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="peer w-full border-b-2 border-gray-300 bg-transparent px-0 py-2 text-gray-900 focus:border-blue-600 focus:outline-none max-h-48 overflow-y-auto"
                required
                size={1}
              >
                <option value="" disabled></option>
                {NBA_TEAMS.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
              <label
                htmlFor="time"
                className={`absolute left-0 top-2 text-gray-500 transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-blue-600 ${
                  time ? "-translate-y-6 text-sm" : ""
                }`}
              >
                Time
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
              <option value="Regata">Regata</option>
              <option value="Camisa">Camisa</option>
              <option value="Camisa manga longa">Camisa manga longa</option>
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
                required
              >
                <option value="" disabled></option>
                <option value="Atual temporada">Atual temporada</option>
                <option value="Retrô">Retrô</option>
              </select>
              <label
                htmlFor="serie"
                className={`absolute left-0 top-2 text-gray-500 transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-blue-600 ${
                  serie ? "-translate-y-6 text-sm" : ""
                }`}
              >
                Série
              </label>
            </div>

            <div className="relative">
              <input
                type="number"
                id="ano"
                name="ano"
                list="anos-list"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                className="peer w-full border-b-2 border-gray-300 bg-transparent px-0 py-2 text-gray-900 focus:border-blue-600 focus:outline-none"
                placeholder=" "
                required
                min="1946"
                max="2030"
              />
              <datalist id="anos-list">
                {Array.from({ length: 85 }, (_, i) => 2030 - i).map((year) => (
                  <option key={year} value={year} />
                ))}
              </datalist>
              <label
                htmlFor="ano"
                className={`absolute left-0 top-2 text-gray-500 transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-blue-600 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base ${
                  ano ? "-translate-y-6 text-sm" : ""
                }`}
              >
                Ano
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tamanho
            </label>
            <div className="flex gap-4">
              {["PP", "P", "M", "G", "GG"].map((tamanho) => (
                <label key={tamanho} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tamanhos.includes(tamanho)}
                    onChange={() => handleTamanhoChange(tamanho)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{tamanho}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <AdminInput
              label="Cor"
              name="cor"
              type="text"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
              required
            />

            <AdminInput
              label="Código"
              name="codigo"
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
          </div>

          <ImageUpload
            label="Imagem do produto"
            value={imagem}
            onChange={setImagem}
          />

          <AdminFormButtons
            cancelHref="/adm/produto/gerenciarProdutos"
            submitText="Enviar"
          />
        </form>
      </FormBox>
    </AdminTemplate>
  );
}
