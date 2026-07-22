import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import type { Game } from '../../types';
import { useAuthStore } from '../../store/authStore';
import GameModal from './GameModal';
import { ThumbsUp, Star } from 'lucide-react'; // ✅ Iconos profesionales

const GameList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchGames();
    } else {
      navigate('/welcome');
    }
  }, [user, navigate]);

  const fetchGames = async () => {
    try {
      const response = await api.get('/games');
      setGames(response.data);
    } catch (err) {
      console.error('Error al cargar juegos:', err);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/games/new');
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Cargando juegos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">
        🎮 Biblioteca de Videojuegos
      </h1>
      
      {games.length === 0 ? (
        <div className="text-center py-20 bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
          <p className="text-gray-300 text-lg mb-4">No hay juegos en la biblioteca aún</p>
          <button 
            onClick={handlePublishClick}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-lg"
          >
            📝 Sé el primero en publicar una reseña
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div 
              key={game.id} 
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden hover:shadow-indigo-500/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-700 hover:border-indigo-500"
              onClick={() => setSelectedGame(game)}
            >
              {game.coverUrl ? (
                <div className="w-full h-64 flex items-center justify-center p-4 bg-gradient-to-b from-gray-700 to-gray-800">
                  <img 
                    src={game.coverUrl} 
                    alt={game.title}
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                  <span className="text-white text-6xl">🎮</span>
                </div>
              )}
              <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900">
                <h2 className="text-xl font-bold mb-2 text-white drop-shadow">{game.title}</h2>
                <p className="text-gray-300 mb-4 text-sm line-clamp-2">
                  {game.description || 'Sin descripción'}
                </p>
                <div className="flex justify-between text-sm mb-3">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full font-medium">
                    {game.platform}
                  </span>
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full font-medium">
                    {game.genre}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  {game.rating && (
                    <div className="flex items-center text-yellow-400">
                      {/* ✅ Icono de estrella profesional */}
                      <Star className="w-5 h-5 fill-current" />
                      <span className="ml-1 font-bold text-white">{game.rating}/10</span>
                    </div>
                  )}
                  <div className="flex items-center text-indigo-400">
                    {/* ✅ Icono de like profesional */}
                    <ThumbsUp className="w-5 h-5" />
                    <span className="ml-1 font-bold text-white">{game.votes || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedGame && (
        <GameModal 
          game={selectedGame} 
          onClose={() => setSelectedGame(null)} 
          onVote={fetchGames}
        />
      )}
    </div>
  );
};

export default GameList;