'use client';
import MainTemplate from "@/templates/MainTemplate/Index";
import { User, Mail, Phone, MapPin, Calendar, Lock, Home, Building2, Map, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

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
        .replace(/(\d{2})(\d)/, '($1) $2')
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

  // Função para verificar reCAPTCHA
  const onCaptchaChange = async (token: string | null) => {
    if (!token) {
      setCaptchaVerified(false);
      return;
    }

    try {
      const response = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCaptchaVerified(true);
      } else {
        setCaptchaVerified(false);
        setMessage("Verificação reCAPTCHA falhou");
        setSuccess(false);
      }
    } catch (error) {
      console.error('Erro na verificação reCAPTCHA:', error);
      setCaptchaVerified(false);
      setMessage("Erro na verificação reCAPTCHA");
      setSuccess(false);
    }
  };

  // Carregar reCAPTCHA quando componente montar
  useEffect(() => {
    const loadRecaptcha = () => {
      if (typeof window !== 'undefined' && window.grecaptcha) {
        window.grecaptcha.ready(() => {
          console.log('✅ reCAPTCHA carregado');
        });
      } else {
        setTimeout(loadRecaptcha, 100);
      }
    };
    
    // Definir função global para callback
    if (typeof window !== 'undefined') {
      (window as any).onCaptchaChange = onCaptchaChange;
    }
    
    loadRecaptcha();
    
    return () => {
      if (typeof window !== 'undefined') {
        (window as any).onCaptchaChange = null;
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Verificar se reCAPTCHA foi completado
    if (!captchaVerified) {
      setMessage("Por favor, complete a verificação reCAPTCHA");
      setSuccess(false);
      setLoading(false);
      return;
    }

    // Validações básicas
    if (!formData.nomeCompleto.trim()) {
      setMessage('Nome completo é obrigatório');
      setSuccess(false);
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setMessage('Email é obrigatório');
      setSuccess(false);
      setLoading(false);
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Email inválido');
      setSuccess(false);
      setLoading(false);
      return;
    }

    // Validações
    if (formData.senha !== formData.confirmarSenha) {
      setMessage('As senhas não coincidem');
      setSuccess(false);
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      setMessage('A senha deve ter pelo menos 6 caracteres');
      setSuccess(false);
      setLoading(false);
      return;
    }

    // Preparar data de nascimento
    let dataNascimento = null;
    if (formData.dataNascimento) {
      try {
        // Converter data DD/MM/AAAA para ISO
        const [dia, mes, ano] = formData.dataNascimento.split('/');
        if (dia && mes && ano && ano.length === 4) {
          dataNascimento = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia)).toISOString();
        }
      } catch (error) {
        console.error('Erro ao converter data:', error);
      }
    }

    try {
      console.log('📝 Enviando dados de cadastro...');
      const dadosEnvio = {
        nome: formData.nomeCompleto.trim(),
        email: formData.email.trim().toLowerCase(),
        senha: formData.senha,
        telefone: formData.telefone || null,
        cpf: formData.cpf || null,
        dataNascimento,
        endereco: formData.endereco ? {
          endereco: formData.endereco,
          numero: '123', // Como não tem campo número no form, usar padrão
          bairro: 'Centro', // Campo obrigatório no schema
          cidade: formData.cidade,
          cep: formData.cep.replace(/\D/g, ''), // Remove formatação
          estadoUf: formData.estado.toUpperCase().substring(0, 2) // Pega os 2 primeiros caracteres em maiúscula
        } : null
      };

      console.log('📋 Dados preparados:', dadosEnvio);

      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosEnvio),
      });

      const result = await response.json();
      console.log('📨 Resposta da API:', result);

      if (response.ok) {
        setSuccess(true);
        setMessage('Cadastro realizado com sucesso! Você já pode fazer login.');
        // Limpar formulário
        setFormData({
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
      } else {
        setSuccess(false);
        setMessage(result.error || 'Erro ao realizar cadastro');
      }
    } catch (error) {
      console.error('❌ Erro ao cadastrar:', error);
      setSuccess(false);
      setMessage('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainTemplate>
      <div className="w-full flex flex-col items-center py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full max-w-5xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 text-gray-800">
            Cadastre-se
          </h1>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="w-full">
            
            {/* Mensagem de feedback */}
            {message && (
              <div className={`mb-6 p-4 rounded-md text-center ${
                success 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}>
                {message}
              </div>
            )}

            {/* Linha 1: Nome Completo e E-mail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
              <div className="relative w-full">
                <input
                  type="text"
                  name="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                  required
                  className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400"
                  placeholder=" "
                />
                <label className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200">
                  Nome completo <span className="text-red-500">*</span>
                </label>
              </div>

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
                  className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400"
                  placeholder=" "
                />
                <label className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200">
                  CPF <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="relative w-full">
                <input
                  type="tel"
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

              <div className="relative w-full">
                <input
                  type="text"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400"
                  placeholder=" "
                />
                <label className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200">
                  Data de Nascimento <span className="text-red-500">*</span>
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
                  className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400"
                  placeholder=" "
                />
                <label className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200">
                  Endereço <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="relative w-full md:col-span-4">
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                  className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400"
                  placeholder=" "
                />
                <label className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200">
                  Cidade <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="relative w-full md:col-span-3">
                <input
                  type="text"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                  className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400"
                  placeholder=" "
                />
                <label className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200">
                  Estado <span className="text-red-500">*</span>
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
                  className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400"
                  placeholder=" "
                />
                <label className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200">
                  CEP <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="relative w-full">
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400"
                  placeholder=" "
                />
                <label className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200">
                  Senha <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="relative w-full">
                <input
                  type="password"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  required
                  className="peer w-full border-2 border-gray-300 rounded-lg bg-white px-4 py-3 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:border-gray-400"
                  placeholder=" "
                />
                <label className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-200">
                  Confirmar senha <span className="text-red-500">*</span>
                </label>
              </div>
            </div>

            {/* reCAPTCHA */}
            <div className="w-full flex justify-center mt-6">
              <div 
                className="g-recaptcha" 
                data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LchVh4sAAAAACcbs9svN3DkcbYw6G1AXAUK1gSj"}
                data-callback="onCaptchaChange"
              ></div>
            </div>

            {/* Botão de Cadastro */}
            <div className="w-full flex justify-center md:justify-end mt-8">
              <button
                type="submit"
                disabled={loading || !captchaVerified}
                className={`w-full md:w-auto px-8 md:px-12 py-3 ${
                  loading || !captchaVerified
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark hover:gap-3 shadow-lg hover:shadow-xl'
                } text-white rounded-lg text-base md:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2`}
              >
                {loading ? 'CADASTRANDO...' : 'CADASTRAR'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            </form>
          </div>

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
