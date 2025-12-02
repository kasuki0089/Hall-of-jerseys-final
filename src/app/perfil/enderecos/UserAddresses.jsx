"use client";

import { useState, useEffect } from "react";
import MainTemplate from "@/templates/MainTemplate/Index";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import AddressCard from "@/components/Profile/AddressCard";
import { MapPin, Plus } from "lucide-react";

export default function UserAddresses({ session }) {
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadEnderecos();
  }, []);

  const loadEnderecos = async () => {
    try {
      const response = await fetch("/api/enderecos");
      if (response.ok) {
        const data = await response.json();
        setEnderecos(data);
      }
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este endereço?")) return;

    try {
      const response = await fetch(`/api/enderecos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("Endereço excluído com sucesso!");
        loadEnderecos();
      } else {
        setMessage("Erro ao excluir endereço");
      }
    } catch (error) {
      setMessage("Erro ao excluir endereço");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <MainTemplate>
        <div className="flex">
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
      <div className="flex bg-gray-50">
        <ProfileSidebar />

        <main className="flex-1 p-8">
          <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                MEUS ENDEREÇOS
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
              <p className="text-sm text-gray-600">
                Por favor, verifique suas informações para garantir que estejam atualizadas.
              </p>
            </div>

            {/* Add Button */}
            <div className="flex justify-end mb-6">
              <a
                href="/perfil/enderecos/adicionar"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Adicionar Endereço
              </a>
            </div>

            {/* Endereços */}
            <div className="space-y-6">
              {enderecos.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Nenhum endereço cadastrado</p>
                  <a
                    href="/perfil/enderecos/adicionar"
                    className="inline-block mt-4 text-blue-600 hover:text-blue-700"
                  >
                    Adicionar primeiro endereço
                  </a>
                </div>
              ) : (
                enderecos.map((endereco, index) => (
                  <AddressCard
                    key={endereco.id}
                    numero={index + 1}
                    logradouro={endereco.endereco}
                    numeroEndereco={endereco.numero}
                    complemento={endereco.complemento}
                    bairro={endereco.bairro}
                    cidade={endereco.cidade}
                    uf={endereco.estado?.uf || endereco.estadoUf}
                    cep={endereco.cep}
                    onEdit={() => window.location.href = `/perfil/enderecos/editar/${endereco.id}`}
                    onDelete={() => handleDelete(endereco.id)}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </MainTemplate>
  );
}
