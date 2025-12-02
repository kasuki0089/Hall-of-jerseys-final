'use client';
import { User, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const router = useRouter();

  // Função para verificar reCAPTCHA
  const onCaptchaChange = async (token: string | null) => {
    if (!token) {
      setCaptchaVerified(false);
      setCaptchaToken("");
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
        setCaptchaToken(token);
      } else {
        setCaptchaVerified(false);
        setCaptchaToken("");
        setError("Verificação reCAPTCHA falhou");
      }
    } catch (error) {
      console.error('Erro na verificação reCAPTCHA:', error);
      setCaptchaVerified(false);
      setCaptchaToken("");
      setError("Erro na verificação reCAPTCHA");
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
    setError("");

    // Verificar se reCAPTCHA foi completado (se chave estiver configurada)
    const needsCaptcha = !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (needsCaptcha && !captchaVerified) {
      setError("Por favor, complete a verificação reCAPTCHA");
      setLoading(false);
      return;
    }

    console.log('🔑 Tentando fazer login com:', { email, temSenha: !!password });

    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        senha: password,
        redirect: false,
      });

      console.log('📝 Resultado do signIn:', result);

      if (result?.error) {
        console.log('❌ Erro no login:', result.error);
        setError(result.error || "Email ou senha inválidos");
      } else if (result?.ok) {
        console.log('✅ Login bem-sucedido');
        // Verificar se login foi bem sucedido
        const session = await getSession();
        console.log('👤 Sessão criada:', session);
        
        if (session) {
          // Redirecionar baseado no role de usuário
          const userRole = session.user?.role?.toUpperCase();
          if (userRole === 'ADMIN') {
            console.log('👑 Redirecionando admin...');
            router.push('/adm/home');
          } else {
            console.log('👤 Redirecionando usuário...');
            router.push('/');
          }
        } else {
          setError("Erro ao criar sessão");
        }
      } else {
        setError("Erro desconhecido no login");
      }
    } catch (error) {
      console.error('💥 Erro no login:', error);
      setError("Erro interno do servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-gradient-to-br from-blue-600 to-purple-700">
      
      <div className="w-full max-w-6xl min-h-[500px] md:h-[600px] flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Seção Esquerda - Texto de Boas-vindas */}
        <div className="hidden lg:flex lg:w-[65%] bg-gradient-to-br from-blue-600 to-purple-700 text-white flex-col justify-center px-14">
          <h1 className="text-5xl xl:text-6xl font-bold leading-tight mb-6">
            Bem vindo de volta!
          </h1>
          <p className="text-xl xl:text-2xl leading-relaxed w-[85%]">
            Você pode fazer login para acessar com a sua conta existente.
          </p>
        </div>

        {/* Seção Direita - Formulário de Login */}
        <div className="w-full lg:w-[35%] bg-white flex flex-col justify-center px-8 md:px-12 py-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-10 text-gray-800">
            Entrar
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
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

            {/* reCAPTCHA */}
            {!!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
              <div className="flex justify-center">
                <div 
                  className="g-recaptcha" 
                  data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  data-callback="onCaptchaChange"
                ></div>
              </div>
            )}

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={loading || (!!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !captchaVerified)}
              className={`w-full h-12 md:h-14 ${
                loading || (!!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !captchaVerified)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-secondary hover:bg-secondary-dark hover:scale-[1.02] active:scale-[0.98]'
              } text-white rounded-2xl text-xl md:text-2xl font-semibold tracking-wide transition-all duration-300 mt-6 md:mt-8`}
            >
              {loading ? 'Entrando...' : 'Entrar'}
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
