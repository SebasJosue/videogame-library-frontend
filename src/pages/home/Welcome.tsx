import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🎮',
      title: 'Biblioteca de Videojuegos',
      description: 'Explora reseñas profesionales de los mejores videojuegos de todas las plataformas.',
    },
    {
      icon: '📝',
      title: 'Publica tus Reseñas',
      description: 'Comparte tu opinión sobre tus juegos favoritos con la comunidad.',
    },
    {
      icon: '🏷️',
      title: 'Categorías',
      description: 'Filtra juegos por género: Shooter, RPG, Acción, Terror y más.',
    },
    {
      icon: '⭐',
      title: 'Vota y Comenta',
      description: 'Da tu voto a las mejores reseñas y ayuda a la comunidad.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Juegos Registrados' },
    { number: '1,200+', label: 'Usuarios Activos' },
    { number: '5,000+', label: 'Reseñas Publicadas' },
    { number: '50+', label: 'Géneros Diferentes' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
            🎮 Game Library
          </h1>
          <p className="text-xl mb-8 text-gray-200">
            Tu biblioteca personal de videojuegos
          </p>
          <p className="text-lg mb-12 max-w-2xl mx-auto text-gray-300">
            Descubre, comparte y vota las mejores reseñas de videojuegos. 
            Únete a nuestra comunidad de gamers apasionados.
          </p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition shadow-2xl border border-white/20"
            >
              Registrarse Gratis
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-gray-800 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-700 transition shadow-2xl border border-gray-600"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-center text-white hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 hover:border-indigo-500 shadow-xl"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Estadísticas */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 mb-12 border border-gray-700 shadow-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-white drop-shadow">
            📊 Nuestra Comunidad Crece Cada Día
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-indigo-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center text-white">
          <p className="text-xl mb-4 text-gray-200">
            ¿Tienes preguntas? Contáctanos en nuestro soporte.
          </p>
          <p className="text-sm text-gray-400">
            Estamos aquí para ayudarte 24/7
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/80 text-white text-center py-4 border-t border-gray-700">
        <p>© 2026 Game Library - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default Welcome;