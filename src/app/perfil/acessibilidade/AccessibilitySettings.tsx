"use client";

import { useState, useEffect } from "react";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import { Settings } from "lucide-react";

export default function AccessibilitySettings() {
  const [audioDescriptionEnabled, setAudioDescriptionEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar configuração do localStorage
    const savedSetting = localStorage.getItem("audioDescriptionEnabled");
    if (savedSetting !== null) {
      setAudioDescriptionEnabled(savedSetting === "true");
    }
    setLoading(false);
  }, []);

  const handleToggle = () => {
    const newValue = !audioDescriptionEnabled;
    setAudioDescriptionEnabled(newValue);
    
    // Salvar no localStorage
    localStorage.setItem("audioDescriptionEnabled", String(newValue));

    // Aqui você pode adicionar lógica adicional, como:
    // - Enviar para API do usuário
    // - Ativar/desativar recursos de acessibilidade
    // - Mostrar notificação de confirmação
  };

  if (loading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="flex">
        <ProfileSidebar activePage="acessibilidade" />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Settings size={32} className="text-gray-900" />
              <h1 className="text-3xl font-bold text-gray-900">Acessibilidade</h1>
            </div>

            {/* Card de configuração */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Acessibilidade para surdos
                  </h2>
                  <p className="text-gray-600">
                    Ative recursos de acessibilidade para pessoas com deficiência auditiva
                  </p>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={handleToggle}
                  className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    audioDescriptionEnabled ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  role="switch"
                  aria-checked={audioDescriptionEnabled}
                  aria-label="Toggle acessibilidade para surdos"
                >
                  <span
                    className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform ${
                      audioDescriptionEnabled ? "translate-x-11" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Informação adicional quando ativado */}
              {audioDescriptionEnabled && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    ✓ Recursos de acessibilidade ativados
                  </p>
                  <p className="text-blue-700 text-sm mt-2">
                    Os recursos de acessibilidade estão ativos e serão aplicados em todo o site.
                  </p>
                </div>
              )}
            </div>

            {/* Informações adicionais */}
            <div className="mt-6 bg-gray-100 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Recursos incluídos:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Legendas automáticas em conteúdos de vídeo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Indicadores visuais para alertas sonoros</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Transcrições de áudio disponíveis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Notificações visuais em vez de sonoras</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
