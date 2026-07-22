import { Routes, Route, Navigate } from 'react-router-dom';
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
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminGames from './pages/admin/AdminGames';
import AdminPlans from './pages/admin/AdminPlans';
import AdminCategories from './pages/admin/AdminCategories';
import ProtectedRoute from './utils/ProtectedRoute';
import { useAuthStore } from './store/authStore';

function App() {
  const { initializeAuth, user } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {user && <Header />}
      <main className={user ? 'flex-1 bg-gray-50' : ''}>
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
              
              <Route element={<ProtectedRoute />}>
                <Route path="/games/new" element={<GameForm />} />
              </Route>
              
              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/games" element={<AdminGames />} />
                <Route path="/admin/plans" element={<AdminPlans />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
              </Route>
            </>
          )}
          
          <Route path="*" element={<Navigate to={user ? "/" : "/welcome"} replace />} />
        </Routes>
      </main>
      
      {user && (
        <footer className="bg-gray-800 text-white py-6 text-center">
          <p>© 2026 Game Library - Todos los derechos reservados</p>
        </footer>
      )}
    </div>
  );
}

export default App;