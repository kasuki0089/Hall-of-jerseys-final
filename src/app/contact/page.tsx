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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <MainTemplate>
      <div className="w-full flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl font-semibold mb-10">Contato</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col gap-6">
          {/* Nome */}
          <div id="input-single" className="relative w-full">
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full border-b border-gray-400 focus:border-primary focus:outline-none py-2 peer"
            />
            <label className={`absolute left-0 top-2 text-sm transition-all pointer-events-none ${formData.nome ? '-translate-y-4 text-primary font-bold' : 'text-primary peer-focus:-translate-y-4 peer-focus:font-bold'}`}>
              Nome
            </label>
          </div>

          {/* Email */}
          <div id="input-single" className="relative w-full">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border-b border-gray-400 focus:border-primary focus:outline-none py-2 peer"
            />
            <label className={`absolute left-0 top-2 text-sm transition-all pointer-events-none ${formData.email ? '-translate-y-4 text-primary font-bold' : 'text-primary peer-focus:-translate-y-4 peer-focus:font-bold'}`}>
              E-mail
            </label>
          </div>

          {/* Telefone */}
          <div id="input-single" className="relative w-full">
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
              className="w-full border-b border-gray-400 focus:border-primary focus:outline-none py-2 peer"
            />
            <label className={`absolute left-0 top-2 text-sm transition-all pointer-events-none ${formData.telefone ? '-translate-y-4 text-primary font-bold' : 'text-primary peer-focus:-translate-y-4 peer-focus:font-bold'}`}>
              Telefone
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
          <div className="flex flex-col mt-4">
            <label className="font-semibold text-lg mb-2 text-primary">
              Nos diga o problema em rápidas palavras:
            </label>
            <textarea 
              name="problema"
              value={formData.problema}
              onChange={handleChange}
              className="border border-gray-400 focus:border-primary rounded-md p-3 h-40 resize-none"
            ></textarea>
          </div>

          {/* Botão */}
          <div className="w-full flex justify-center mt-6">
            <button type="submit" className="px-8 py-2 border border-primary text-primary rounded-[0.5vw] hover:bg-primary hover:text-white transition duration-300 cursor-pointer">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </MainTemplate>
  );
}
