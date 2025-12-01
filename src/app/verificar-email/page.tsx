"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MainTemplate from '@/templates/MainTemplate/Index';
import { CheckCircle, XCircle, Mail, RefreshCw } from 'lucide-react';

export default function VerificarEmail() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [reenviando, setReenviando] = useState(false);

  useEffect(() => {
    if (token) {
      verificarToken();
    } else {
      setStatus('error');
      setMessage('Token não fornecido');
    }
  }, [token]);

  const verificarToken = async () => {
    try {
      const response = await fetch(`/api/verificar-email?token=${token}`);
      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Erro ao verificar email');
    }
  };

  const reenviarEmail = async () => {
    if (!email.trim()) {
      alert('Por favor, digite seu email');
      return;
    }

    setReenviando(true);
    try {
      const response = await fetch('/api/verificar-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Erro ao reenviar email');
    } finally {
      setReenviando(false);
    }
  };

  return (
    <MainTemplate>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center">
              {status === 'loading' && (
                <RefreshCw className="h-12 w-12 text-blue-600 animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle className="h-12 w-12 text-green-600" />
              )}
              {status === 'error' && (
                <XCircle className="h-12 w-12 text-red-600" />
              )}
            </div>
            
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {status === 'loading' && 'Verificando email...'}
              {status === 'success' && 'Email verificado!'}
              {status === 'error' && 'Erro na verificação'}
            </h2>
            
            <p className="mt-2 text-sm text-gray-600">
              {message}
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Verificação concluída
                    </h3>
                    <p className="mt-2 text-sm text-green-700">
                      Sua conta foi verificada com sucesso! Agora você pode fazer login e aproveitar todas as funcionalidades da Hall of Jerseys.
                    </p>
                    <div className="mt-4">
                      <a
                        href="/login"
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        Fazer Login
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Verificação falhou
                    </h3>
                    <p className="mt-2 text-sm text-red-700">
                      {message}
                    </p>
                    
                    <div className="mt-4 space-y-3">
                      <p className="text-sm text-red-600">
                        Digite seu email para receber um novo link de verificação:
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="seu@email.com"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          onClick={reenviarEmail}
                          disabled={reenviando}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          {reenviando ? 'Enviando...' : 'Reenviar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <a
                href="/"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Voltar ao início
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}