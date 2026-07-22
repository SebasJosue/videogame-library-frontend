import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import type { Subscription } from '../../types';
import { Sparkles, Check } from 'lucide-react';

const plans = [
  {
    name: 'FREE',
    price: 0,
    features: ['Ver juegos', 'Votar reseñas', 'Comentar', 'Publicar reseñas', 'Subir imágenes'],
    color: 'from-gray-600 to-gray-700',
    borderColor: 'border-gray-500',
  },
  {
    name: 'BASIC',
    price: 4.99,
    features: ['Todo lo de FREE', 'Publicar reseñas (3/mes)', 'Subir imágenes', 'Estadísticas'],
    color: 'from-blue-600 to-blue-700',
    borderColor: 'border-blue-500',
    popular: false,
  },
  {
    name: 'PREMIUM',
    price: 9.99,
    features: ['Todo lo de BASIC', 'Publicar reseñas ilimitadas', 'Subir imágenes (10/reseña)', 'Estadísticas básicas'],
    color: 'from-purple-600 to-purple-700',
    borderColor: 'border-purple-500',
    popular: true,
  },
  {
    name: 'VIP',
    price: 19.99,
    features: ['Todo lo de PREMIUM', 'Imágenes ilimitadas', 'Estadísticas avanzadas', 'Soporte prioritario 24/7', 'Experiencia sin anuncios'],
    color: 'from-yellow-500 to-yellow-600',
    borderColor: 'border-yellow-500',
    popular: false,
  },
];

const SubscriptionPlans = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [customPlans, setCustomPlans] = useState<any[]>([]); // ✅ NUEVO: Para planes personalizados
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const loadData = async () => {
      setLoading(true);
      try {
        // ✅ Cargar suscripción y planes personalizados
        const [subRes, plansRes] = await Promise.all([
          api.get('/subscription'),
          api.get('/subscription/plans')
        ]);
        
        setSubscription(subRes.data);
        
        // ✅ Filtrar solo los planes que NO sean FREE, BASIC, PREMIUM o VIP
        const custom = plansRes.data.filter((p: any) => 
          !['FREE', 'BASIC', 'PREMIUM', 'VIP'].includes(p.name)
        );
        setCustomPlans(custom);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate]);

  const handleUpgrade = (plan: 'BASIC' | 'PREMIUM' | 'VIP' | string) => {
    navigate(`/payment/${plan.toLowerCase()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-300">Cargando planes...</p>
        </div>
      </div>
    );
  }

  // ✅ Combinar planes por defecto + personalizados
  const allPlans = [...plans, ...customPlans];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-4 text-center drop-shadow-lg flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-indigo-300 mr-2" /> Planes de Suscripción
        </h1>
        <p className="text-center text-gray-300 mb-12 text-lg">
          Elige el plan que mejor se adapte a ti y desbloquea funciones exclusivas
        </p>

        {subscription && user?.role !== 'ADMIN' && (
          <div className="mb-8 text-center bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-xl">
            <p className="text-lg text-white">
              Tu plan actual: <span className="font-bold text-indigo-400">{subscription.plan}</span>
              {subscription.isActive && subscription.endDate && (
                <span className="text-sm text-gray-400 ml-2">
                  (Válido hasta {new Date(subscription.endDate).toLocaleDateString()})
                </span>
              )}
            </p>
          </div>
        )}

        {user?.role === 'ADMIN' && (
          <div className="mb-8 text-center bg-green-900/50 p-4 rounded-lg border border-green-500 shadow-xl">
            <p className="text-lg text-green-300 font-semibold flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-yellow-400 mr-2" /> Tienes rol de ADMINISTRADOR. Tienes acceso a TODAS las funciones de forma gratuita e ilimitada.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allPlans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col border-2 ${
                plan.popular ? `${plan.borderColor} ring-4 ring-purple-500/30 transform scale-105 z-10` : 'border-gray-700'
              }`}
            >
              <div className={`bg-gradient-to-br ${plan.color} text-white p-6 text-center`}>
                <h3 className="text-2xl font-bold mb-2">{plan.displayName || plan.name}</h3>
                <div className="text-4xl font-bold">
                  ${plan.price}
                  <span className="text-sm font-normal">/mes</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col bg-gray-800">
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="text-sm text-gray-300 flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {subscription?.plan === plan.name || user?.role === 'ADMIN' ? (
                  <button
                    disabled
                    className="w-full bg-gray-600 text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed border border-gray-500"
                  >
                    {user?.role === 'ADMIN' ? 'Acceso Total Incluido' : 'Plan Actual'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.name)}
                    className={`w-full bg-gradient-to-br ${plan.color} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-lg border border-transparent`}
                  >
                    Suscribirse
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;