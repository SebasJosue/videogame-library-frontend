import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Gamepad2, Tag, CreditCard, Crown, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import AdminUsers from './AdminUsers';
import AdminGames from './AdminGames';
import AdminCategories from './AdminCategories';
import AdminPlans from './AdminPlans';
import AdminDashboard from './AdminDashboard';

type AdminSection = 'dashboard' | 'users' | 'games' | 'categories' | 'plans';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: LayoutDashboard, color: 'from-yellow-500 to-orange-500' },
    { id: 'users' as AdminSection, label: 'Gestionar Usuarios', icon: Users, color: 'from-indigo-500 to-purple-500' },
    { id: 'games' as AdminSection, label: 'Gestionar Reseñas', icon: Gamepad2, color: 'from-green-500 to-emerald-500' },
    { id: 'categories' as AdminSection, label: 'Gestionar Categorías', icon: Tag, color: 'from-blue-500 to-cyan-500' },
    { id: 'plans' as AdminSection, label: 'Gestionar Planes', icon: CreditCard, color: 'from-yellow-500 to-orange-500' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <AdminDashboard />;
      case 'users': return <AdminUsers />;
      case 'games': return <AdminGames />;
      case 'categories': return <AdminCategories />;
      case 'plans': return <AdminPlans />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex">
      {/* SIDEBAR IZQUIERDO */}
      <aside className="w-64 bg-gray-900/80 backdrop-blur-sm border-r border-gray-700 flex flex-col flex-shrink-0 h-screen sticky top-0">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            Admin Panel
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105`
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        {/* BOTONES DE PERFIL Y SALIR EN EL SIDEBAR */}
        <div className="p-4 space-y-2 border-t border-gray-700">
          <button
            onClick={() => navigate('/profile')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium hover:opacity-90 transition shadow-lg"
          >
            <User className="w-5 h-5" />
            <span>Mi Perfil</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium hover:opacity-90 transition shadow-lg"
          >
            <LogOut className="w-5 h-5" />
            <span>Salir</span>
          </button>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">© 2026 Game Library</p>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL A LA DERECHA */}
      <main className="flex-1 overflow-y-auto h-screen">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPanel;