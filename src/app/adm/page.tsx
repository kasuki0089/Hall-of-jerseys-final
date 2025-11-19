'use client';
import { User, Lock } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import bgWallpaper from "@/public/images/banner/loginwallpaper.png";
import bgWallpaper2 from "@/public/images/banner/loginwallpaper2fhd.png";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de autenticação administrativa aqui
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative">
      {/* Background Image */}
      <Image
        src={bgWallpaper}
        alt="Background"
        fill
        className="object-cover -z-10"
        priority
      />
      
      <div className="w-full max-w-6xl min-h-[500px] md:h-[600px] flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Seção Esquerda - Texto de Boas-vindas */}
        <div className="hidden lg:flex lg:w-[65%] text-white flex-col justify-center px-14 relative">
          <Image
            src={bgWallpaper2}
            alt="Welcome Background"
            fill
            className="object-cover -z-10"
          />
          <h1 className="text-5xl xl:text-6xl font-bold leading-tight mb-6 relative z-10">
            Bem vindo de volta!
          </h1>
          <p className="text-xl xl:text-2xl leading-relaxed w-[85%] relative z-10">
            Você pode fazer login como administrador para gerenciar o sistema da Hall of Jerseys!
          </p>
        </div>

        {/* Seção Direita - Formulário de Login */}
        <div className="w-full lg:w-[35%] bg-white flex flex-col justify-center px-8 md:px-12 py-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-10 text-gray-800">
            Admin
          </h2>

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

            {/* Botão Entrar */}
            <button
              type="submit"
              className="w-full h-12 md:h-14 bg-secondary hover:bg-secondary-dark text-white rounded-2xl text-xl md:text-2xl font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-6 md:mt-8"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
