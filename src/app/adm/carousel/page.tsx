'use client';

import { useState, useEffect } from 'react';
import AdminTemplate from '@/templates/AdminTemplate';
import { useSession } from 'next-auth/react';
import { Trash2, Edit, Plus, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';

interface Carousel {
  id: number;
  titulo: string;
  descricao?: string;
  imagemUrl: string;
  linkUrl?: string;
  ativo: boolean;
  ordem: number;
  criadoEm: string;
  atualizadoEm: string;
}

interface FormData {
  titulo: string;
  descricao: string;
  imagemUrl: string;
  linkUrl: string;
  ativo: boolean;
  ordem: number;
}

export default function CarouselAdmin() {
  const { data: session } = useSession();
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState<Carousel | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    imagemUrl: '',
    linkUrl: '',
    ativo: true,
    ordem: 0
  });

  useEffect(() => {
    carregarCarousels();
  }, []);

  const carregarCarousels = async () => {
    try {
      const response = await fetch('/api/carousel?admin=true');
      const data = await response.json();
      setCarousels(data);
    } catch (error) {
      console.error('Erro ao carregar carousels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingCarousel 
        ? `/api/carousel/${editingCarousel.id}` 
        : '/api/carousel';
      
      const method = editingCarousel ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await carregarCarousels();
        fecharModal();
        alert(editingCarousel ? 'Carousel atualizado!' : 'Carousel criado!');
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar carousel');
    }
  };

  const deletarCarousel = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este carousel?')) return;

    try {
      const response = await fetch(`/api/carousel/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await carregarCarousels();
        alert('Carousel deletado com sucesso!');
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao deletar carousel');
    }
  };

  const toggleStatus = async (carousel: Carousel) => {
    try {
      const response = await fetch(`/api/carousel/${carousel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...carousel,
          ativo: !carousel.ativo
        }),
      });

      if (response.ok) {
        await carregarCarousels();
      } else {
        alert('Erro ao alterar status');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao alterar status');
    }
  };

  const alterarOrdem = async (carousel: Carousel, direcao: 'up' | 'down') => {
    const novaOrdem = direcao === 'up' ? carousel.ordem - 1 : carousel.ordem + 1;
    
    try {
      const response = await fetch(`/api/carousel/${carousel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...carousel,
          ordem: novaOrdem
        }),
      });

      if (response.ok) {
        await carregarCarousels();
      } else {
        alert('Erro ao alterar ordem');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao alterar ordem');
    }
  };

  const abrirModal = (carousel: Carousel | null = null) => {
    if (carousel) {
      setEditingCarousel(carousel);
      setFormData({
        titulo: carousel.titulo,
        descricao: carousel.descricao || '',
        imagemUrl: carousel.imagemUrl,
        linkUrl: carousel.linkUrl || '',
        ativo: carousel.ativo,
        ordem: carousel.ordem
      });
    } else {
      setEditingCarousel(null);
      setFormData({
        titulo: '',
        descricao: '',
        imagemUrl: '',
        linkUrl: '',
        ativo: true,
        ordem: carousels.length
      });
    }
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setEditingCarousel(null);
    setFormData({
      titulo: '',
      descricao: '',
      imagemUrl: '',
      linkUrl: '',
      ativo: true,
      ordem: 0
    });
  };

  if (loading) {
    return (
      <AdminTemplate>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Carregando...</div>
        </div>
      </AdminTemplate>
    );
  }

  return (
    <AdminTemplate>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Carousel</h1>
          <button
            onClick={() => abrirModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            Novo Carousel
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ordem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {carousels.map((carousel) => (
                <tr key={carousel.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={carousel.imagemUrl}
                      alt={carousel.titulo}
                      className="h-16 w-24 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {carousel.titulo}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {carousel.descricao || 'Sem descrição'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(carousel)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        carousel.ativo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {carousel.ativo ? (
                        <>
                          <Eye size={12} className="mr-1" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <EyeOff size={12} className="mr-1" />
                          Inativo
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900">{carousel.ordem}</span>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => alterarOrdem(carousel, 'up')}
                          className="text-gray-400 hover:text-blue-600"
                          disabled={carousel.ordem === 0}
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => alterarOrdem(carousel, 'down')}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirModal(carousel)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deletarCarousel(carousel.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {carousels.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum carousel encontrado
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCarousel ? 'Editar Carousel' : 'Novo Carousel'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL da Imagem *
                </label>
                <input
                  type="text"
                  value={formData.imagemUrl}
                  onChange={(e) => setFormData({...formData, imagemUrl: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="/images/Carousel/imagem.jpg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link URL
                </label>
                <input
                  type="text"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="/produtos ou https://exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordem
                </label>
                <input
                  type="number"
                  value={formData.ordem}
                  onChange={(e) => setFormData({...formData, ordem: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  min="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Ativo
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  {editingCarousel ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={fecharModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminTemplate>
  );
}