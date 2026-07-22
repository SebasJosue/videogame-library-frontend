import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { 
  Check, 
  X, 
  FileText, 
  Gamepad2,
  AlertCircle 
} from 'lucide-react';

const GameForm = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: '',
    genre: '',
    releaseDate: '',
    rating: '',
    coverUrl: '',
    images: [] as string[],
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Normas informativas (ya no bloquean, solo son referencia)
  const rules = [
    'Título recomendado: mínimo 5 caracteres',
    'Descripción recomendada: mínimo 50 caracteres',
    'Calificación entre 1 y 10',
    'No se permite contenido ofensivo',
    'Solo URLs de imágenes válidas',
    'Máximo 5 imágenes adicionales',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/games', {
        ...formData,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al publicar el juego');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() && newImageUrl.startsWith('http')) {
      if (formData.images.length >= 5) {
        setError('Máximo 5 imágenes adicionales permitidas');
        return;
      }
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()],
      });
      setNewImageUrl('');
      setError('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700">
          <h2 className="text-3xl font-bold text-center text-white mb-8 drop-shadow-lg flex items-center justify-center">
            <FileText className="w-8 h-8 text-indigo-300 mr-3" />
            {user?.role === 'ADMIN' ? 'Publicar Nueva Reseña Profesional' : 'Publicar Reseña'}
          </h2>
          
          {/* Normas de publicación (Informativas) */}
          <div className="mb-8 p-6 bg-indigo-900/30 border border-indigo-500/50 rounded-xl">
            <h3 className="font-bold text-indigo-300 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2" /> Normas de Publicación (Referencia):
            </h3>
            <ul className="text-sm text-gray-300 space-y-2">
              {rules.map((rule, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-white border-b border-gray-700 pb-2">Información Básica</h3>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 font-semibold">
                  Título del juego *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                  required
                  placeholder="Ej: Animal Crossing: New Horizons"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2 font-semibold">
                  Descripción/Reseña Detallada *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                  required
                  placeholder="Escribe tu reseña sobre el juego..."
                />
                <p className="text-sm text-gray-400 mt-2">
                  {formData.description.length} caracteres escritos
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Plataforma *</label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    required
                  >
                    <option value="" className="bg-gray-700">Seleccionar...</option>
                    <option value="PC" className="bg-gray-700">PC</option>
                    <option value="PlayStation 5" className="bg-gray-700">PlayStation 5</option>
                    <option value="PlayStation 4" className="bg-gray-700">PlayStation 4</option>
                    <option value="Xbox Series X/S" className="bg-gray-700">Xbox Series X/S</option>
                    <option value="Xbox One" className="bg-gray-700">Xbox One</option>
                    <option value="Nintendo Switch" className="bg-gray-700">Nintendo Switch</option>
                    <option value="Multiplataforma" className="bg-gray-700">Multiplataforma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Género *</label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    required
                  >
                    <option value="" className="bg-gray-700">Seleccionar...</option>
                    <option value="Acción" className="bg-gray-700">Acción</option>
                    <option value="Aventura" className="bg-gray-700">Aventura</option>
                    <option value="Action-Adventure" className="bg-gray-700">Action-Adventure</option>
                    <option value="Shooter" className="bg-gray-700">Shooter</option>
                    <option value="RPG" className="bg-gray-700">RPG</option>
                    <option value="Estrategia" className="bg-gray-700">Estrategia</option>
                    <option value="Deportes" className="bg-gray-700">Deportes</option>
                    <option value="Carreras" className="bg-gray-700">Carreras</option>
                    <option value="Indie" className="bg-gray-700">Indie</option>
                    <option value="Terror" className="bg-gray-700">Terror</option>
                    <option value="Simulación" className="bg-gray-700">Simulación</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Fecha de lanzamiento</label>
                  <input
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Calificación (1-10)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    step="0.1"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                    placeholder="Ej: 9.5"
                  />
                </div>
              </div>
            </div>

            {/* Imágenes */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-white border-b border-gray-700 pb-2 flex items-center">
                <Gamepad2 className="w-5 h-5 mr-2" /> Imágenes del Juego
              </h3>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 font-semibold">Portada Principal (URL)</label>
                <input
                  type="url"
                  name="coverUrl"
                  value={formData.coverUrl}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/portada.jpg"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                />
                <p className="text-sm text-gray-400 mt-2">URL de la imagen de portada del juego</p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2 font-semibold">
                  Agregar Imágenes Adicionales <span className="text-sm text-gray-400">(máx. 5) - ({formData.images.length}/5)</span>
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://ejemplo.com/screenshot1.jpg"
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                    disabled={formData.images.length >= 5}
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    disabled={formData.images.length >= 5}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Agregar
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-2">Agrega URLs de screenshots o imágenes del juego</p>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl border border-gray-600"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=Error';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center font-bold shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:opacity-90 transition font-bold shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                {loading ? 'Publicando...' : 'Publicar Reseña'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-600 text-white py-4 rounded-xl hover:bg-gray-700 transition font-bold shadow-lg border border-gray-500"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <footer className="bg-gray-900/80 text-white text-center py-4 border-t border-gray-700 mt-8">
        <p>© 2026 Game Library - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default GameForm;