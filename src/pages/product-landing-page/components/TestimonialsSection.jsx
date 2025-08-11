import React from 'react';
import Icon from '../../../components/AppIcon';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'María González',
      role: 'Dueña de Luna (Golden Retriever)',
      image: '🐕‍🦺',
      rating: 5,
      text: 'Luna se escapó durante una tormenta y estaba desesperada. Gracias a la placa NFC, me contactaron por WhatsApp en menos de una hora. ¡Es increíble la tranquilidad que me da!',
      location: 'Madrid, España'
    },
    {
      name: 'Carlos Martínez',
      role: 'Dueño de Max y Bella',
      image: '🐱',
      rating: 5,
      text: 'Tengo dos gatos aventureros y esta tecnología ha sido un salvavidas. El perfil médico completo ayudó mucho cuando Max tuvo una emergencia veterinaria.',
      location: 'Barcelona, España'
    },
    {
      name: 'Ana López',
      role: 'Refugio "Patitas Felices"',
      image: '🏠',
      rating: 5,
      text: 'Como refugio, hemos adoptado este sistema para todos nuestros rescates. Los nuevos dueños se sienten mucho más seguros y hemos evitado varias pérdidas.',
      location: 'Valencia, España'
    },
    {
      name: 'José Ruiz',
      role: 'Encontró a Rocky perdido',
      image: '👨‍🦳',
      rating: 5,
      text: 'Encontré un perro perdido en el parque. Solo acerqué mi teléfono y automáticamente me salió toda la información. Pude contactar al dueño de inmediato. ¡Súper fácil!',
      location: 'Sevilla, España'
    }
  ];

  const successStories = [
    {
      title: '2,847 Mascotas Reunidas',
      subtitle: 'En los últimos 6 meses',
      icon: 'Heart',
      color: 'text-red-500'
    },
    {
      title: 'Tiempo Promedio: 47 min',
      subtitle: 'Desde pérdida hasta contacto',
      icon: 'Clock',
      color: 'text-blue-500'
    },
    {
      title: '98.3% Éxito',
      subtitle: 'Tasa de reunificación',
      icon: 'TrendingUp',
      color: 'text-green-500'
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Historias reales de reencuentros exitosos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Miles de familias ya confían en PetFinder NFC para mantener a sus mascotas seguras
          </p>
        </div>

        {/* Success stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          {successStories?.map((story, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 ${story?.color?.replace('text-', 'bg-')?.replace('500', '100')} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon name={story?.icon} size={32} className={story?.color} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{story?.title}</h3>
              <p className="text-gray-600">{story?.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials?.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl p-8 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{testimonial?.image}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(testimonial?.rating)]?.map((_, i) => (
                      <Icon key={i} name="Star" size={16} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed italic">
                    "{testimonial?.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial?.name}</p>
                    <p className="text-sm text-gray-600">{testimonial?.role}</p>
                    <p className="text-xs text-gray-500 mt-1">{testimonial?.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Before/After comparison */}
        <div className="mt-20 bg-gradient-to-r from-red-50 via-white to-green-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Antes vs Después de PetFinder NFC
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-red-600 mb-4 flex items-center">
                <Icon name="X" size={20} className="mr-2" />
                Sin PetFinder NFC
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Carteles pegados por toda la ciudad
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Días de búsqueda desesperada
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Información de contacto desactualizada
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Sin información médica disponible
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Dependes de la buena voluntad de extraños
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-600 mb-4 flex items-center">
                <Icon name="Check" size={20} className="mr-2" />
                Con PetFinder NFC
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Notificación inmediata por WhatsApp
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Reencuentro en minutos, no días
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Información siempre actualizada
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Historial médico completo disponible
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Sistema automatizado y confiable
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;