import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-200 rounded-full opacity-20"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-indigo-200 rounded-full opacity-20"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Icon name="Shield" size={16} className="mr-2" />
              Tecnología NFC Avanzada
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Nunca Pierdas a tu 
              <span className="text-blue-600 block">Mascota Otra Vez</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Placas NFC inteligentes que conectan instantáneamente a quien encuentre a tu mascota 
              contigo mediante WhatsApp, con toda la información médica y de contacto necesaria.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="#pricing"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
              >
                <Icon name="ShoppingCart" size={20} className="mr-2" />
                Comprar Ahora
              </a>
              <Link 
                to="/nfc-pet-profile-landing"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors inline-flex items-center justify-center"
              >
                <Icon name="Play" size={20} className="mr-2" />
                Ver Demo
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-60">
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={20} className="text-green-600" />
                  <span className="text-sm font-medium">Seguro y Privado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Zap" size={20} className="text-yellow-600" />
                  <span className="text-sm font-medium">Activación Instantánea</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Smartphone" size={20} className="text-blue-600" />
                  <span className="text-sm font-medium">Compatible con Todos los Teléfonos</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Hero image/illustration */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-6 text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Smartphone" size={40} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">¡Mascota Encontrada!</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Alguien acaba de escanear la placa de Max
                </p>
                <div className="bg-white rounded-lg p-4 shadow-inner">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🐕</span>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Max</p>
                      <p className="text-sm text-gray-500">Golden Retriever</p>
                    </div>
                  </div>
                  <button className="w-full bg-green-500 text-white py-2 rounded-lg text-sm font-medium">
                    📱 Contactar por WhatsApp
                  </button>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full animate-bounce">
              <Icon name="CheckCircle" size={24} />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-3 rounded-full animate-pulse">
              <Icon name="MapPin" size={24} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;