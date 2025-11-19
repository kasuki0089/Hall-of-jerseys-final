'use client';
import { User, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulação de login - NextAuth temporariamente desabilitado
      if (email && password) {
        // Simular sucesso de login
        router.push("/");
      } else {
        setError("Email ou senha inválidos");
      }
      }
    } catch (err) {
      setError("Erro interno do servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-gradient-to-br from-primary to-primary-dark">
      
      <div className="w-full max-w-6xl min-h-[500px] md:h-[600px] flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Seção Esquerda - Texto de Boas-vindas */}
        <div className="hidden lg:flex lg:w-[65%] bg-gradient-to-br from-primary-light to-primary text-white flex-col justify-center px-14 relative">
          <h1 className="text-5xl xl:text-6xl font-bold leading-tight mb-6 relative z-10">
            Bem vindo de volta!
          </h1>
          <p className="text-xl xl:text-2xl leading-relaxed w-[85%] relative z-10">
            Você pode fazer login para acessar com a sua conta existente.
          </p>
        </div>

        {/* Seção Direita - Formulário de Login */}
        <div className="w-full lg:w-[35%] bg-white flex flex-col justify-center px-8 md:px-12 py-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-10 text-gray-800">
            Entrar
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input E-mail */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-14 pl-12 pr-4 border-2 border-gray-300 rounded-2xl text-gray-700 placeholder-gray-400 text-lg outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Input Senha */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-14 pl-12 pr-4 border-2 border-gray-300 rounded-2xl text-gray-700 placeholder-gray-400 text-lg outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Lembrar-me e Esqueceu a senha */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-secondary cursor-pointer"
                />
                <span className="text-gray-700">Lembrar-me</span>
              </label>
              
              <Link href="/recuperar-senha" className="text-gray-700 hover:text-primary transition-colors">
                Esqueceu sua senha?
              </Link>
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 md:h-14 bg-secondary hover:bg-secondary-dark text-white rounded-2xl text-xl md:text-2xl font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-6 md:mt-8 disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            {/* Link para Cadastro */}
            <div className="text-center text-sm text-gray-700 mt-4">
              Novo aqui?&nbsp;
              <Link href="/cadastro" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                Crie uma conta
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
