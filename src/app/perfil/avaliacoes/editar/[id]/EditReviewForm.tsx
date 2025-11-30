"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import StarInput from "@/components/Profile/StarInput";
import { Star, ArrowLeft } from "lucide-react";

type EditReviewFormProps = {
  reviewId: string;
};

type Review = {
  id: number;
  nota: number;
  comentario: string | null;
  produto: {
    nome: string;
    imagemUrl: string | null;
  };
};

export default function EditReviewForm({ reviewId }: EditReviewFormProps) {
  const router = useRouter();
  const [review, setReview] = useState<Review | null>(null);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadReview();
  }, [reviewId]);

  const loadReview = async () => {
    try {
      const response = await fetch(`/api/avaliacoes/${reviewId}`);
      if (!response.ok) {
        throw new Error("Avaliação não encontrada");
      }
      const data = await response.json();
      setReview(data);
      setNota(data.nota);
      setComentario(data.comentario || "");
    } catch (err) {
      setError("Erro ao carregar avaliação");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nota === 0) {
      setError("Por favor, selecione uma nota");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/avaliacoes/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nota,
          comentario: comentario.trim() || null
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao atualizar avaliação");
      }

      setSuccess("Avaliação atualizada com sucesso!");
      setTimeout(() => {
        router.push("/perfil/avaliacoes");
      }, 1500);

    } catch (err: any) {
      setError(err.message || "Erro ao atualizar avaliação");
      setTimeout(() => setError(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/perfil/avaliacoes");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Avaliação não encontrada</p>
          <button
            onClick={() => router.push("/perfil/avaliacoes")}
            className="text-blue-600 hover:underline"
          >
            Voltar para avaliações
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <ProfileSidebar activePage="avaliacoes" />
        
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>

            <div className="flex items-center gap-3 mb-8">
              <Star size={32} className="text-gray-900" />
              <h1 className="text-3xl font-bold text-gray-900">Editar Avaliação</h1>
            </div>

            {/* Produto sendo avaliado */}
            <div className="bg-white rounded-lg p-6 mb-6 flex gap-4 items-center shadow-sm">
              {review.produto.imagemUrl ? (
                <img
                  src={review.produto.imagemUrl}
                  alt={review.produto.nome}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Star size={32} className="text-gray-400" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {review.produto.nome}
                </h2>
              </div>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-sm">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">{success}</p>
                </div>
              )}

              {/* Nota */}
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-900 mb-3">
                  Sua nota <span className="text-red-500">*</span>
                </label>
                <StarInput rating={nota} onRatingChange={setNota} />
              </div>

              {/* Comentário */}
              <div className="mb-8">
                <label className="block text-lg font-medium text-gray-900 mb-3">
                  Comentário (opcional)
                </label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  rows={5}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none"
                  placeholder="Compartilhe sua experiência com este produto..."
                  maxLength={1000}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {comentario.length}/1000 caracteres
                </p>
              </div>

              {/* Botões */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={saving}
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
