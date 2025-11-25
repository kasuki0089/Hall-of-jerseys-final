'use client';
import { User, Lock, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '../../providers/AuthProvider';
import MainTemplate from '../../templates/MainTemplate';

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: ""
  });
  const [error, setError] = useState("");
  const { register, loading } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas nÃ£o coincidem");
      return;
    }

    const result = await register({
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      senha: formData.senha,
    });

    if (result.success) {
      router.push("/login?message=Conta criada com sucesso!");
    } else {
      setError(result.error);
    }
  };

  return (
    <MainTemplate>
      <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-gradient-to-br from-secondary to-secondary-dark">
      
      <div className="w-full max-w-6xl min-h-[600px] md:h-[700px] flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl">
        
        {/* SeÃ§Ã£o Esquerda - Texto de Boas-vindas */}
        <div className="hidden lg:flex lg:w-[65%] bg-gradient-to-br from-secondary-light to-secondary text-gray-800 flex-col justify-center px-14 relative">
          <h1 className="text-5xl xl:text-6xl font-bold leading-tight mb-6 relative z-10">
            Junte-se a nÃ³s!
          </h1>
          <p className="text-xl xl:text-2xl leading-relaxed w-[85%] relative z-10">
            Crie sua conta e tenha acesso a coleÃ§Ã£o completa de jerseys esportivos americanos.
          </p>
        </div>

        {/* SeÃ§Ã£o Direita - FormulÃ¡rio de Cadastro */}
        <div className="w-full lg:w-[35%] bg-white flex flex-col justify-center px-8 md:px-12 py-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-gray-800">
            Cadastrar
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Nome */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="nome"
                placeholder="Nome completo"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full h-12 pl-12 pr-4 border-2 border-gray-300 rounded-2xl text-gray-700 placeholder-gray-400 text-lg outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Input E-mail */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-12 pl-12 pr-4 border-2 border-gray-300 rounded-2xl text-gray-700 placeholder-gray-400 text-lg outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Input Telefone */}
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="telefone"
                placeholder="Telefone (opcional)"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full h-12 pl-12 pr-4 border-2 border-gray-300 rounded-2xl text-gray-700 placeholder-gray-400 text-lg outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Input Senha */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="senha"
                placeholder="Senha"
                value={formData.senha}
                onChange={handleChange}
                required
                className="w-full h-12 pl-12 pr-4 border-2 border-gray-300 rounded-2xl text-gray-700 placeholder-gray-400 text-lg outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Input Confirmar Senha */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="confirmarSenha"
                placeholder="Confirmar senha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
                className="w-full h-12 pl-12 pr-4 border-2 border-gray-300 rounded-2xl text-gray-700 placeholder-gray-400 text-lg outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* BotÃ£o Cadastrar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 md:h-14 bg-primary hover:bg-primary-dark text-white rounded-2xl text-xl md:text-2xl font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-6 md:mt-8 disabled:opacity-50"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>

            {/* Link para Login */}
            <div className="text-center text-sm text-gray-700 mt-4">
              JÃ¡ tem uma conta?&nbsp;
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                FaÃ§a login
              </Link>
            </div>
          </form>
        </div>
      </div>
      </div>
    </MainTemplate>
  );
}

