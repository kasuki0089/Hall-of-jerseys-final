'use client';
import MainTemplate from "@/templates/MainTemplate/Index";
import React, { useState } from "react";

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    motivo: "",
    problema: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar máscara no telefone
    if (name === 'telefone') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '+55 ($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    }

    setFormData({
      ...formData,
      [name]: formattedValue
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setMessage(result.message);
        // Limpar formulário
        setFormData({
          nome: "",
          email: "",
          telefone: "",
          motivo: "",
          problema: ""
        });
      } else {
        setSuccess(false);
        setMessage(result.error || 'Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setSuccess(false);
      setMessage('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainTemplate>
      <div className="w-full flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl font-semibold mb-10">Contato</h1>

        <div className="w-full max-w-xl bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Mensagem de feedback */}
          {message && (
            <div className={`p-4 rounded-md text-center ${
              success 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              {message}
            </div>
          )}

          {/* Nome */}
          <div className="relative w-full">
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400"
              placeholder=" "
            />
            <label className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200">
              Nome <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Email */}
          <div className="relative w-full">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400"
              placeholder=" "
            />
            <label className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200">
              E-mail <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Telefone */}
          <div className="relative w-full">
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
              className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400"
              placeholder=" "
            />
            <label className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200">
              Telefone <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Motivo */}
          <div className="mt-4">
            <h2 className="font-semibold text-lg text-center mb-2">
              Qual o motivo do seu contato?
            </h2>

            <div className="flex flex-col gap-2 pl-6">
              {["Compras","Vendas","Entregas","Feedback","Curriculo"].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="motivo" 
                    value={item}
                    onChange={handleChange}
                    className="accent-primary" 
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Problema */}
          <div className="relative w-full mt-4">
            <textarea 
              name="problema"
              value={formData.problema}
              onChange={handleChange}
              required
              className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400 resize-none"
              rows={5}
              placeholder=" "
            ></textarea>
            <label className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200">
              Nos diga o problema em rápidas palavras <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Botão */}
          <div className="w-full flex justify-center mt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
          </form>
        </div>
      </div>
    </MainTemplate>
  );
}
