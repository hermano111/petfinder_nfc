import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ProductShowcase = () => {
  const [activeTab, setActiveTab] = useState('scan');

  const showcaseScreens = {
    scan: {
      title: 'Escaneo Instantáneo',
      description: 'Cuando alguien encuentra a tu mascota, simplemente acerca el teléfono a la placa NFC',
      features: ['Sin apps necesarias', 'Funciona en cualquier teléfono', 'Activación inmediata'],
      mockup: (
        <div className="bg-gray-900 rounded-3xl p-6 shadow-2xl">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 h-96 flex flex-col">
            <div className="flex items-center justify-center h-32 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center animate-pulse">
                  <Icon name="Zap" size={40} className="text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                  <Icon name="Check" size={16} />
                </div>
              </div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-gray-900">¡Placa Detectada!</h3>
              <p className="text-gray-600">Cargando información de Max...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    profile: {
      title: 'Perfil Completo',
      description: 'Información completa de tu mascota con fotos, datos médicos y contactos de emergencia',
      features: ['Fotos de alta calidad', 'Información médica', 'Contactos múltiples'],
      mockup: (
        <div className="bg-gray-900 rounded-3xl p-6 shadow-2xl">
          <div className="bg-white rounded-2xl p-6 h-96 overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-4xl">🐕</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Max</h2>
              <p className="text-blue-600 font-medium">Golden Retriever • 3 años</p>
            </div>
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-red-600" />
                  <span className="text-red-800 font-medium text-sm">Alergia a medicamentos</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Peso</p>
                  <p className="font-semibold">28 kg</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Vacunado</p>
                  <p className="font-semibold text-green-600">Al día</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    notification: {
      title: 'Notificación Inmediata',
      description: 'Recibe un mensaje de WhatsApp al instante con la ubicación exacta donde se encontró tu mascota',
      features: ['WhatsApp directo', 'Ubicación GPS', 'Contacto bidireccional'],
      mockup: (
        <div className="bg-gray-900 rounded-3xl p-6 shadow-2xl">
          <div className="bg-green-500 rounded-2xl p-6 h-96 flex flex-col text-white">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Icon name="MessageCircle" size={20} className="text-green-500" />
              </div>
              <span className="font-semibold">WhatsApp</span>
            </div>
            <div className="flex-1 space-y-4">
              <div className="bg-green-600 rounded-lg p-4 ml-8">
                <p className="text-sm">¡Hola! Encontré a tu mascota Max cerca del parque central. Está bien y seguro conmigo. 📍</p>
                <p className="text-xs opacity-75 mt-2">15:42</p>
              </div>
              <div className="bg-white text-gray-900 rounded-lg p-4 mr-8">
                <p className="text-sm">¡Gracias! ¿Podrías enviarme tu ubicación? Voy para allá ahora mismo 🙏</p>
                <p className="text-xs text-gray-500 mt-2">15:43</p>
              </div>
              <div className="bg-green-600 rounded-lg p-4 ml-8">
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={16} />
                  <span className="text-sm">Ubicación compartida</span>
                </div>
                <p className="text-xs opacity-75 mt-1">Parque Central, Plaza Norte</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  const tabs = [
    { id: 'scan', label: 'Escaneo', icon: 'Zap' },
    { id: 'profile', label: 'Perfil', icon: 'User' },
    { id: 'notification', label: 'WhatsApp', icon: 'MessageCircle' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ve cómo funciona en acción
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Desde el escaneo hasta el reencuentro, todo sucede en cuestión de minutos
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Tab navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 p-2 rounded-xl inline-flex space-x-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                    activeTab === tab?.id
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon name={tab?.icon} size={20} />
                  <span className="font-medium">{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active tab content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {showcaseScreens?.[activeTab]?.title}
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                {showcaseScreens?.[activeTab]?.description}
              </p>
              <ul className="space-y-4">
                {showcaseScreens?.[activeTab]?.features?.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Icon name="Check" size={16} className="text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              {showcaseScreens?.[activeTab]?.mockup}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;