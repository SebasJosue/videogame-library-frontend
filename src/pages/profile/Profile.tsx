import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { 
  User, 
  Calendar, 
  CreditCard, 
  Shield, 
  Save, 
  X,
  Gamepad2,
  MessageSquare,
  ThumbsUp,
  Star
} from 'lucide-react';
import type { Subscription } from '../../types';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  subscription?: Subscription;
  games?: any[];
}

const Profile = () => {
  const navigate = useNavigate();
  const { user: currentUser, updateUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [currentUser, navigate]);

  const fetchProfile = async () => {
    if (!currentUser) return;
    try {
      const response = await api.get(`/users/${currentUser.id}`);
      setProfile(response.data);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error('Error al cargar perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!currentUser) return;

    try {
      await api.patch(`/users/${currentUser.id}`, {
        username: formData.username,
        email: formData.email,
      });
      
      updateUser({ username: formData.username, email: formData.email });
      setIsEditing(false);
      setSuccess('Perfil actualizado correctamente');
      fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar perfil');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!currentUser) return;

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await api.patch(`/users/${currentUser.id}/change-password`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      setSuccess('Contraseña cambiada correctamente');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cambiar contraseña');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-300">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const getPlanColor = (plan?: string) => {
    switch (plan) {
      case 'VIP': return 'bg-yellow-500 text-gray-900';
      case 'PREMIUM': return 'bg-purple-600 text-white';
      case 'BASIC': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-white text-center drop-shadow-lg flex items-center justify-center gap-3">
          <User className="w-10 h-10" />
          Mi Perfil
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-500 text-green-200 rounded-xl">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tarjeta de información principal */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">{profile?.username}</h2>
              <p className="text-gray-400">{profile?.email}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Shield className="w-5 h-5 text-indigo-400" />
                <span className="font-semibold">Rol:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  profile?.role === 'ADMIN' ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'
                }`}>
                  {profile?.role}
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                <span className="font-semibold">Plan:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPlanColor(profile?.subscription?.plan)}`}>
                  {profile?.subscription?.plan || 'FREE'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <span className="font-semibold">Miembro desde:</span>
                <span className="text-sm">{new Date(profile?.createdAt || '').toLocaleDateString()}</span>
              </div>

              {profile?.subscription?.endDate && profile.subscription.isActive && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">Válido hasta:</span>
                  <span className="text-sm">{new Date(profile.subscription.endDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Estadísticas y Formularios */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-indigo-400" />
                Mi Actividad
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700/50 p-4 rounded-xl text-center">
                  <Gamepad2 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{profile?.games?.length || 0}</p>
                  <p className="text-gray-400 text-sm">Reseñas Publicadas</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-xl text-center">
                  <ThumbsUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-gray-400 text-sm">Votos Dados</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-xl text-center">
                  <MessageSquare className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-gray-400 text-sm">Comentarios</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-6 h-6 text-indigo-400" />
                  Información Personal
                </h3>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold">
                    Editar Perfil
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-semibold">Nombre de usuario</label>
                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" required />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-semibold">Correo electrónico</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" required />
                  </div>
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-bold shadow-lg flex items-center justify-center gap-2">
                      <Save className="w-5 h-5" /> Guardar
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-gray-600 text-white py-3 rounded-xl hover:bg-gray-700 transition font-bold shadow-lg flex items-center justify-center gap-2">
                      <X className="w-5 h-5" /> Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div><p className="text-gray-400 text-sm">Nombre de usuario</p><p className="text-white font-semibold text-lg">{profile?.username}</p></div>
                  <div><p className="text-gray-400 text-sm">Correo electrónico</p><p className="text-white font-semibold text-lg">{profile?.email}</p></div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-indigo-400" />
                Cambiar Contraseña
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Contraseña actual</label>
                  <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" required />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Nueva contraseña</label>
                  <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" minLength={6} required />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Confirmar nueva contraseña</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" minLength={6} required />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg">
                  Cambiar Contraseña
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gray-900/80 text-white text-center py-4 border-t border-gray-700 mt-8">
        <p>© 2026 Game Library - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default Profile;