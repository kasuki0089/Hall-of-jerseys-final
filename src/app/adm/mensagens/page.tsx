"use client";
import { useState, useEffect } from "react";
import AdminTemplate from "@/templates/AdminTemplate";
import { MessageSquare, Mail, Phone, Calendar, FileText } from "lucide-react";

export default function MensagensPage() {
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    carregarMensagens();
  }, []);

  const carregarMensagens = async () => {
    try {
      const response = await fetch('/api/contato');
      const data = await response.json();

      if (data.success) {
        setMensagens(data.contatos || []);
      } else {
        setError('Erro ao carregar mensagens');
      }
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      novo: "bg-blue-100 text-blue-800",
      lido: "bg-yellow-100 text-yellow-800",
      respondido: "bg-green-100 text-green-800"
    };
    
    const labels = {
      novo: "Novo",
      lido: "Lido",
      respondido: "Respondido"
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status] || styles.novo}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminTemplate>
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-800">Mensagens</h1>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">Carregando mensagens...</p>
        </div>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-800">Mensagens</h1>
        </div>
        <p className="text-gray-600">
          {mensagens.length > 0 
            ? `${mensagens.length} ${mensagens.length === 1 ? 'mensagem recebida' : 'mensagens recebidas'}`
            : 'Nenhuma mensagem recebida'}
        </p>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabela ou Estado Vazio */}
      {mensagens.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhuma mensagem ainda
          </h3>
          <p className="text-gray-500">
            As mensagens enviadas pelos usuários através do formulário de contato aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    USUÁRIO
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    EMAIL
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    TELEFONE
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    MOTIVO
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    ENVIADO EM
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    MENSAGEM
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mensagens.map((mensagem) => (
                  <tr key={mensagem.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      #{mensagem.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {mensagem.nome}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {mensagem.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {mensagem.telefone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {mensagem.telefone}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                        {mensagem.motivo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      {getStatusBadge(mensagem.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatarData(mensagem.criadoEm)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="max-w-xs truncate" title={mensagem.mensagem}>
                        {mensagem.mensagem}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminTemplate>
  );
}
