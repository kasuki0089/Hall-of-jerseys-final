'use client';
import { User, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '../../providers/AuthProvider';
import MainTemplate from '../../templates/MainTemplate';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password, rememberMe);
    
    if (result.success) {
      router.push("/");
    } else {
      setError(result.error);
    }
  };

  return (
    <MainTemplate>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Seção Esquerda - Imagem */}
        <div className="hidden lg:flex lg:w-[65%] bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
            <h1 className="text-5xl font-bold mb-6">Hall of Jerseys</h1>
            <p className="text-xl text-center max-w-md">
              Encontre as melhores camisas esportivas dos seus times favoritos
            </p>
          </div>
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

            {/* Lembrar de mim e Esqueci a senha */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-600">Lembrar de mim</span>
              </label>
              
              <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800 transition-colors">
                Esqueci a senha
              </Link>
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-lg font-semibold rounded-2xl transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            {/* Link para Cadastro */}
            <div className="text-center text-gray-600">
              Não tem uma conta?{" "}
              <Link href="/cadastro" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                Crie uma conta
              </Link>
            </div>
          </form>
        </div>
      </div>
    </MainTemplate>
  );
}
