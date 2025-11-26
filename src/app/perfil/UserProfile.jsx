"use client";

import { useState } from "react";
import MainTemplate from "@/templates/MainTemplate/Index";
import { User, Mail, Calendar, Shield, Save } from "lucide-react";

export default function UserProfile({ session }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: session.user.name || "",
    email: session.user.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Perfil atualizado com sucesso!");
        setIsEditing(false);
      } else {
        setMessage("Erro ao atualizar perfil");
      }
    } catch (error) {
      setMessage("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainTemplate>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
              <p className="text-gray-600">Gerencie suas informações pessoais</p>
            </div>

            {/* Content */}
            <div className="p-6">
              {message && (
                <div className={`mb-4 p-3 rounded-md text-sm ${
                  message.includes("sucesso") 
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {message}
                </div>
              )}

              <div className="space-y-6">
                {/* Informações básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Informações Básicas
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome completo
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{session.user.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 py-2 flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Informações da Conta
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de conta
                      </label>
                      <div className="flex items-center">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          session.user.role === "admin"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {session.user.role === "admin" ? "Administrador" : "Cliente"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Membro desde
                      </label>
                      <p className="text-gray-900 py-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date().toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            nome: session.user.name || "",
                            email: session.user.email || "",
                          });
                        }}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? "Salvando..." : "Salvar"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Editar Perfil
                    </button>
                  )}
                </div>

                {/* Segurança */}
                <div className="pt-6 border-t border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Segurança</h2>
                  <div className="space-y-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Alterar senha
                    </button>
                    <br />
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                      Excluir conta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}