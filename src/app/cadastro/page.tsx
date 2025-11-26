'use client';
import MainTemplate from "@/templates/MainTemplate/Index";
import { User, Mail, Phone, MapPin, Calendar, Lock, Home, Building2, Map, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    cpf: "",
    telefone: "",
    dataNascimento: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    senha: "",
    confirmarSenha: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar máscaras
    if (name === 'cpf') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else if (name === 'telefone') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '+55 ($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    } else if (name === 'dataNascimento') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{4})\d+?$/, '$1');
    } else if (name === 'cep') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
    }

    setFormData({
      ...formData,
      [name]: formattedValue
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de cadastro aqui
    console.log(formData);
  };

  return (
    <MainTemplate>
      <div className="w-full flex flex-col items-center py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full max-w-5xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 text-gray-800 border-b-2 border-gray-800 pb-2 inline-block">
            Cadastre-se
          </h1>

          <form onSubmit={handleSubmit} className="w-full mt-8 md:mt-12">
            {/* Linha 1: Nome Completo e E-mail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
              <div className="relative w-full">
                <input
                  type="text"
                  name="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                  required
                  className="w-full border-b-2 border-gray-400 focus:border-primary focus:outline-none py-3 peer"
                />
                <label className={`absolute left-0 top-3 text-sm transition-all pointer-events-none ${formData.nomeCompleto ? '-translate-y-6 text-primary font-bold' : 'text-primary peer-focus:-translate-y-6 peer-focus:font-bold'}`}>
                  Nome completo
                </label>
              </div>

              <div className="relative w-full">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border-b-2 border-gray-400 focus:border-primary focus:outline-none py-3 peer"
                />
                <label className={`absolute left-0 top-3 text-sm transition-all pointer-events-none ${formData.email ? '-translate-y-6 text-primary font-bold' : 'text-primary peer-focus:-translate-y-6 peer-focus:font-bold'}`}>
                  E-mail
                </label>
              </div>
            </div>

            {/* Linha 2: CPF, Telefone e Data de Nascimento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
              <div className="relative w-full">
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                  maxLength={14}
                  className="w-full border-b-2 border-gray-400 focus:border-primary focus:outline-none py-3 peer"
                />
                <label className={`absolute left-0 top-3 text-sm transition-all pointer-events-none ${formData.cpf ? '-translate-y-6 text-primary font-bold' : 'text-primary peer-focus:-translate-y-6 peer-focus:font-bold'}`}>
                  CPF
                </label>
              </div>

              <div className="relative w-full">
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                  className="w-full border-b-2 border-gray-400 focus:border-primary focus:outline-none py-3 peer"
                />
                <label className={`absolute left-0 top-3 text-sm transition-all pointer-events-none ${formData.telefone ? '-translate-y-6 text-primary font-bold' : 'text-primary peer-focus:-translate-y-6 peer-focus:font-bold'}`}>
                  Telefone
                </label>
              </div>

              <div className="relative w-full">
                <input
                  type="text"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  className="w-full border-b-2 border-gray-400 focus:border-primary focus:outline-none py-3 peer"
                />
                <label className={`absolute left-0 top-3 text-sm transition-all pointer-events-none ${formData.dataNascimento ? '-translate-y-6 text-primary font-bold' : 'text-primary peer-focus:-translate-y-6 peer-focus:font-bold'}`}>
                  Data de Nascimento
                </label>
              </div>
            </div>

            {/* Linha 3: Endereço, Cidade e Estado */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-8">
              <div className="relative w-full md:col-span-5">
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                  className="w-full border-b-2 border-gray-400 focus:border-primary focus:outline-none py-3 peer"
                />
                <label className={`absolute left-0 top-3 text-sm transition-all pointer-events-none ${formData.endereco ? '-translate-y-6 text-primary font-bold' : 'text-primary peer-focus:-translate-y-6 peer-focus:font-bold'}`}>
                  Endereço
                </label>
              </div>

              <div className="relative w-full md:col-span-4">
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                  className="w-full border-b-2 border-gray-400 focus:border-primary focus:outline-none py-3 peer"
                />
                <label className={`absolute left-0 top-3 text-sm transition-all pointer-events-none ${formData.cidade ? '-translate-y-6 text-primary font-bold' : 'text-primary peer-focus:-translate-y-6 peer-focus:font-bold'}`}>
                  Cidade
                </label>
              </div>

              <div className="relative w-full md:col-span-3">
                <input
                  type="text"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                  className="w-full border-b-2 border-gray-400 focus:border-primary focus:outline-none py-3 peer"
                />
                <label className={`absolute left-0 top-3 text-sm transition-all pointer-events-none ${formData.estado ? '-translate-y-6 text-primary font-bold' : 'text-primary peer-focus:-translate-y-6 peer-focus:font-bold'}`}>
                  Estado
                </label>
              </div>
            </div>

            {/* Linha 4: CEP, Senha e Confirmar Senha */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
              <div className="relative w-full">
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  required
                  maxLength={9}
                  className="w-full border-b-2 border-gray-400 focus:border-primary focus:outline-none py-3 peer"
                />
                <label className={`absolute left-0 top-3 text-sm transition-all pointer-events-none ${formData.cep ? '-translate-y-6 text-primary font-bold' : 'text-primary peer-focus:-translate-y-6 peer-focus:font-bold'}`}>
                  CEP
                </label>
              </div>

              <div className="relative w-full">
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  className="w-full border-b-2 border-gray-400 focus:border-primary focus:outline-none py-3 peer"
                />
                <label className={`absolute left-0 top-3 text-sm transition-all pointer-events-none ${formData.senha ? '-translate-y-6 text-primary font-bold' : 'text-primary peer-focus:-translate-y-6 peer-focus:font-bold'}`}>
                  Senha
                </label>
              </div>

              <div className="relative w-full">
                <input
                  type="password"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  required
                  className="w-full border-b-2 border-gray-400 focus:border-primary focus:outline-none py-3 peer"
                />
                <label className={`absolute left-0 top-3 text-sm transition-all pointer-events-none ${formData.confirmarSenha ? '-translate-y-6 text-primary font-bold' : 'text-primary peer-focus:-translate-y-6 peer-focus:font-bold'}`}>
                  Confirmar senha
                </label>
              </div>
            </div>

            {/* Botão de Cadastro */}
            <div className="w-full flex justify-center md:justify-end mt-8">
              <button
                type="submit"
                className="w-full md:w-auto px-8 md:px-12 py-3 bg-primary text-white rounded-lg text-base md:text-lg font-semibold hover:bg-primary-dark transition-all duration-300 flex items-center justify-center gap-2 hover:gap-3 shadow-lg hover:shadow-xl"
              >
                CADASTRAR
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Link para Login */}
          <div className="text-center mt-8 text-gray-600">
            Já possui uma conta?&nbsp;
            <Link href="/login" className="text-primary hover:text-primary-dark font-semibold transition-colors underline">
              Faça login
            </Link>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}
