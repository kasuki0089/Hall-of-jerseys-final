"use client";

import { useState, useEffect } from "react";
import MainTemplate from "@/templates/MainTemplate/Index";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import ProfileSection from "@/components/Profile/ProfileSection";
import ProfileInput from "@/components/Profile/ProfileInput";
import { User, Mail, Calendar, Phone, Lock } from "lucide-react";

export default function UserProfile({ session }) {
  const [userData, setUserData] = useState(null);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingGender, setIsEditingGender] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    cpf: "",
    telefone: "",
    genero: "",
    email: "",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: ""
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setFormData({
          nome: data.nome || "",
          dataNascimento: data.dataNascimento ? new Date(data.dataNascimento).toISOString().split('T')[0] : "",
          cpf: data.cpf || "",
          telefone: data.telefone || "",
          genero: data.genero || "",
          email: data.email || "",
          senhaAtual: "",
          novaSenha: "",
          confirmarSenha: ""
        });
      } else {
        const errorData = await response.json();
        console.error("Erro ao carregar dados:", errorData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDetails = async () => {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome,
          dataNascimento: formData.dataNascimento,
          cpf: formData.cpf,
          telefone: formData.telefone
        }),
      });

      if (response.ok) {
        setMessage("Dados atualizados com sucesso!");
        setIsEditingDetails(false);
        loadUserData();
      } else {
        setMessage("Erro ao atualizar dados");
      }
    } catch (error) {
      setMessage("Erro ao atualizar dados");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSaveGender = async () => {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genero: formData.genero }),
      });

      if (response.ok) {
        setMessage("Gênero atualizado com sucesso!");
        setIsEditingGender(false);
        loadUserData();
      } else {
        setMessage("Erro ao atualizar gênero");
      }
    } catch (error) {
      setMessage("Erro ao atualizar gênero");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSaveEmail = async () => {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        setMessage("Email atualizado com sucesso!");
        setIsEditingEmail(false);
        loadUserData();
      } else {
        setMessage("Erro ao atualizar email");
      }
    } catch (error) {
      setMessage("Erro ao atualizar email");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSavePassword = async () => {
    if (formData.novaSenha !== formData.confirmarSenha) {
      setMessage("As senhas não coincidem");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senhaAtual: formData.senhaAtual,
          novaSenha: formData.novaSenha
        }),
      });

      if (response.ok) {
        setMessage("Senha alterada com sucesso!");
        setIsEditingPassword(false);
        setFormData({
          ...formData,
          senhaAtual: "",
          novaSenha: "",
          confirmarSenha: ""
        });
      } else {
        const data = await response.json();
        setMessage(data.error || "Erro ao alterar senha");
      }
    } catch (error) {
      setMessage("Erro ao alterar senha");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <MainTemplate>
        <div className="flex min-h-screen">
          <ProfileSidebar />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Carregando...</p>
          </div>
        </div>
      </MainTemplate>
    );
  }

  return (
    <MainTemplate>
      <div className="flex min-h-screen bg-gray-50">
        <ProfileSidebar />

        <main className="flex-1 p-8">
          <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <User className="w-6 h-6" />
                Olá, {userData?.nome?.split(' ')[0] || session.user.name}
              </h1>
            </div>

            {/* Alert Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes("sucesso") 
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {message}
              </div>
            )}

            {/* Warning */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                MINHAS INFORMAÇÕES
              </h2>
              <p className="text-sm text-gray-600">
                Por favor, verifique suas informações para garantir que estejam atualizadas.
              </p>
            </div>

            <div className="space-y-6">
              {/* Detalhes */}
              <ProfileSection 
                title="Detalhes" 
                showEdit={!isEditingDetails}
                onEdit={() => setIsEditingDetails(true)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ProfileInput
                    label="Nome Completo"
                    name="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    readOnly={!isEditingDetails}
                    icon={<User className="w-5 h-5" />}
                  />
                  <ProfileInput
                    label="Data de Nascimento"
                    name="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                    readOnly={!isEditingDetails}
                    icon={<Calendar className="w-5 h-5" />}
                  />
                  <ProfileInput
                    label="CPF"
                    name="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    readOnly={!isEditingDetails}
                  />
                  <ProfileInput
                    label="Telefone"
                    name="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    readOnly={!isEditingDetails}
                    icon={<Phone className="w-5 h-5" />}
                  />
                </div>

                {isEditingDetails && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setIsEditingDetails(false);
                        loadUserData();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={saving}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveDetails}
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? "Salvando..." : "Salvar"}
                    </button>
                  </div>
                )}
              </ProfileSection>

              {/* Gênero */}
              <ProfileSection 
                title="Gênero"
                showEdit={!isEditingGender}
                onEdit={() => setIsEditingGender(true)}
              >
                {isEditingGender ? (
                  <>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="genero"
                          value="Masculino"
                          checked={formData.genero === "Masculino"}
                          onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">Masculino</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="genero"
                          value="Feminino"
                          checked={formData.genero === "Feminino"}
                          onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">Feminino</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="genero"
                          value="Outro"
                          checked={formData.genero === "Outro"}
                          onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">Outro</span>
                      </label>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => {
                          setIsEditingGender(false);
                          loadUserData();
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={saving}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveGender}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {saving ? "Salvando..." : "Salvar"}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-700">{formData.genero || "Não informado"}</p>
                )}
              </ProfileSection>

              {/* Detalhes de login - Email */}
              <ProfileSection 
                title="Detalhes de login"
                showEdit={!isEditingEmail}
                onEdit={() => setIsEditingEmail(true)}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <ProfileInput
                    label=""
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    readOnly={!isEditingEmail}
                    icon={<Mail className="w-5 h-5" />}
                  />
                </div>

                {isEditingEmail && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setIsEditingEmail(false);
                        loadUserData();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={saving}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveEmail}
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? "Salvando..." : "Salvar"}
                    </button>
                  </div>
                )}
              </ProfileSection>

              {/* Senha */}
              <ProfileSection 
                title="Senha"
                showEdit={!isEditingPassword}
                onEdit={() => setIsEditingPassword(true)}
              >
                {isEditingPassword ? (
                  <>
                    <div className="space-y-4">
                      <ProfileInput
                        label="Senha Atual"
                        name="senhaAtual"
                        type="password"
                        value={formData.senhaAtual}
                        onChange={(e) => setFormData({ ...formData, senhaAtual: e.target.value })}
                        icon={<Lock className="w-5 h-5" />}
                      />
                      <ProfileInput
                        label="Nova Senha"
                        name="novaSenha"
                        type="password"
                        value={formData.novaSenha}
                        onChange={(e) => setFormData({ ...formData, novaSenha: e.target.value })}
                        icon={<Lock className="w-5 h-5" />}
                      />
                      <ProfileInput
                        label="Confirmar Nova Senha"
                        name="confirmarSenha"
                        type="password"
                        value={formData.confirmarSenha}
                        onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                        icon={<Lock className="w-5 h-5" />}
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => {
                          setIsEditingPassword(false);
                          setFormData({
                            ...formData,
                            senhaAtual: "",
                            novaSenha: "",
                            confirmarSenha: ""
                          });
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={saving}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSavePassword}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {saving ? "Salvando..." : "Salvar"}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-700">*************</p>
                )}
              </ProfileSection>
            </div>
          </div>
        </main>
      </div>
    </MainTemplate>
  );
}