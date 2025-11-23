'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard from './AdminDashboard';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulação de verificação de admin - em produção usar NextAuth
    const isAdmin = true; // Por enquanto, qualquer um pode acessar
    
    if (!isAdmin) {
      router.push('/login');
      return;
    }
    
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Verificando permissões...</div>
      </div>
    );
  }

  return <AdminDashboard />;
}
