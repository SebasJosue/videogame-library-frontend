import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  Gamepad2, 
  FileText, 
  Tags, 
  CreditCard, 
  User, 
  Crown, 
  LogOut,
  LogIn,
  UserPlus,
  Users,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { user, logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePublishClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/games/new');
    }
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <Gamepad2 className="w-8 h-8" />
          <span>Game Library</span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <button 
                onClick={handlePublishClick}
                className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition font-semibold flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                <span className="hidden md:inline">Publicar</span>
              </button>
              
              <Link 
                to="/categories" 
                className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition font-semibold flex items-center gap-2"
              >
                <Tags className="w-5 h-5" />
                <span className="hidden md:inline">Categorías</span>
              </Link>

              <Link 
                to="/subscription" 
                className="bg-yellow-500 text-indigo-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition font-bold flex items-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                <span className="hidden md:inline">Planes</span>
              </Link>

              <Link 
                to="/profile" 
                className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition flex items-center gap-2"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline">¡Hola, {user.username}!</span>
              </Link>
              
              {/* ✅ MENÚ DE ADMINISTRACIÓN */}
              {isAdmin() && (
                <div className="relative">
                  <button 
                    onClick={() => setShowAdminMenu(!showAdminMenu)}
                    className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition flex items-center gap-2"
                  >
                    <Crown className="w-5 h-5" />
                    <span className="hidden md:inline">Admin</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showAdminMenu && (
                    <>
                      {/* Overlay para cerrar al hacer clic fuera */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowAdminMenu(false)}
                      />
                      
                      {/* Menú desplegable */}
                      <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50 overflow-hidden">
                        <div className="p-2">
                          <div className="text-xs font-semibold text-gray-400 uppercase px-3 py-2 border-b border-gray-700 mb-2">
                            Panel de Administración
                          </div>
                          
                          <Link 
                            to="/admin" 
                            className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-purple-600 hover:text-white rounded-lg transition mb-1"
                            onClick={() => setShowAdminMenu(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span>Dashboard</span>
                          </Link>
                          
                          <Link 
                            to="/admin/users" 
                            className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-purple-600 hover:text-white rounded-lg transition mb-1"
                            onClick={() => setShowAdminMenu(false)}
                          >
                            <Users className="w-4 h-4" />
                            <span>Gestionar Usuarios</span>
                          </Link>
                          
                          <Link 
                            to="/admin/games" 
                            className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-purple-600 hover:text-white rounded-lg transition mb-1"
                            onClick={() => setShowAdminMenu(false)}
                          >
                            <Gamepad2 className="w-4 h-4" />
                            <span>Gestionar Reseñas</span>
                          </Link>
                          
                          <Link 
                            to="/admin/categories" 
                            className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-purple-600 hover:text-white rounded-lg transition mb-1"
                            onClick={() => setShowAdminMenu(false)}
                          >
                            <Tags className="w-4 h-4" />
                            <span>Gestionar Categorías</span>
                          </Link>
                          
                          <Link 
                            to="/admin/plans" 
                            className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-purple-600 hover:text-white rounded-lg transition mb-1"
                            onClick={() => setShowAdminMenu(false)}
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>Gestionar Planes</span>
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Salir</span>
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition flex items-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                <span>Iniciar sesión</span>
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center gap-2 font-semibold"
              >
                <UserPlus className="w-5 h-5" />
                <span>Registrarse</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;