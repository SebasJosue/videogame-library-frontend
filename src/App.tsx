import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/layout/header';
import Welcome from './pages/home/Welcome';
import GameList from './pages/games/GameList';
import GameForm from './pages/games/GameForm';
import Categories from './pages/games/Categories';
import SubscriptionPlans from './pages/subscription/SubscriptionPlans';
import Payment from './pages/profile/Payment';
import Profile from './pages/profile/Profile';
import Login from './pages/auth/login';
import Register from './pages/auth/register';

// ✅ NUEVO: Importamos el Panel de Administración unificado
import AdminPanel from './pages/admin/AdminPanel';

import ProtectedRoute from './utils/ProtectedRoute';
import { useAuthStore } from './store/authStore';

function App() {
  const { initializeAuth, user } = useAuthStore();
  
  // ✅ NUEVO: Detectamos la ruta actual para ocultar Header/Footer en el admin
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ MOSTRAR HEADER solo si hay usuario Y NO estamos en rutas de admin */}
      {user && !isAdminRoute && <Header />}
      
      <main className={user && !isAdminRoute ? 'flex-1 bg-gray-50' : ''}>
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {!user && <Route path="/" element={<Navigate to="/welcome" replace />} />}
          
          {user && (
            <>
              <Route path="/" element={<GameList />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/subscription" element={<SubscriptionPlans />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/payment/:plan" element={<Payment />} />
              
              {/* ✅ RUTAS PARA CADA CATEGORÍA */}
              <Route path="/games/action-adventure" element={<GameList genre="Action-Adventure" />} />
              <Route path="/games/shooter" element={<GameList genre="Shooter" />} />
              <Route path="/games/rpg" element={<GameList genre="RPG" />} />
              <Route path="/games/aventura" element={<GameList genre="Aventura" />} />
              <Route path="/games/accion" element={<GameList genre="Acción" />} />
              <Route path="/games/terror" element={<GameList genre="Terror" />} />
              <Route path="/games/carreras" element={<GameList genre="Carreras" />} />
              <Route path="/games/deportes" element={<GameList genre="Deportes" />} />
              <Route path="/games/estrategia" element={<GameList genre="Estrategia" />} />
              <Route path="/games/simulacion" element={<GameList genre="Simulación" />} />
              <Route path="/games/indie" element={<GameList genre="Indie" />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/games/new" element={<GameForm />} />
              </Route>
              
              {/* ✅ RUTAS DE ADMINISTRADOR UNIFICADAS EN EL PANEL */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                {/* El AdminPanel maneja internamente qué componente mostrar según el sidebar */}
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/*" element={<AdminPanel />} />
              </Route>
            </>
          )}
          
          <Route path="*" element={<Navigate to={user ? "/" : "/welcome"} replace />} />
        </Routes>
      </main>
      
      {/* ✅ MOSTRAR FOOTER solo si hay usuario Y NO estamos en rutas de admin */}
      {user && !isAdminRoute && (
        <footer className="bg-gray-800 text-white py-6 text-center">
          <p>© 2026 Game Library - Todos los derechos reservados</p>
        </footer>
      )}
    </div>
  );
}

export default App;