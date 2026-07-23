import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import type { Game } from '../../types';
import { useAuthStore } from '../../store/authStore';
import GameModal from './GameModal';
import { ThumbsUp, Star, X, Gamepad2 } from 'lucide-react';

interface GameListProps {
  genre?: string; // ✅ RECIBE EL GÉNERO COMO PROP
}

const GameList = ({ genre }: GameListProps) => {
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
  }, [user, navigate, genre]); // ✅ SE EJECUTA CUANDO CAMBIA EL GÉNERO

  const fetchGames = async () => {
    try {
      setLoading(true);
      // ✅ SI HAY GÉNERO, LO FILTRA. SI NO, MUESTRA TODOS.
      const url = genre ? `/games?genre=${encodeURIComponent(genre)}` : '/games';
      const response = await api.get(url);
      console.log(`Juegos de ${genre || 'TODOS'}:`, response.data.length);
      setGames(response.data);
    } catch (err) {
      console.error('Error al cargar juegos:', err);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = () => {
    navigate(user ? '/games/new' : '/login');
  };

  const clearGenreFilter = () => {
    navigate('/'); // Vuelve a la página principal
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-300">Cargando juegos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 min-h-screen">
      
      {/* BARRA DE FILTRO ACTIVO */}
      {genre && (
        <div className="bg-indigo-900/50 border border-indigo-500/50 rounded-xl px-6 py-4 mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-indigo-300 font-bold text-lg">Categoría: {genre}</h3>
            <p className="text-white text-sm">
              Mostrando <span className="font-bold text-green-400">{games.length}</span> reseñas
            </p>
          </div>
          <button
            onClick={clearGenreFilter}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 font-semibold"
          >
            <X className="w-5 h-5" /> Ver todos los juegos
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-white text-center md:text-left drop-shadow-lg flex items-center gap-3">
          <Gamepad2 className="w-10 h-10 text-indigo-400" />
          {genre ? `${genre}` : 'Biblioteca de Videojuegos'}
        </h1>
      </div>
      
      {games.length === 0 ? (
        <div className="text-center py-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
          <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            {genre ? `No hay reseñas en ${genre}` : 'No hay juegos en la biblioteca aún'}
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            {genre 
              ? `Aún no hay reseñas en esta categoría.`
              : 'Sé el primero en publicar una reseña.'}
          </p>
          {genre ? (
            <button onClick={clearGenreFilter} className="text-indigo-400 hover:text-indigo-300 text-sm underline font-semibold">
              ← Ver todos los juegos
            </button>
          ) : (
            <button onClick={handlePublishClick} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-lg">
               Sé el primero en publicar una reseña
            </button>
          )}
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
                  <img src={game.coverUrl} alt={game.title} className="w-full h-full object-contain rounded-lg" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Sin+Imagen'; }} />
                </div>
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                  <Gamepad2 className="w-16 h-16 text-white" />
                </div>
              )}
              <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900">
                <h2 className="text-xl font-bold mb-2 text-white drop-shadow">{game.title}</h2>
                <p className="text-gray-300 mb-4 text-sm line-clamp-2">{game.description || 'Sin descripción'}</p>
                <div className="flex justify-between text-sm mb-3">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full font-medium">{game.platform}</span>
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full font-medium">{game.genre}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  {game.rating && (
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="ml-1 font-bold text-white">{game.rating}/10</span>
                    </div>
                  )}
                  <div className="flex items-center text-indigo-400">
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