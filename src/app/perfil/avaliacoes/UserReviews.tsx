"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import ReviewListItem from "@/components/Profile/ReviewListItem";
import { Star } from "lucide-react";

type Review = {
  id: number;
  nota: number;
  comentario: string | null;
  criadoEm: string;
  produto: {
    id: number;
    nome: string;
    imagemUrl: string | null;
  };
};

export default function UserReviews() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReviews();
  }, [session]);

  const loadReviews = async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/avaliacoes?usuarioId=${session.user.id}`);
      if (!response.ok) {
        throw new Error("Erro ao carregar avaliações");
      }
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError("Erro ao carregar avaliações. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <ProfileSidebar activePage="avaliacoes" />
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Star size={32} className="text-gray-900" />
              <h1 className="text-3xl font-bold text-gray-900">Avaliações</h1>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Carregando avaliações...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <Star size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg mb-4">
                  Você ainda não tem avaliações
                </p>
                <a
                  href="/produtos"
                  className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver Produtos
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Cabeçalho da tabela */}
                <div className="grid grid-cols-4 gap-4 px-4 py-2 bg-gray-200 rounded-lg font-semibold text-gray-700 text-sm">
                  <div>ID</div>
                  <div>PRODUTO</div>
                  <div>AVALIAÇÃO</div>
                  <div>AVALIADO EM</div>
                </div>

                {/* Lista de avaliações */}
                {reviews.map((review) => (
                  <ReviewListItem
                    key={review.id}
                    id={review.id}
                    produtoNome={review.produto.nome}
                    nota={review.nota}
                    criadoEm={review.criadoEm}
                    comentario={review.comentario}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
