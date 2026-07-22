import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  initializeAuth: () => void;
  isAdmin: () => boolean;
  updateUser: (updatedData: Partial<User>) => void; // ✅ NUEVO: Definido en la interfaz
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: (token, user) => {
        localStorage.setItem('token', token);
        set({ token, user });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },
      initializeAuth: () => {
        // La persistencia de zustand se encarga de esto automáticamente
      },
      isAdmin: () => get().user?.role === 'ADMIN',
      // ✅ NUEVO: Implementación de la función para actualizar datos del usuario
      updateUser: (updatedData) => 
        set((state) => ({ 
          user: state.user ? { ...state.user, ...updatedData } : null 
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);