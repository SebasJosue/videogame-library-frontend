export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PREMIUM' | 'VIP';

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  subscription?: Subscription; // ✅ AGREGAR
  createdAt?: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  gameId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
  };
}

export interface Game {
  id: string;
  title: string;
  description?: string;
  platform: string;
  genre: string;
  releaseDate?: string;
  rating?: number;
  coverUrl?: string;
  images?: string[];
  votes?: number;
  createdAt?: string;
  user?: User;
  comments?: Comment[];
}