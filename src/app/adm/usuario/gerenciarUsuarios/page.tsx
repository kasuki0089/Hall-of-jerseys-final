'use client';
import AdminTemplate from "@/templates/AdminTemplate";
import { Users, Search, ChevronLeft, ChevronRight, X, MapPin, Phone, Mail, Calendar, Package } from "lucide-react";
import { useState, useEffect } from "react";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  role: string;
  criadoEm: string;
  endereco: {
    endereco?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade: string;
    cep?: string;
    estado?: {
      uf: string;
    };
    estadoUf?: string;
  } | null;
  _count: {
    pedidos: number;
    avaliacoes?: number;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadUsuarios();
  }, [pagination.page]);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/usuarios?page=${pagination.page}&limit=${pagination.limit}`);
      
      if (!response.ok) {
        throw new Error("Erro ao carregar usuários");
      }
      
      const data = await response.json();
      // Filtrar apenas usuários comuns (não admins)
      const usuariosComuns = data.usuarios.filter((u: Usuario) => u.role !== 'admin');
      setUsuarios(usuariosComuns);
      setPagination({
        ...data.pagination,
        total: usuariosComuns.length
      });
    } catch (err) {
      setError("Erro ao carregar usuários. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (userId: number) => {
    try {
      const response = await fetch(`/api/usuarios/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setSelectedUser(userData);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes do usuário:", error);
    }
  };

  const filteredUsers = usuarios.filter(user =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatPhone = (phone: string | null) => {
    if (!phone) return '-';
    return phone;
  };

  return (
    <AdminTemplate>
      {/* Header da Página */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-800">Gerenciar Usuários</h1>
          </div>
          <div className="text-sm text-gray-600">
            Total: {filteredUsers.length} usuários
          </div>
        </div>

        {/* Campo de Pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Carregando usuários...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Tabela de Usuários */}
      {!loading && !error && (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">USUÁRIO</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">E-MAIL</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">TELEFONE</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">LOCALIZAÇÃO</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">PEDIDOS</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">DATA CADASTRO</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-800">#{user.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        <div className="font-medium">{user.nome}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-800 text-center">
                        {formatPhone(user.telefone)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 text-center">
                        {user.endereco ? `${user.endereco.cidade} - ${user.endereco.estado?.uf || user.endereco.estadoUf || ''}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold">
                          {user._count.pedidos}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 text-center">
                        {formatDate(user.criadoEm)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => handleViewDetails(user.id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                          >
                            Ver Detalhes
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {pagination.pages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Página {pagination.page} de {pagination.pages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Próxima
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de Detalhes do Usuário */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Detalhes do Usuário</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-6">
              {/* Informações Pessoais */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Informações Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">ID</label>
                    <p className="text-gray-800">#{selectedUser.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nome Completo</label>
                    <p className="text-gray-800">{selectedUser.nome}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      E-mail
                    </label>
                    <p className="text-gray-800">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Telefone
                    </label>
                    <p className="text-gray-800">{formatPhone(selectedUser.telefone)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Data de Cadastro
                    </label>
                    <p className="text-gray-800">{formatDate(selectedUser.criadoEm)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      Total de Pedidos
                    </label>
                    <p className="text-gray-800">{selectedUser._count.pedidos} pedido(s)</p>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              {selectedUser.endereco && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Endereço
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-gray-800">
                      <span className="font-medium">Logradouro:</span> {selectedUser.endereco.endereco}, {selectedUser.endereco.numero}
                    </p>
                    {selectedUser.endereco.complemento && (
                      <p className="text-gray-800">
                        <span className="font-medium">Complemento:</span> {selectedUser.endereco.complemento}
                      </p>
                    )}
                    <p className="text-gray-800">
                      <span className="font-medium">Bairro:</span> {selectedUser.endereco.bairro}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-medium">Cidade:</span> {selectedUser.endereco.cidade} - {selectedUser.endereco.estado?.uf || selectedUser.endereco.estadoUf || ''}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-medium">CEP:</span> {selectedUser.endereco.cep}
                    </p>
                  </div>
                </div>
              )}

              {!selectedUser.endereco && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">Este usuário ainda não cadastrou um endereço.</p>
                </div>
              )}

              {/* Estatísticas */}
              {selectedUser._count.avaliacoes !== undefined && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-blue-600">{selectedUser._count.pedidos}</p>
                      <p className="text-sm text-gray-600 mt-1">Pedidos Realizados</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-green-600">{selectedUser._count.avaliacoes}</p>
                      <p className="text-sm text-gray-600 mt-1">Avaliações Feitas</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer do Modal */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminTemplate>
  );
}
