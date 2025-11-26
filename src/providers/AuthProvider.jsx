'use client';

import { createContext, useContext, useState, useEffect } from 'react';

/**
 * Context de autenticação compatível com NextAuth
 * Permite migração suave para NextAuth no futuro
 */

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há sessão ativa
    checkSession();
  }, []);

  const checkSession = () => {
    try {
      const userData = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, remember = false) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Falha na autenticação');
      }

      const data = await response.json();
      
      // Salvar sessão
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('usuario', JSON.stringify(data.usuario));
      
      setUser(data.usuario);
      return { success: true, user: data.usuario };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Falha no cadastro');
      }

      const data = await response.json();
      return { success: true, user: data.usuario };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    // Limpar sessão
    localStorage.removeItem('usuario');
    sessionStorage.removeItem('usuario');
    setUser(null);
    
    // Futura implementação NextAuth:
    // await signOut({ redirect: false });
  };

  const updateUser = async (updatedData) => {
    try {
      const response = await fetch(`/api/usuarios/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar usuário');
      }

      const data = await response.json();
      
      // Atualizar sessão local
      const storage = localStorage.getItem('usuario') ? localStorage : sessionStorage;
      storage.setItem('usuario', JSON.stringify(data.usuario));
      setUser(data.usuario);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.tipo === 'ADMIN'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para usar autenticação (compatível com useSession do NextAuth)
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  
  return context;
}

/**
 * Hook para verificar se usuário está autenticado
 * Compatível com NextAuth patterns
 */
export function useSession() {
  const { user, loading } = useAuth();
  
  return {
    data: user ? { user } : null,
    status: loading ? 'loading' : user ? 'authenticated' : 'unauthenticated'
  };
}

/**
 * Componente para proteger rotas (compatível com NextAuth)
 */
export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
            <p className="text-gray-600 mb-4">Você precisa estar logado para acessar esta página.</p>
            <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Fazer Login
            </a>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}

/**
 * Componente para proteger rotas de admin
 */
export function withAdminAuth(Component) {
  return function AdminAuthenticatedComponent(props) {
    const { user, loading, isAdmin } = useAuth();
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
            <p className="text-gray-600 mb-4">Você precisa estar logado para acessar esta página.</p>
            <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Fazer Login
            </a>
          </div>
        </div>
      );
    }
    
    if (!isAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
            <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta página.</p>
            <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Voltar ao Início
            </a>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}

export default AuthProvider;