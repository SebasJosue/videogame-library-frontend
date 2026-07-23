import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Gamepad2, FileText, Tags, CreditCard, User, Crown, LogOut, LogIn, UserPlus } from 'lucide-react';

const Header = () => {
  const { user, logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();

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
              {/* ✅ SOLO PARA USUARIOS NORMALES (NO ADMIN) */}
              {!isAdmin() && (
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
                </>
              )}

              {/* SALUDO AL USUARIO */}
              <Link 
                to="/profile" 
                className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition flex items-center gap-2"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline">¡Hola, {user.username}!</span>
              </Link>
              
              {/* ✅ SOLO PARA ADMIN */}
              {isAdmin() && (
                <Link 
                  to="/admin" 
                  className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition flex items-center gap-2"
                >
                  <Crown className="w-5 h-5" />
                  <span className="hidden md:inline">Admin</span>
                </Link>
              )}
              
              {/* BOTÓN SALIR (PARA TODOS) */}
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