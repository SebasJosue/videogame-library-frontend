import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, Gamepad2, Ban, Crown } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalGames: number;
  suspendedUsers: number;
  adminUsers: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/users/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-300">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* TÍTULO CENTRADO */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white flex items-center justify-center gap-4">
          <Crown className="w-12 h-12 text-yellow-400" />
          Información de la página
        </h1>
      </div>
      
      {/* ESTADÍSTICAS EN GRID 2x2 GRANDES */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Total Usuarios */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-10 shadow-2xl border-2 border-gray-700 hover:border-indigo-500 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-lg font-medium mb-2">Total Usuarios Registrados</p>
                <p className="text-6xl font-bold text-white">{stats?.totalUsers || 0}</p>
              </div>
              <div className="bg-indigo-500/20 p-6 rounded-full">
                <Users className="w-16 h-16 text-indigo-400" />
              </div>
            </div>
          </div>

          {/* Total Reseñas */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-10 shadow-2xl border-2 border-gray-700 hover:border-green-500 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-lg font-medium mb-2">Total Reseñas</p>
                <p className="text-6xl font-bold text-white">{stats?.totalGames || 0}</p>
              </div>
              <div className="bg-green-500/20 p-6 rounded-full">
                <Gamepad2 className="w-16 h-16 text-green-400" />
              </div>
            </div>
          </div>

          {/* Usuarios Suspendidos */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-10 shadow-2xl border-2 border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-lg font-medium mb-2">Usuarios Suspendidos</p>
                <p className="text-6xl font-bold text-white">{stats?.suspendedUsers || 0}</p>
              </div>
              <div className="bg-red-500/20 p-6 rounded-full">
                <Ban className="w-16 h-16 text-red-400" />
              </div>
            </div>
          </div>

          {/* Total Administradores */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-10 shadow-2xl border-2 border-gray-700 hover:border-yellow-500 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-lg font-medium mb-2">Total Administradores</p>
                <p className="text-6xl font-bold text-white">{stats?.adminUsers || 0}</p>
              </div>
              <div className="bg-yellow-500/20 p-6 rounded-full">
                <Crown className="w-16 h-16 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;