import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { CreditCard, Lock, X, AlertCircle } from 'lucide-react';

// ✅ CLAVE PÚBLICA DE STRIPE
const stripePromise = loadStripe('pk_test_51Tw4wdPlAEUIa30gaPGC3VzdorwWfaxdxMt5qD0jYsJFckLvZ2faml4uFDrglnAVdFvBoCq6XVfFjAEHfiDefc5K00MPjkVYmj');

// Planes por defecto como fallback
const defaultPlans: Record<string, number> = {
  basic: 4.99,
  premium: 9.99,
  vip: 19.99,
};

interface Plan {
  id?: string;
  name: string;
  displayName?: string;
  price: number;
  features?: string[];
  description?: string;
  color?: string;
}

const PaymentForm = ({ planName, price, onPaymentSuccess }: { 
  planName: string; 
  price: number;
  onPaymentSuccess: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [cardData, setCardData] = useState({
    name: '',
    email: user?.email || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!stripe || !elements) {
      setError('Stripe no está cargado correctamente');
      return;
    }

    setLoading(true);

    try {
      const { data: { clientSecret } } = await api.post('/subscription/create-payment-intent', {
        plan: planName.toUpperCase(),
        amount: Math.round(price * 100),
        currency: 'usd',
      });

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: cardData.name,
            email: cardData.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message || 'Error en el pago');
      } else {
        if (result.paymentIntent?.status === 'succeeded') {
          await api.post(`/subscription/upgrade/${planName.toUpperCase()}`);
          onPaymentSuccess();
        }
      }
    } catch (err: any) {
      console.error('Error detallado:', err);
      setError(err.response?.data?.message || err.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Completar Pago</h2>
          <p className="text-gray-400 text-center mb-8">
            Plan {planName.toUpperCase()} - ${price}/mes
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Nombre del titular de la tarjeta</label>
              <input 
                type="text" 
                value={cardData.name} 
                onChange={(e) => setCardData({ ...cardData, name: e.target.value })} 
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" 
                placeholder="Juan Pérez" 
                required 
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Correo electrónico</label>
              <input 
                type="email" 
                value={cardData.email} 
                onChange={(e) => setCardData({ ...cardData, email: e.target.value })} 
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" 
                placeholder="tu@email.com"
                required 
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Datos de la tarjeta</label>
              <div className="bg-gray-700 border border-gray-600 rounded-xl p-4">
                <CardElement 
                  options={{ 
                    style: { 
                      base: { 
                        fontSize: '16px', 
                        color: '#fff', 
                        '::placeholder': { color: '#9ca3af' } 
                      } 
                    },
                    hidePostalCode: true,
                  }} 
                />
              </div>
              <p className="text-xs text-yellow-400 mt-2">💡 Prueba: 4242 4242 4242 4242 | 12/25 | 123</p>
            </div>
            
            <div className="bg-indigo-900/30 border border-indigo-500/50 rounded-xl p-4 flex items-start gap-3">
              <Lock className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-indigo-300 font-semibold">Pago Seguro</p>
                <p className="text-gray-400 text-sm">Tu información está encriptada. No almacenamos los datos de tu tarjeta.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => window.history.back()} 
                className="flex-1 bg-gray-600 text-white py-3 rounded-xl hover:bg-gray-700 transition font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" /> Cancelar
              </button>
              <button 
                type="submit" 
                disabled={loading || !stripe} 
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-5 h-5" /> {loading ? 'Procesando...' : `Pagar $${price}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Payment = () => {
  const { plan } = useParams<{ plan: string }>();
  const navigate = useNavigate();
  const [price, setPrice] = useState<number>(0);
  const [planName, setPlanName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPlanDetails = async () => {
      if (!plan) {
        navigate('/subscription');
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        // ✅ Timeout de 5 segundos para evitar carga infinita
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // Intentar obtener el plan desde la API
        const response = await api.get('/subscription/plans', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const plans: Plan[] = response.data;
        
        // Buscar el plan por nombre (case-insensitive)
        const foundPlan = plans.find((p) => 
          p.name.toLowerCase() === plan.toLowerCase()
        );

        if (foundPlan) {
          setPrice(foundPlan.price);
          setPlanName(foundPlan.displayName || foundPlan.name);
        } else {
          // Si no existe en la API, usar los planes por defecto
          const defaultPrice = defaultPlans[plan.toLowerCase()];
          if (defaultPrice) {
            setPrice(defaultPrice);
            setPlanName(plan.toUpperCase());
          } else {
            throw new Error(`Plan "${plan}" no encontrado`);
          }
        }
      } catch (err: any) {
        console.error('Error al cargar plan:', err);
        
        // Si es timeout o error de red, intentar con planes por defecto
        if (err.name === 'AbortError' || err.code === 'ERR_NETWORK') {
          const defaultPrice = defaultPlans[plan.toLowerCase()];
          if (defaultPrice) {
            setPrice(defaultPrice);
            setPlanName(plan.toUpperCase());
            setError('Usando plan por defecto (error de conexión con el servidor)');
          } else {
            setError(`No se pudo cargar el plan "${plan}". Redirigiendo...`);
            setTimeout(() => navigate('/subscription'), 3000);
            return;
          }
        } else {
          // Si no es error de red, usar planes por defecto
          const defaultPrice = defaultPlans[plan.toLowerCase()];
          if (defaultPrice) {
            setPrice(defaultPrice);
            setPlanName(plan.toUpperCase());
          } else {
            setError(`Plan "${plan}" no encontrado. Redirigiendo...`);
            setTimeout(() => navigate('/subscription'), 3000);
            return;
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [plan, navigate]);

  const handlePaymentSuccess = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-300">Cargando información del plan...</p>
          <p className="text-sm text-gray-400 mt-2">Si tarda más de 5 segundos, recarga la página</p>
        </div>
      </div>
    );
  }

  if (error && !planName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center bg-gray-800 p-8 rounded-2xl border border-gray-700">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => navigate('/subscription')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Volver a Planes
          </button>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm 
        planName={planName} 
        price={price} 
        onPaymentSuccess={handlePaymentSuccess}
      />
    </Elements>
  );
};

export default Payment;