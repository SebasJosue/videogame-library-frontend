import { useEffect, useState } from 'react';
import api from '../../services/api';
import { CreditCard, Plus, X, Trash2, Edit } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  displayName: string;
  price: number;
  features: string[];
  description?: string;
  color: string;
  isActive: boolean;
}

const AdminPlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    price: 0,
    features: [''],
    description: '',
    color: '#6366f1',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/subscription/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Error al cargar planes:', error);
    }
  };

  const handleCreatePlan = async () => {
    try {
      if (editingPlan) {
        await api.put(`/subscription/plans/${editingPlan.id}`, formData);
      } else {
        await api.post('/subscription/plans', formData);
      }
      setShowModal(false);
      setEditingPlan(null);
      setFormData({ name: '', displayName: '', price: 0, features: [''], description: '', color: '#6366f1' });
      fetchPlans();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al guardar el plan');
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      displayName: plan.displayName,
      price: plan.price,
      features: plan.features,
      description: plan.description || '',
      color: plan.color,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este plan?')) return;
    try {
      await api.delete(`/subscription/plans/${id}`);
      fetchPlans();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar el plan');
    }
  };

  const handleAddFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <CreditCard className="w-10 h-10 text-yellow-400" />
            Gestión de Planes
          </h1>
          <button
            onClick={() => {
              setEditingPlan(null);
              setFormData({ name: '', displayName: '', price: 0, features: [''], description: '', color: '#6366f1' });
              setShowModal(true);
            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-bold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Crear Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700 relative group"
              style={{ borderColor: plan.color }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-white">{plan.displayName}</h3>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-3xl font-bold mb-4" style={{ color: plan.color }}>
                ${plan.price}/mes
              </p>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-gray-300 text-sm flex items-center gap-2">
                    <span className="text-green-400">✓</span> {feature}
                  </li>
                ))}
              </ul>
              {plan.description && <p className="text-gray-400 text-sm mb-4">{plan.description}</p>}
              <button
                onClick={() => handleEdit(plan)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" /> Editar
              </button>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-2xl w-full border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-4">
                {editingPlan ? 'Editar Plan' : 'Crear Nuevo Plan'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Nombre interno (sin espacios)</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                    placeholder="Ej: PREMIUM_PLUS"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Nombre para mostrar</label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                    placeholder="Ej: Plan Premium Plus"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Precio mensual</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                    placeholder="9.99"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Color del plan</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-12 rounded-xl cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Características</label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white"
                        placeholder="Ej: Publicar reseñas ilimitadas"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> Agregar característica
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleCreatePlan}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-bold"
                >
                  {editingPlan ? 'Guardar Cambios' : 'Crear Plan'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
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

export default AdminPlans;