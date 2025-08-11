import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const CTASection = () => {
  const [webhookLoading, setWebhookLoading] = useState(false);

  const handleGetStarted = async () => {
    setWebhookLoading(true);
    
    try {
      const webhookUrl = 'https://jautomations.jautomations.space/webhook/scan';
      
      const ctaData = {
        action: 'get-started-cta',
        timestamp: new Date()?.toISOString(),
        source: 'product-landing-page-cta',
        userAgent: navigator.userAgent
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ctaData)
      });

      if (response?.ok) {
        // Redirect to registration after successful webhook
        window.location.href = '/owner-login-registration';
      } else {
        throw new Error('Error en la solicitud');
      }
    } catch (error) {
      console.error('Error calling webhook:', error);
      // Still redirect to registration even if webhook fails
      window.location.href = '/owner-login-registration';
    } finally {
      setWebhookLoading(false);
    }
  };

  const urgencyFeatures = [
    {
      icon: 'Clock',
      text: 'Cada minuto cuenta cuando tu mascota está perdida'
    },
    {
      icon: 'Smartphone',
      text: 'Funciona en todos los teléfonos sin apps adicionales'
    },
    {
      icon: 'Shield',
      text: 'Garantía de satisfacción de 30 días'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Estás listo para proteger a tu mascota?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
            No esperes a que sea demasiado tarde. Miles de mascotas se pierden cada día, 
            pero las que tienen PetFinder NFC regresan a casa más rápido.
          </p>

          {/* Urgency indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {urgencyFeatures?.map((feature, index) => (
              <div key={index} className="flex items-center justify-center space-x-3 text-blue-100">
                <Icon name={feature?.icon} size={24} className="text-white" />
                <span className="text-sm md:text-base">{feature?.text}</span>
              </div>
            ))}
          </div>

          {/* Special offer banner */}
          <div className="bg-yellow-400 text-yellow-900 rounded-lg p-4 mb-8 inline-block">
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={20} />
              <span className="font-bold">Oferta Limitada:</span>
              <span>30% de descuento - Solo por tiempo limitado</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={handleGetStarted}
              disabled={webhookLoading}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {webhookLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Icon name="ShoppingCart" size={20} />
                  <span>Comprar Ahora - Desde $29</span>
                </>
              )}
            </button>
            
            <Link 
              to="/nfc-pet-profile-landing"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center space-x-2"
            >
              <Icon name="Play" size={20} />
              <span>Ver Demo Gratis</span>
            </Link>
          </div>

          {/* Trust signals */}
          <div className="text-blue-200 text-sm space-y-2">
            <div className="flex flex-wrap justify-center items-center gap-6">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} />
                <span>Compra 100% Segura</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Truck" size={16} />
                <span>Envío Gratuito</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="RefreshCw" size={16} />
                <span>Garantía 30 Días</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} />
                <span>Soporte 24/7</span>
              </div>
            </div>
            <p className="mt-4 text-xs opacity-75">
              * Activación inmediata • Sin contratos • Sin tarifas ocultas
            </p>
          </div>
        </div>

        {/* Bottom testimonial */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-center space-x-1 mb-3">
              {[...Array(5)]?.map((_, i) => (
                <Icon key={i} name="Star" size={16} className="text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-blue-100 text-center italic mb-3">
              "Invertí en PetFinder NFC después de que mi perro se perdiera por 3 días. 
              Ahora duermo tranquila sabiendo que si algo pasa, me contactarán inmediatamente."
            </p>
            <p className="text-center text-sm text-blue-200">
              - Carmen R., Madrid
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;