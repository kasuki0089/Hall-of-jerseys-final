import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Configuração de autenticação flexível
 * Pode ser facilmente migrada para NextAuth posteriormente
 */

// Configuração atual (bcrypt) - será substituída por NextAuth
export const authConfig = {
  type: 'credentials', // 'credentials' | 'nextauth'
  providers: {
    credentials: {
      name: 'credentials',
      async authorize(credentials) {
        return await authenticateUser(credentials.email, credentials.senha);
      }
    }
    // Futuros providers do NextAuth:
    // google: GoogleProvider({...}),
    // github: GitHubProvider({...}),
  }
};

/**
 * Autentica usuário com email e senha
 * Compatível com NextAuth credentials provider
 */
export async function authenticateUser(email, password) {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: {
        enderecos: {
          include: {
            estado: true
          }
        }
      }
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    const isValidPassword = await bcrypt.compare(password, usuario.senha);
    if (!isValidPassword) {
      throw new Error('Senha incorreta');
    }

    // Retorna dados no formato compatível com NextAuth
    return {
      id: usuario.id.toString(),
      name: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      tipo: usuario.tipo,
      enderecos: usuario.enderecos,
      // Campos adicionais para NextAuth
      image: usuario.avatar || null,
      emailVerified: usuario.emailVerificado || null,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Verifica se usuário está autenticado
 * Compatível com middleware do NextAuth
 */
export function verifyAuth(request) {
  // Implementação atual (localStorage/sessionStorage)
  if (typeof window !== 'undefined') {
    const usuario = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  // Futura implementação com NextAuth:
  // import { getToken } from "next-auth/jwt"
  // return await getToken({ req: request });
  return null;
}

/**
 * Middleware de proteção de rotas
 * Será adaptado para NextAuth middleware
 */
export function requireAuth(handler) {
  return async (req, res) => {
    try {
      const user = verifyAuth(req);
      
      if (!user) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      // Adiciona usuário ao request para uso nos handlers
      req.user = user;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
}

/**
 * Middleware para verificar permissões de admin
 */
export function requireAdmin(handler) {
  return requireAuth(async (req, res) => {
    if (req.user.tipo !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    return handler(req, res);
  });
}

/**
 * Utilitários para sessão
 * Compatíveis com NextAuth session
 */
export const sessionUtils = {
  // Implementação atual
  setSession(user, remember = false) {
    if (typeof window !== 'undefined') {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('usuario', JSON.stringify(user));
    }
  },

  getSession() {
    if (typeof window !== 'undefined') {
      const usuario = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
      return usuario ? JSON.parse(usuario) : null;
    }
    return null;
  },

  clearSession() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('usuario');
      sessionStorage.removeItem('usuario');
    }
  },

  // Futura integração com NextAuth:
  // import { useSession, signIn, signOut } from "next-auth/react"
  // useSession, signIn, signOut já serão compatíveis
};

/**
 * Hook para usar autenticação (compatível com NextAuth)
 */
export function useAuth() {
  // Implementação atual
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = sessionUtils.getSession();
    setUser(userData);
    setLoading(false);
  }, []);

  const login = async (email, password, remember = false) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password })
      });

      if (!response.ok) {
        throw new Error('Falha na autenticação');
      }

      const data = await response.json();
      sessionUtils.setSession(data.usuario, remember);
      setUser(data.usuario);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    sessionUtils.clearSession();
    setUser(null);
    // Futura implementação: await signOut({ redirect: false });
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.tipo === 'ADMIN'
  };
}

// Configurações para futura migração NextAuth
export const nextAuthConfig = {
  providers: [
    // CredentialsProvider({
    //   name: "credentials",
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Password", type: "password" }
    //   },
    //   async authorize(credentials) {
    //     return await authenticateUser(credentials.email, credentials.password);
    //   }
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tipo = user.tipo;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.tipo = token.tipo;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/cadastro',
  }
};

export default authConfig;