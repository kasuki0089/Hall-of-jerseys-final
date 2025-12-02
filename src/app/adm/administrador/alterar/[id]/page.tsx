"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminTemplate from "@/templates/AdminTemplate";
import { Edit } from "lucide-react";
import AdminInput from "@/components/ADM/AdminInput";
import AdminFormButtons from "@/components/ADM/AdminFormButtons";
import FormBox from "@/components/ADM/FormBox";
import { notifications } from "@/components/Toast";

export default function AlterarAdministrador() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    carregarAdministrador();
  }, [id]);

  const carregarAdministrador = async () => {
    try {
      const response = await fetch(`/api/administradores/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar administrador');
      }

      setNome(data.nome);
      setEmail(data.email);
      setTelefone(data.telefone || '');
    } catch (err: any) {
      setError(err.message);
      notifications.error(err.message || 'Erro ao carregar administrador');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const body: any = { nome, email, cpf: telefone };
      
      // Só enviar senha se foi alterada
      if (senha) {
        body.senha = senha;
      }

      const response = await fetch(`/api/administradores/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar administrador');
      }

      notifications.success('Administrador atualizado com sucesso!');
      router.push('/adm/administrador/gerenciarAdministradores');
    } catch (err: any) {
      setError(err.message);
      notifications.error(err.message || 'Erro ao atualizar administrador');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminTemplate>
        {/* Header da Página */}
        <div className="mb-8 flex items-center gap-3">
          <Edit className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-800">Alterar Administrador</h1>
        </div>
        <FormBox>
          <p>Carregando...</p>
        </FormBox>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8 flex items-center gap-3">
        <Edit className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-800">Alterar Administrador</h1>
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
            label="Nova Senha (deixe em branco para não alterar)"
            name="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
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
            submitText={saving ? "Salvando..." : "Salvar Alterações"}
          />
        </form>
      </FormBox>
    </AdminTemplate>
  );
}
