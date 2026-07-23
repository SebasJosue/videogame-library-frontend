import { useNavigate } from 'react-router-dom';
import { 
  Gamepad2, 
  FileText, 
  Tags, 
  Star, 
  Users, 
  MessageSquare, 
  TrendingUp,
  Library,
  Shield,
  Headphones
} from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Gamepad2 className="w-12 h-12 text-indigo-400" />,
      title: 'Biblioteca de Videojuegos',
      description: 'Explora reseñas profesionales de los mejores videojuegos de todas las plataformas.',
    },
    {
      icon: <FileText className="w-12 h-12 text-purple-400" />,
      title: 'Publica tus Reseñas',
      description: 'Comparte tu opinión sobre tus juegos favoritos con la comunidad.',
    },
    {
      icon: <Tags className="w-12 h-12 text-pink-400" />,
      title: 'Categorías',
      description: 'Filtra juegos por género: Shooter, RPG, Acción, Terror y más.',
    },
    {
      icon: <Star className="w-12 h-12 text-yellow-400" />,
      title: 'Vota y Comenta',
      description: 'Da tu voto a las mejores reseñas y ayuda a la comunidad.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Juegos Registrados', icon: <Library className="w-6 h-6" /> },
    { number: '1,200+', label: 'Usuarios Activos', icon: <Users className="w-6 h-6" /> },
    { number: '5,000+', label: 'Reseñas Publicadas', icon: <MessageSquare className="w-6 h-6" /> },
    { number: '50+', label: 'Géneros Diferentes', icon: <Tags className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-white mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-2xl">
              <Gamepad2 className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
            Game Library
          </h1>
          <p className="text-2xl mb-8 text-gray-200 font-light">
            Tu biblioteca personal de videojuegos
          </p>
          <p className="text-lg mb-12 max-w-3xl mx-auto text-gray-300 leading-relaxed">
            Descubre, comparte y vota las mejores reseñas de videojuegos. 
            Únete a nuestra comunidad de gamers apasionados y encuentra tu próximo juego favorito.
          </p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-2xl border border-white/20 hover:shadow-indigo-500/50 hover:scale-105"
            >
              <Users className="w-5 h-5 inline mr-2" />
              Registrarse Gratis
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-gray-800/80 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-bold hover:bg-gray-700 transition-all duration-300 shadow-2xl border border-gray-600 hover:border-indigo-500 hover:scale-105"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 text-center text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-gray-700/50 hover:border-indigo-500/50 shadow-xl group"
            >
              <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Estadísticas */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-12 mb-16 border border-gray-700/50 shadow-2xl">
          <h2 className="text-4xl font-bold mb-12 text-center text-white flex items-center justify-center gap-3">
            <TrendingUp className="w-10 h-10 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Nuestra Comunidad Crece Cada Día
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="flex justify-center mb-3 text-indigo-400 group-hover:text-purple-400 transition-colors">
                  {stat.icon}
                </div>
                <div className="text-5xl font-bold text-indigo-400 mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-10 text-center border border-indigo-500/30 shadow-2xl">
          <div className="flex justify-center mb-4">
            <Headphones className="w-12 h-12 text-indigo-400" />
          </div>
          <p className="text-2xl mb-4 text-white font-semibold">
            ¿Tienes preguntas? Contáctanos en nuestro soporte.
          </p>
          <p className="text-gray-300 flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Estamos aquí para ayudarte 24/7
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-sm text-white text-center py-6 border-t border-gray-700">
        <p className="text-gray-300">© 2026 Game Library - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default Welcome;