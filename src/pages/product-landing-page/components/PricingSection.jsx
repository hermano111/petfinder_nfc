import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PricingSection = () => {
  const [webhookLoading, setWebhookLoading] = useState(null);

  const handlePurchase = async (packageType) => {
    setWebhookLoading(packageType);
    
    try {
      const webhookUrl = 'https://jautomations.jautomations.space/webhook/scan';
      
      const purchaseData = {
        package: packageType,
        timestamp: new Date()?.toISOString(),
        source: 'product-landing-page',
        userAgent: navigator.userAgent
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData)
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
      setWebhookLoading(null);
    }
  };

  const packages = [
    {
      id: 'monthly',
      name: 'Plan Mensual',
      price: '$2.000',
      originalPrice: '$2.500',
      description: 'Perfecto para dueños individuales',
      billingCycle: '/mes',
      features: [
        '7 días de prueba gratuita',
        'Mascotas ilimitadas',
        'Placas NFC ilimitadas',
        'Seguimiento GPS avanzado',
        'Notificaciones WhatsApp ilimitadas',
        'Historial médico completo',
        'Contactos de emergencia múltiples',
        'Analíticas y reportes',
        'Soporte prioritario 24/7'
      ],
      popular: false,
      color: 'blue',
      buttonText: 'Comenzar Prueba Gratuita',
      trialBadge: '7 días gratis'
    },
    {
      id: 'annual',
      name: 'Plan Anual',
      price: '$20.000',
      originalPrice: '$24.000',
      description: 'Ideal para familias y criadores',
      billingCycle: '/año',
      savings: 'Ahorra $4.000',
      features: [
        '7 días de prueba gratuita',
        'Mascotas ilimitadas',
        'Placas NFC ilimitadas',
        'Seguimiento GPS avanzado',
        'Notificaciones WhatsApp ilimitadas',
        'Historial médico completo',
        'API para integración empresarial',
        'Dashboard administrativo avanzado',
        'Soporte prioritario 24/7',
        'Respaldo automático de datos'
      ],
      popular: true,
      color: 'green',
      buttonText: 'Comenzar Prueba Gratuita',
      trialBadge: '7 días gratis'
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Precios actualizados 2025
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Protección integral para tus mascotas con tecnología de última generación. Todos los planes incluyen 7 días de prueba gratuita.
          </p>
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mt-6">
            <Icon name="Gift" size={16} className="mr-2" />
            7 días de prueba gratuita - Sin compromiso
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {packages?.map((pkg) => (
            <div 
              key={pkg?.id}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                pkg?.popular ? 'ring-2 ring-green-500 scale-105' : ''
              }`}
            >
              {pkg?.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Más Popular - {pkg?.savings}
                  </div>
                </div>
              )}

              {pkg?.trialBadge && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {pkg?.trialBadge}
                  </div>
                </div>
              )}
              
              <div className={`p-8 ${pkg?.popular ? 'pt-16' : 'pt-12'}`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg?.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg?.description}</p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-4xl font-bold text-gray-900">{pkg?.price}</span>
                    <div className="text-left">
                      <div className="text-lg text-gray-500 line-through">{pkg?.originalPrice}</div>
                      <div className="text-sm text-gray-500">{pkg?.billingCycle}</div>
                    </div>
                  </div>
                  {pkg?.savings && (
                    <div className="text-sm text-green-600 font-medium mt-2">
                      <Icon name="TrendingDown" size={14} className="inline mr-1" />
                      {pkg?.savings} vs. plan mensual
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg?.features?.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className={`w-5 h-5 ${index === 0 ? 'bg-blue-100' : 'bg-green-100'} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Icon 
                          name={index === 0 ? "Gift" : "Check"} 
                          size={12} 
                          className={index === 0 ? 'text-blue-600' : 'text-green-600'} 
                        />
                      </div>
                      <span className={`text-gray-700 text-sm ${index === 0 ? 'font-semibold text-blue-700' : ''}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(pkg?.id)}
                  disabled={webhookLoading === pkg?.id}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                    pkg?.popular
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  } ${
                    webhookLoading === pkg?.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {webhookLoading === pkg?.id ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Procesando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Icon name="Gift" size={20} />
                      <span>{pkg?.buttonText}</span>
                    </div>
                  )}
                </button>

                <div className="text-center mt-4">
                  <div className="flex items-center justify-center text-xs text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <Icon name="Shield" size={12} className="mr-1" />
                      <span>Sin compromiso</span>
                    </div>
                    <div className="flex items-center">
                      <Icon name="CreditCard" size={12} className="mr-1" />
                      <span>Cancela cuando quieras</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg p-8 shadow-sm max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir nuestro servicio?
            </h3>
            <p className="text-gray-600 mb-6">
              La plataforma más completa de Argentina para proteger a tus mascotas con tecnología NFC de última generación
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Shield" size={16} className="text-green-600" />
                <span>Garantía de 30 días</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Truck" size={16} className="text-blue-600" />
                <span>Envío gratuito</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Icon name="CreditCard" size={16} className="text-purple-600" />
                <span>Pago 100% seguro</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Clock" size={16} className="text-orange-600" />
                <span>Soporte 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;