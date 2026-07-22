import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Tag, Plus, X, Trash2, Edit } from 'lucide-react';

interface Category {
  name: string;
  icon?: string;
  color: string;
  gameCount: number;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    color: '#6366f1',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleCreateCategory = async () => {
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.name}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', icon: '', color: '#6366f1' });
      fetchCategories();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al guardar la categoría');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon || '',
      color: category.color,
    });
    setShowModal(true);
  };

  const handleDelete = async (name: string) => {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await api.delete(`/categories/${name}`);
        fetchCategories();
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error al eliminar la categoría');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Tag className="w-10 h-10 text-indigo-400" />
            Gestión de Categorías
          </h1>
          <button
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: '', icon: '', color: '#6366f1' });
              setShowModal(true);
            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-bold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Crear Categoría
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700 relative group"
              style={{ borderColor: category.color }}
            >
              <div className="text-center">
                <Tag className="w-12 h-12 mx-auto mb-2" style={{ color: category.color }} />
                <h3 className="text-lg font-bold text-white">{category.name}</h3>
                <p className="text-sm text-gray-400">{category.gameCount} juegos</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleEdit(category)}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.name)}
                  className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">
                {editingCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Nombre de la categoría</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                    placeholder="Ej: Shooter"
                    disabled={!!editingCategory}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Icono (opcional)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                    placeholder="Ej: Target, Swords, Map"
                  />
                  <p className="text-xs text-gray-400 mt-1">Usa nombres de Lucide React Icons</p>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Color</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-12 rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleCreateCategory}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-bold"
                >
                  {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                    setFormData({ name: '', icon: '', color: '#6366f1' });
                  }}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-xl hover:bg-gray-700 transition font-bold flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" /> Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;