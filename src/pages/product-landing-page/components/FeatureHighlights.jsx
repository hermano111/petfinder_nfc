import React from 'react';
import Icon from '../../../components/AppIcon';

const FeatureHighlights = () => {
  const features = [
    {
      icon: 'Zap',
      title: 'Notificaciones Instantáneas',
      description: 'Recibe un mensaje de WhatsApp en el momento exacto que alguien encuentre a tu mascota, sin demoras.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      icon: 'FileText',
      title: 'Perfil Completo de Mascota',
      description: 'Información detallada incluyendo fotos, datos médicos, alergias y contactos de emergencia.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: 'Activity',
      title: 'Historial Médico Digital',
      description: 'Almacena vacunas, medicamentos y condiciones médicas importantes para emergencias.',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      icon: 'BarChart3',
      title: 'Análisis de Escaneos',
      description: 'Ve cuándo y dónde han escaneado la placa de tu mascota con estadísticas detalladas.',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: 'Shield',
      title: 'Privacidad y Seguridad',
      description: 'Tus datos están protegidos. Solo compartes la información necesaria para el reencuentro.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: 'Globe',
      title: 'Funciona en Cualquier Lugar',
      description: 'Compatible con todos los smartphones modernos, sin necesidad de apps adicionales.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Características que marcan la diferencia
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tecnología avanzada diseñada específicamente para la seguridad de tu mascota
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features?.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`w-12 h-12 ${feature?.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <Icon name={feature?.icon} size={24} className={feature?.color} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature?.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature?.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-20 bg-white rounded-2xl p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Tiempo de actividad</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">&lt;30s</div>
              <div className="text-gray-600">Tiempo de respuesta</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Disponibilidad</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
              <div className="text-gray-600">Compatible móviles</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;