import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Target, Swords, Map, Compass, Wand2, Ghost, Car, Trophy, Brain, Gauge, Palette, Gamepad2, Tag } from 'lucide-react';

interface Category {
  name: string;
  icon?: string;
  color: string;
  gameCount: number;
}

const iconMap: Record<string, React.ElementType> = {
  Target, Swords, Map, Compass, Wand2, Ghost, Car, Trophy, Brain, Gauge, Palette, Gamepad2, Tag,
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CONVIerte el nombre de la categoría a la ruta correspondiente
  const getCategoryRoute = (categoryName: string) => {
    const routes: Record<string, string> = {
      'Action-Adventure': '/games/action-adventure',
      'Shooter': '/games/shooter',
      'RPG': '/games/rpg',
      'Aventura': '/games/aventura',
      'Acción': '/games/accion',
      'Terror': '/games/terror',
      'Carreras': '/games/carreras',
      'Deportes': '/games/deportes',
      'Estrategia': '/games/estrategia',
      'Simulación': '/games/simulacion',
      'Indie': '/games/indie',
    };
    return routes[categoryName] || '/games';
  };

  const handleCategoryClick = (categoryName: string) => {
    const route = getCategoryRoute(categoryName);
    navigate(route);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-300">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-center drop-shadow-lg flex items-center justify-center">
          <Tag className="w-8 h-8 text-indigo-300 mr-2" /> Categorías de Videojuegos
        </h1>

        {categories.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
            <p className="text-gray-300 text-lg">No hay categorías disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = iconMap[category.icon || 'Tag'] || Tag;
              return (
                <div
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`rounded-xl p-6 shadow-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center text-white border-2 hover:border-white/50 ${
                    category.gameCount === 0 ? 'opacity-70' : ''
                  }`}
                  style={{ backgroundColor: category.color || '#6366f1' }}
                >
                  <IconComponent className="w-12 h-12 mb-3" />
                  <h3 className="text-xl font-bold mb-1 text-center">{category.name}</h3>
                  <p className="text-sm text-white/80">
                    {category.gameCount} {category.gameCount === 1 ? 'juego' : 'juegos'}
                  </p>
                  {category.gameCount === 0 && (
                    <p className="text-xs text-white/60 mt-2 italic">Sin reseñas</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;