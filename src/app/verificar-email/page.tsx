"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainTemplate from '@/templates/MainTemplate/Index';
import { Info } from 'lucide-react';

export default function VerificarEmail() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirecionar automaticamente para login após 3 segundos
    const timer = setTimeout(() => {
      router.push('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <MainTemplate>
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg border border-blue-200 p-8 text-center">
            <div className="mb-6">
              <Info className="mx-auto h-16 w-16 text-blue-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verificação de Email Desabilitada
            </h1>
            
            <div className="text-gray-600 space-y-4 mb-6">
              <p className="leading-relaxed">
                A verificação de email foi <strong>desabilitada</strong> para facilitar o desenvolvimento local.
              </p>
              
              <p className="text-sm bg-blue-50 p-3 rounded border border-blue-200">
                <strong>ℹ️ Informação:</strong><br />
                Todos os novos usuários são automaticamente verificados e podem fazer login imediatamente.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Ir para Login
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Voltar ao Início
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              Redirecionando automaticamente em 3 segundos...
            </p>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}