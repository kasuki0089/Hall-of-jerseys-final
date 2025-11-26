"use client";
import { useState } from "react";
import AdminTemplate from "@/templates/AdminTemplate";
import { Plus } from "lucide-react";
import AdminInput from "@/components/ADM/AdminInput";
import AdminFormButtons from "@/components/ADM/AdminFormButtons";
import ImageUpload from "@/components/ADM/ImageUpload";
import FormBox from "@/components/ADM/FormBox";

export default function AdicionarSlide() {
  const [nome, setNome] = useState("");
  const [status, setStatus] = useState("Ativo");
  const [imagem, setImagem] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Slide adicionado:", { nome, status, imagem });
    // TODO: Implementar lógica de criação do slide
  };

  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8 flex items-center gap-3">
        <Plus className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-800">Adicionar carrossel</h1>
      </div>

      <FormBox>
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <AdminInput
            label="Nome"
            name="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <div className="relative">
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="peer w-full border-b-2 border-gray-300 bg-transparent px-0 py-2 text-gray-900 focus:border-blue-600 focus:outline-none"
              required
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
            <label
              htmlFor="status"
              className={`absolute left-0 top-2 text-gray-500 transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-blue-600 ${
                status ? "-translate-y-6 text-sm" : ""
              }`}
            >
              Status
            </label>
          </div>

          <ImageUpload
            label="Imagem do produto"
            value={imagem}
            onChange={setImagem}
          />

          <AdminFormButtons
            cancelHref="/adm/carrossel/gerenciarCarrossel"
            submitText="Enviar"
          />
        </form>
      </FormBox>
    </AdminTemplate>
  );
}
