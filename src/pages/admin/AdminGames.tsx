import { useEffect, useState } from 'react';
import api from '../../services/api';
import type { Game } from '../../types';
import { Gamepad2, Star, Eye, Trash2, X, AlertCircle, Check, XCircle, Filter } from 'lucide-react';

interface GameWithCompliance extends Game {
  isCompliant: boolean;
  complianceDetails: {
    titleLength: boolean;
    descriptionLength: boolean;
    hasImage: boolean;
    hasRating: boolean;
  };
}

const AdminGames = () => {
  const [games, setGames] = useState<GameWithCompliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<GameWithCompliance | null>(null);
  const [filter, setFilter] = useState<'all' | 'compliant' | 'non-compliant'>('all');

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await api.get('/games');
      // Calculamos el cumplimiento en el frontend para asegurar que funcione
      const gamesWithCompliance = response.data.map((game: Game) => {
        const titleLength = game.title.length >= 5;
        const descriptionLength = (game.description || '').length >= 50;
        const hasImage = !!game.coverUrl;
        const hasRating = game.rating !== undefined && game.rating !== null;

        return {
          ...game,
          isCompliant: titleLength && descriptionLength && hasImage && hasRating,
          complianceDetails: { titleLength, descriptionLength, hasImage, hasRating },
        };
      });
      setGames(gamesWithCompliance);
    } catch (err) {
      console.error('Error al cargar juegos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (gameId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta reseña? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await api.delete(`/games/admin/${gameId}`);
      fetchGames();
    } catch (err) {
      console.error('Error al eliminar juego:', err);
    }
  };

  const filteredGames = games.filter(game => {
    if (filter === 'compliant') return game.isCompliant;
    if (filter === 'non-compliant') return !game.isCompliant;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-300">Cargando reseñas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-white text-center drop-shadow-lg flex items-center gap-3">
            <Gamepad2 className="w-10 h-10" />
            Gestión de Reseñas
          </h1>
          
          <div className="flex gap-2 bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                filter === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Filter className="w-4 h-4" /> Todas
            </button>
            <button
              onClick={() => setFilter('compliant')}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                filter === 'compliant' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Check className="w-4 h-4" /> Cumplen
            </button>
            <button
              onClick={() => setFilter('non-compliant')}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                filter === 'non-compliant' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <XCircle className="w-4 h-4" /> No Cumplen
            </button>
          </div>
        </div>
        
        {filteredGames.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
            <p className="text-gray-300 text-lg">No hay reseñas en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <div 
                key={game.id} 
                className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden border-2 transition-all duration-300 transform hover:-translate-y-2 ${
                  game.isCompliant ? 'border-green-500/50' : 'border-red-500/50'
                }`}
              >
                <div className="relative">
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
                      <Gamepad2 className="w-16 h-16 text-white" />
                    </div>
                  )}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg ${
                    game.isCompliant ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {game.isCompliant ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {game.isCompliant ? 'Cumple' : 'No Cumple'}
                  </div>
                </div>
                
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2 text-white drop-shadow">{game.title}</h2>
                  <p className="text-gray-300 mb-4 text-sm line-clamp-2">
                    {game.description || 'Sin descripción'}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4 text-sm">
                    <span className="text-gray-400">
                      Por: <span className="text-indigo-400 font-semibold">{(game as any).user?.username || 'Desconocido'}</span>
                    </span>
                    {game.rating && (
                      <span className="bg-yellow-500 text-gray-900 px-2 py-1 rounded font-bold flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" />
                        {game.rating}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedGame(game)}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-lg text-sm flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Detalles
                    </button>
                    <button
                      onClick={() => handleDelete(game.id)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold shadow-lg text-sm flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedGame && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl my-8">
              <div className="relative">
                {selectedGame.coverUrl && (
                  <img 
                    src={selectedGame.coverUrl} 
                    alt={selectedGame.title}
                    className="w-full h-64 object-contain rounded-t-2xl bg-gradient-to-b from-gray-700 to-gray-800"
                  />
                )}
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="absolute top-4 right-4 bg-gray-900 text-white w-10 h-10 rounded-full font-bold hover:bg-gray-800 transition shadow-lg border border-gray-600 flex items-center justify-center"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-white">{selectedGame.title}</h2>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                    selectedGame.isCompliant ? 'bg-green-500/20 text-green-400 border border-green-500' : 'bg-red-500/20 text-red-400 border border-red-500'
                  }`}>
                    {selectedGame.isCompliant ? <Check className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    {selectedGame.isCompliant ? 'Cumple con las normas' : 'No cumple con las normas'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-sm">Plataforma</p>
                    <p className="text-white font-semibold">{selectedGame.platform}</p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-sm">Género</p>
                    <p className="text-white font-semibold">{selectedGame.genre}</p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-sm">Publicado por</p>
                    <p className="text-indigo-400 font-semibold">{(selectedGame as any).user?.username || 'Desconocido'}</p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-sm">Calificación</p>
                    <p className="text-yellow-400 font-semibold flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      {selectedGame.rating || 'N/A'}/10
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2 text-white">Reseña:</h3>
                  <p className="text-gray-300 leading-relaxed bg-gray-700/30 p-4 rounded-lg">
                    {selectedGame.description || 'Sin descripción'}
                  </p>
                </div>

                <div className="mb-6 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-6 rounded-xl border border-indigo-500/50">
                  <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                    <AlertCircle className="w-6 h-6" />
                    Detalle de Cumplimiento
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                      <span className="text-gray-300">Título (mín. 5 caracteres)</span>
                      <span className={`font-bold flex items-center gap-1 ${selectedGame.complianceDetails.titleLength ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedGame.complianceDetails.titleLength ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {selectedGame.complianceDetails.titleLength ? 'Cumple' : 'No cumple'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                      <span className="text-gray-300">Descripción (mín. 50 caracteres)</span>
                      <span className={`font-bold flex items-center gap-1 ${selectedGame.complianceDetails.descriptionLength ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedGame.complianceDetails.descriptionLength ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {selectedGame.complianceDetails.descriptionLength ? 'Cumple' : 'No cumple'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                      <span className="text-gray-300">Imagen de portada</span>
                      <span className={`font-bold flex items-center gap-1 ${selectedGame.complianceDetails.hasImage ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedGame.complianceDetails.hasImage ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {selectedGame.complianceDetails.hasImage ? 'Cumple' : 'No cumple'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                      <span className="text-gray-300">Calificación</span>
                      <span className={`font-bold flex items-center gap-1 ${selectedGame.complianceDetails.hasRating ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedGame.complianceDetails.hasRating ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {selectedGame.complianceDetails.hasRating ? 'Cumple' : 'No cumple'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleDelete(selectedGame.id)}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Eliminar Reseña
                  </button>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-xl hover:bg-gray-700 transition font-bold shadow-lg border border-gray-500"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <footer className="bg-gray-900/80 text-white text-center py-4 border-t border-gray-700 mt-8">
        <p>© 2026 Game Library - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default AdminGames;