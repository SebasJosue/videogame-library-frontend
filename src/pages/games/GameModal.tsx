import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { Game, Comment } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { ThumbsUp, MessageCircle, X, Star } from 'lucide-react';

interface GameModalProps {
  game: Game | null;
  onClose: () => void;
  onVote: () => void;
}

const GameModal = ({ game, onClose, onVote }: GameModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useAuthStore();
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState(game?.votes || 0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  
  useEffect(() => {
    if (game?.id) {
      fetchComments();
    }
  }, [game?.id]);

  const fetchComments = async () => {
    if (!game?.id) return;
    
    try {
      setLoadingComments(true);
      const response = await api.get(`/comments/game/${game.id}`);
      setComments(response.data);
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleVote = async () => {
    if (!user) {
      alert('Debes iniciar sesión para votar');
      return;
    }

    if (!game?.id || game.id.length === 0) {
      alert('Este juego es de demostración y no puede ser votado');
      return;
    }

    if (hasVoted) {
      alert('Ya has votado por este juego');
      return;
    }

    try {
      await api.post(`/games/${game.id}/vote`);
      setVotes(votes + 1);
      setHasVoted(true);
      onVote();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al votar');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Debes iniciar sesión para comentar');
      return;
    }

    if (newComment.trim().length < 5) {
      alert('El comentario debe tener al menos 5 caracteres');
      return;
    }

    if (!game?.id) return;

    try {
      await api.post('/comments', {
        content: newComment,
        gameId: game.id,
      });
      setNewComment('');
      fetchComments();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al publicar comentario');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('¿Estás seguro de eliminar este comentario?')) return;

    try {
      await api.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      alert('Error al eliminar comentario');
    }
  };

  if (!game) return null;

  const allImages = [
    game.coverUrl,
    ...(game as any).images || []
  ].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl my-8" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          {allImages.length > 0 ? (
            <div className="relative">
              <img 
                src={allImages[currentImageIndex]} 
                alt={game.title}
                className="w-full h-96 object-contain rounded-t-2xl bg-gradient-to-b from-gray-700 to-gray-800"
              />
              
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-70 text-white w-12 h-12 rounded-full text-2xl hover:bg-opacity-90 transition border border-gray-600"
                  >
                    ‹
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-70 text-white w-12 h-12 rounded-full text-2xl hover:bg-opacity-90 transition border border-gray-600"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {allImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                        className={`w-3 h-3 rounded-full ${idx === currentImageIndex ? 'bg-indigo-500' : 'bg-white bg-opacity-50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-t-2xl flex items-center justify-center">
              <span className="text-white text-6xl">🎮</span>
            </div>
          )}
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-900 text-white w-10 h-10 rounded-full font-bold hover:bg-gray-800 transition shadow-lg border border-gray-600 flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-2 text-white drop-shadow">{game.title}</h2>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {game.platform}
            </span>
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {game.genre}
            </span>
            {game.rating && (
              <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" /> {game.rating}/10
              </span>
            )}
          </div>

          {game.releaseDate && (
            <p className="text-gray-300 mb-4">
              <span className="font-semibold text-white">Fecha de lanzamiento:</span> {new Date(game.releaseDate).toLocaleDateString()}
            </p>
          )}

          {game.description && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2 text-white">Reseña:</h3>
              <p className="text-gray-300 leading-relaxed bg-gray-700/30 p-4 rounded-lg">
                {game.description}
              </p>
            </div>
          )}

          {/* Sistema de Votos */}
          <div className="mb-6 p-4 bg-indigo-900/30 rounded-xl border border-indigo-500/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white mb-1">¿Te gustó esta reseña?</h3>
                <p className="text-sm text-gray-300">Vota para apoyar al autor</p>
              </div>
              <button
                onClick={handleVote}
                disabled={hasVoted || !user}
                className={`px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 shadow-lg ${
                  hasVoted
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
                {hasVoted ? 'Ya votaste' : 'Votar'} ({votes})
              </button>
            </div>
          </div>

          {/* Sección de Comentarios */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-indigo-400" />
              Comentarios ({comments.length})
            </h3>
            
            {/* Formulario para nuevo comentario */}
            {user ? (
              <form onSubmit={handleAddComment} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe tu comentario..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-lg"
                  >
                    Publicar Comentario
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-6 p-4 bg-gray-700/50 rounded-xl text-center border border-gray-600">
                <p className="text-gray-300">Inicia sesión para comentar</p>
              </div>
            )}

            {/* Lista de comentarios */}
            {loadingComments ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : comments.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No hay comentarios aún. ¡Sé el primero!</p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-semibold text-white">{comment.user.username}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {user && (user.id === comment.userId || user.role === 'ADMIN') && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                    <p className="text-gray-300">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {game.user && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">Publicado por:</span> {game.user.username}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(game.createdAt!).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameModal;