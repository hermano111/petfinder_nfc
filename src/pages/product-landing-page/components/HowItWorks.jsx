import React from 'react';
import Icon from '../../../components/AppIcon';

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Configura el Perfil',
      description: 'Crea el perfil de tu mascota con fotos, información médica y datos de contacto',
      icon: 'User',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      number: '2',
      title: 'Coloca la Placa NFC',
      description: 'Adjunta la placa NFC resistente al agua al collar de tu mascota',
      icon: 'Tag',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200'
    },
    {
      number: '3',
      title: 'Escaneo Automático',
      description: 'Cuando alguien encuentre a tu mascota, solo necesita acercar su teléfono',
      icon: 'Zap',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-200'
    },
    {
      number: '4',
      title: 'Notificación Inmediata',
      description: 'Recibes un WhatsApp con la ubicación y contacto de quien la encontró',
      icon: 'MessageCircle',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Cómo funciona en 4 pasos simples
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Un proceso diseñado para ser lo más simple posible tanto para ti como para quien encuentre a tu mascota
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps?.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection line */}
                {index < steps?.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-200 z-10"></div>
                )}
                
                <div className={`bg-white rounded-xl p-8 border-2 ${step?.borderColor} hover:shadow-lg transition-shadow duration-300`}>
                  <div className="flex items-start space-x-4">
                    <div className={`${step?.bgColor} rounded-full p-3 flex-shrink-0`}>
                      <Icon name={step?.icon} size={24} className={step?.color} />
                    </div>
                    <div className="flex-1">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${step?.bgColor} ${step?.color} text-sm font-bold mb-3`}>
                        {step?.number}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {step?.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo scenario */}
        <div className="mt-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Escenario de Ejemplo
            </h3>
            <p className="text-gray-600">
              Así es como funciona en una situación real
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="AlertTriangle" size={32} className="text-red-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Tu mascota se pierde</h4>
              <p className="text-sm text-gray-600">Max escapa durante un paseo en el parque</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={32} className="text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Alguien la encuentra</h4>
              <p className="text-sm text-gray-600">Una persona bondadosa ve a Max y escanea su placa</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Heart" size={32} className="text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Reencuentro feliz</h4>
              <p className="text-sm text-gray-600">Te contactan por WhatsApp y recuperas a Max</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;