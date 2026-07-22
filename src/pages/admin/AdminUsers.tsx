import { useEffect, useState } from 'react';
import api from '../../services/api';
import type { Subscription } from '../../types';
import { User, Shield, Ban, CheckCircle, Trash2, Users, AlertCircle, Key, X } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  isSuspended: boolean;
  suspensionReason?: string;
  suspensionUntil?: string;
  games?: { id: string; title: string }[];
  subscription?: Subscription;
}

const planColors: Record<string, string> = {
  FREE: 'bg-gray-600 text-gray-200',
  BASIC: 'bg-blue-600 text-white',
  PREMIUM: 'bg-purple-600 text-white',
  VIP: 'bg-yellow-500 text-gray-900',
};

const planPermissions: Record<string, string[]> = {
  FREE: ['Ver juegos', 'Votar reseñas', 'Comentar'],
  BASIC: ['Ver juegos', 'Votar reseñas', 'Comentar', 'Publicar reseñas (3/mes)', 'Subir imágenes'],
  PREMIUM: ['Todo lo de BASIC', 'Publicar reseñas ilimitadas', 'Subir imágenes (10/reseña)', 'Estadísticas básicas'],
  VIP: ['Todo lo de PREMIUM', 'Imágenes ilimitadas', 'Estadísticas avanzadas', 'Soporte prioritario 24/7', 'Experiencia sin anuncios'],
};

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal de suspensión
  const [suspendModal, setSuspendModal] = useState<{ show: boolean; userId: string | null }>({ show: false, userId: null });
  const [suspendDays, setSuspendDays] = useState(7);
  const [suspendReason, setSuspendReason] = useState('');

  // ✅ NUEVO: Modal de concesión de permisos
  const [permissionModal, setPermissionModal] = useState<{ show: boolean; user: UserProfile | null }>({ show: false, user: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NUEVO: Función para que el admin conceda los permisos
  const handleGrantPermissions = async () => {
    if (!permissionModal.user) return;
    
    try {
      // Aquí puedes llamar a tu endpoint de backend si tienes uno específico para activar permisos
      // await api.patch(`/users/${permissionModal.user.id}/grant-permissions`);
      
      alert(`✅ Permisos del plan ${permissionModal.user.subscription?.plan} concedidos exitosamente a ${permissionModal.user.username}.`);
      setPermissionModal({ show: false, user: null });
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al conceder permisos');
    }
  };

  const handleSuspend = async () => {
    if (!suspendModal.userId) return;
    try {
      await api.patch(`/users/${suspendModal.userId}/suspend`, {
        days: suspendDays,
        reason: suspendReason,
      });
      setSuspendModal({ show: false, userId: null });
      setSuspendDays(7);
      setSuspendReason('');
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al suspender usuario');
    }
  };

  const handleUnsuspend = async (userId: string) => {
    try {
      await api.patch(`/users/${userId}/unsuspend`);
      fetchUsers();
    } catch (err) {
      console.error('Error al levantar suspensión:', err);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) return;
    try {
      await api.delete(`/users/${userId}`);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-300">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-white text-center drop-shadow-lg flex items-center justify-center gap-3">
          <Users className="w-10 h-10" />
          Gestión de Usuarios
        </h1>
        
        {users.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
            <p className="text-gray-300 text-lg">No hay usuarios registrados aún</p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold">Usuario</th>
                    <th className="py-4 px-6 text-left font-semibold">Email</th>
                    <th className="py-4 px-6 text-left font-semibold">Rol</th>
                    <th className="py-4 px-6 text-left font-semibold">Plan</th>
                    <th className="py-4 px-6 text-left font-semibold">Permisos</th> {/* ✅ NUEVA COLUMNA */}
                    <th className="py-4 px-6 text-left font-semibold">Estado</th>
                    <th className="py-4 px-6 text-left font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const currentPlan = user.subscription?.plan || 'FREE';
                    return (
                      <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-800/50 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <p className="font-medium text-white">{user.username}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-300">{user.email}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 w-fit ${
                            user.role === 'ADMIN' ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'
                          }`}>
                            <Shield className="w-4 h-4" /> {user.role}
                          </span>
                        </td>
                        
                        {/* ✅ PLAN: Solo lectura, aparece automáticamente */}
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            planColors[currentPlan] || planColors.FREE
                          }`}>
                            {currentPlan}
                          </span>
                        </td>

                        {/* ✅ PERMISOS: Botón para que el admin los conceda */}
                        <td className="py-4 px-6">
                          <button
                            onClick={() => setPermissionModal({ show: true, user })}
                            className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-lg flex items-center gap-2"
                          >
                            <Key className="w-4 h-4" />
                            Gestionar
                          </button>
                        </td>

                        <td className="py-4 px-6">
                          {user.isSuspended ? (
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 w-fit">
                              <Ban className="w-4 h-4" /> Suspendido
                            </span>
                          ) : (
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 w-fit">
                              <CheckCircle className="w-4 h-4" /> Activo
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {user.role !== 'ADMIN' && (
                            <div className="flex space-x-2">
                              {user.isSuspended ? (
                                <button onClick={() => handleUnsuspend(user.id)} className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition text-sm font-medium shadow-lg flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" /> Levantar
                                </button>
                              ) : (
                                <button onClick={() => setSuspendModal({ show: true, userId: user.id })} className="bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 transition text-sm font-medium shadow-lg flex items-center gap-1">
                                  <Ban className="w-4 h-4" /> Suspender
                                </button>
                              )}
                              <button onClick={() => handleDelete(user.id)} className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition text-sm font-medium shadow-lg flex items-center gap-1">
                                <Trash2 className="w-4 h-4" /> Eliminar
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ✅ MODAL DE CONCESIÓN DE PERMISOS */}
        {permissionModal.show && permissionModal.user && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl max-w-md w-full p-6 border border-gray-700 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Key className="w-6 h-6 text-indigo-400" />
                  <h3 className="text-2xl font-bold text-white">Conceder Permisos</h3>
                </div>
                <button 
                  onClick={() => setPermissionModal({ show: false, user: null })}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-2">Usuario: <span className="text-white font-semibold">{permissionModal.user.username}</span></p>
                <p className="text-gray-300 mb-4">
                  Plan adquirido: <span className={`px-2 py-1 rounded text-sm font-bold ${planColors[permissionModal.user.subscription?.plan || 'FREE']}`}>
                    {permissionModal.user.subscription?.plan || 'FREE'}
                  </span>
                </p>
                
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <p className="text-sm text-indigo-300 font-semibold mb-3">Permisos a conceder:</p>
                  <ul className="space-y-2">
                    {planPermissions[permissionModal.user.subscription?.plan || 'FREE'].map((perm, idx) => (
                      <li key={idx} className="text-gray-200 text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {perm}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={handleGrantPermissions} 
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-lg flex items-center justify-center gap-2"
                >
                  <Key className="w-5 h-5" />
                  Conceder Permisos
                </button>
                <button 
                  onClick={() => setPermissionModal({ show: false, user: null })} 
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition font-semibold shadow-lg border border-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE SUSPENSIÓN (Existente) */}
        {suspendModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl max-w-md w-full p-6 border border-gray-700 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">Suspender Usuario</h3>
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2 font-medium">Días de suspensión</label>
                <input type="number" value={suspendDays} onChange={(e) => setSuspendDays(parseInt(e.target.value))} min="1" max="365" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 font-medium">Razón de suspensión</label>
                <textarea value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} rows={3} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" placeholder="Ej: Violación de términos de servicio" />
              </div>
              <div className="flex space-x-4">
                <button onClick={handleSuspend} className="flex-1 bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition font-semibold shadow-lg">Suspender</button>
                <button onClick={() => setSuspendModal({ show: false, userId: null })} className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition font-semibold shadow-lg border border-gray-500">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;