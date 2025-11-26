"use client";
import { useState } from "react";
import AdminTemplate from "@/templates/AdminTemplate";
import { Plus } from "lucide-react";
import AdminInput from "@/components/ADM/AdminInput";
import AdminFormButtons from "@/components/ADM/AdminFormButtons";
import FormBox from "@/components/ADM/FormBox";

export default function AdicionarAdministrador() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [poder, setPoder] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Administrador adicionado:", { nome, email, poder });
    // TODO: Implementar lógica de criação do administrador
  };

  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8 flex items-center gap-3">
        <Plus className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-800">Adicionar Administrador</h1>
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

          <AdminInput
            label="Email de acesso"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <select
              id="poder"
              name="poder"
              value={poder}
              onChange={(e) => setPoder(e.target.value)}
              className="peer w-full border-b-2 border-gray-300 bg-transparent px-0 py-2 text-gray-900 focus:border-blue-600 focus:outline-none"
              required
            >
              <option value="" disabled></option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
            </select>
            <label
              htmlFor="poder"
              className={`absolute left-0 top-2 text-gray-500 transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-blue-600 ${
                poder ? "-translate-y-6 text-sm" : ""
              }`}
            >
              Poder
            </label>
          </div>

          <AdminFormButtons
            cancelHref="/adm/administrador/gerenciarAdministradores"
            submitText="Enviar"
          />
        </form>
      </FormBox>
    </AdminTemplate>
  );
}
