"use client";

import { useState, useEffect } from "react";
import MainTemplate from "@/templates/MainTemplate/Index";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import AddressInput from "@/components/Profile/AddressInput";
import { MapPin, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddAddress({ session }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [estados, setEstados] = useState([]);

  const [formData, setFormData] = useState({
    nome: "",
    logradouro: "",
    complemento: "",
    numero: "",
    cidade: "",
    uf: "",
    cep: "",
    bairro: ""
  });

  useEffect(() => {
    loadEstados();
  }, []);

  const loadEstados = async () => {
    try {
      const response = await fetch("/api/estados");
      if (response.ok) {
        const data = await response.json();
        setEstados(data);
      }
    } catch (error) {
      console.error("Erro ao carregar estados:", error);
    }
  };

  const handleCepChange = async (cep: string) => {
    setFormData({ ...formData, cep });

    // Remove caracteres não numéricos
    const cepNumerico = cep.replace(/\D/g, "");

    if (cepNumerico.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setFormData({
            ...formData,
            cep,
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            uf: data.uf || ""
          });
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/enderecos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Endereço adicionado com sucesso!");
        setTimeout(() => {
          router.push("/perfil/enderecos");
        }, 1500);
      } else {
        const data = await response.json();
        setMessage(data.error || "Erro ao adicionar endereço");
      }
    } catch (error) {
      setMessage("Erro ao adicionar endereço");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleCancel = () => {
    router.push("/perfil/enderecos");
  };

  return (
    <MainTemplate>
      <div className="flex min-h-screen bg-gray-50">
        <ProfileSidebar />

        <main className="flex-1 p-8">
          <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                ADICIONAR ENDEREÇO
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-6">
                  {/* Nome */}
                  <AddressInput
                    label="Nome"
                    name="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />

                  {/* Endereço */}
                  <AddressInput
                    label="Endereço"
                    name="logradouro"
                    value={formData.logradouro}
                    onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                    required
                  />

                  {/* Complemento e Número */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AddressInput
                      label="Complemento"
                      name="complemento"
                      value={formData.complemento}
                      onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                    />
                    <AddressInput
                      label="Número"
                      name="numero"
                      value={formData.numero}
                      onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                      required
                    />
                  </div>

                  {/* Cidade e UF */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AddressInput
                      label="Cidade"
                      name="cidade"
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                      required
                    />
                    
                    <div className="space-y-2">
                      <label className="block text-lg font-medium text-gray-900">
                        Unidade Federativa
                      </label>
                      <select
                        name="uf"
                        value={formData.uf}
                        onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      >
                        <option value="">Unidade Federativa</option>
                        {estados.map((estado: any) => (
                          <option key={estado.uf} value={estado.uf}>
                            {estado.uf} - {estado.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* CEP */}
                  <AddressInput
                    label="CEP"
                    name="cep"
                    value={formData.cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                    required
                  />

                  {/* Bairro */}
                  <AddressInput
                    label="Bairro"
                    name="bairro"
                    value={formData.bairro}
                    onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
                >
                  <Check className="w-5 h-5" />
                  {loading ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </MainTemplate>
  );
}
