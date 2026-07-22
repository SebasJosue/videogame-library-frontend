import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-300">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-white text-center drop-shadow-lg flex items-center justify-center gap-3">
          <Crown className="w-10 h-10 text-yellow-400" />
          Panel de Administración
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700 hover:border-indigo-500 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Usuarios Registrados</p>
                <p className="text-4xl font-bold text-white mt-2">{stats?.totalUsers || 0}</p>
              </div>
              <div className="bg-indigo-500/20 p-3 rounded-full">
                <Users className="w-8 h-8 text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700 hover:border-green-500 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Reseñas</p>
                <p className="text-4xl font-bold text-white mt-2">{stats?.totalGames || 0}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-full">
                <Gamepad2 className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700 hover:border-red-500 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Usuarios Suspendidos</p>
                <p className="text-4xl font-bold text-white mt-2">{stats?.suspendedUsers || 0}</p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-full">
                <Ban className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700 hover:border-yellow-500 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Administradores</p>
                <p className="text-4xl font-bold text-white mt-2">{stats?.adminUsers || 0}</p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-full">
                <Crown className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-2 text-white">Gestión Rápida</h2>
          <p className="text-gray-400 mb-6">
            Accede directamente a las herramientas de administración de la plataforma.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              to="/admin/users" 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:opacity-90 transition font-bold shadow-lg flex items-center justify-center gap-3 group"
            >
              <Users className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
              Gestionar Usuarios
            </Link>
            <Link 
              to="/admin/games" 
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl hover:opacity-90 transition font-bold shadow-lg flex items-center justify-center gap-3 group"
            >
              <Gamepad2 className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
              Gestionar Reseñas
            </Link>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-900/80 text-white text-center py-4 border-t border-gray-700 mt-8">
        <p>© 2026 Game Library - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;