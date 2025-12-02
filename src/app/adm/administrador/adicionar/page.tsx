"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminTemplate from "@/templates/AdminTemplate";
import { Plus } from "lucide-react";
import AdminInput from "@/components/ADM/AdminInput";
import AdminFormButtons from "@/components/ADM/AdminFormButtons";
import FormBox from "@/components/ADM/FormBox";
import { notifications } from "@/components/Toast";

export default function AdicionarAdministrador() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/administradores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha, cpf: telefone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar administrador');
      }

      notifications.success('Administrador criado com sucesso!');
      router.push('/adm/administrador/gerenciarAdministradores');
    } catch (err: any) {
      setError(err.message);
      notifications.error(err.message || 'Erro ao criar administrador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8 flex items-center gap-3">
        <Plus className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-800">Adicionar Administrador</h1>
      </div>

      <FormBox>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

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

          <AdminInput
            label="Senha"
            name="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <AdminInput
            label="Telefone (opcional)"
            name="telefone"
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />

          <AdminFormButtons
            cancelHref="/adm/administrador/gerenciarAdministradores"
            submitText={loading ? "Enviando..." : "Enviar"}
          />
        </form>
      </FormBox>
    </AdminTemplate>
  );
}
