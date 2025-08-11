import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Shield, Users, Zap, Clock, Gift } from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';
import { useAuth } from '../../contexts/AuthContext';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSubscription, setActiveSubscription] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPlansAndSubscription();
  }, [user?.id]);

  const loadPlansAndSubscription = async () => {
    try {
      setLoading(true);
      
      // Load subscription plans
      const { data: plansData, error: plansError } = await subscriptionService?.getSubscriptionPlans();
      if (plansError) throw new Error(plansError);
      
      setPlans(plansData || []);

      // Load user's active subscription if authenticated
      if (user?.id) {
        const { data: subscription, error: subError } = await subscriptionService?.getUserActiveSubscription(user?.id);
        if (!subError && subscription) {
          setActiveSubscription(subscription);
        }
      }
    } catch (err) {
      setError('Error loading subscription plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (plan) => {
    if (!user?.id) {
      navigate('/owner-login-registration');
      return;
    }
    
    // Redirect to MercadoPago checkout
    window.location.href = plan?.mercadopago_checkout_url;
  };

  const formatPrice = (amount, currency = 'ARS') => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency
    })?.format(amount);
  };

  const calculateSavings = () => {
    const monthlyPlan = plans?.find(p => p?.plan_type === 'monthly');
    const annualPlan = plans?.find(p => p?.plan_type === 'annual');
    
    if (!monthlyPlan || !annualPlan) return 0;
    
    const yearlyWithMonthly = monthlyPlan?.price_amount * 12;
    const savings = yearlyWithMonthly - annualPlan?.price_amount;
    return savings;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">Cargando planes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button 
            onClick={loadPlansAndSubscription}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const savings = calculateSavings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Planes de Suscripción 2025
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Protección completa para tus mascotas con tecnología NFC de última generación. Todos los planes incluyen 7 días de prueba gratuita.
            </p>
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mt-4">
              <Gift className="h-4 w-4 mr-2" />
              7 días de prueba gratuita - Sin compromiso
            </div>
          </div>
        </div>
      </div>

      {/* Active Subscription Banner */}
      {activeSubscription && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-4 mt-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">
                <strong>Suscripción Activa:</strong> {activeSubscription?.plan_name} 
                {activeSubscription?.expires_at && (
                  <span className="ml-2">
                    (vence el {new Date(activeSubscription.expires_at)?.toLocaleDateString('es-AR')})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trust Indicators */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-8 text-gray-600">
            <div className="flex items-center">
              <Shield className="h-6 w-6 mr-2 text-green-600" />
              <span>Seguro y Confiable</span>
            </div>
            <div className="flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-600" />
              <span>Más de 15,000+ usuarios</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-6 w-6 mr-2 text-yellow-600" />
              <span>Activación Instantánea</span>
            </div>
            <div className="flex items-center">
              <Gift className="h-6 w-6 mr-2 text-purple-600" />
              <span>Prueba Gratuita 7 días</span>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans?.map((plan) => {
            const isAnnual = plan?.plan_type === 'annual';
            const features = plan?.features || [];
            
            return (
              <div
                key={plan?.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 relative ${
                  isAnnual ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {isAnnual && (
                  <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm font-medium">
                    <Star className="inline h-4 w-4 mr-1" />
                    Más Popular - Ahorra {formatPrice(savings)}
                  </div>
                )}

                {/* Free Trial Badge */}
                <div className="absolute -top-2 -right-2">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    7 días gratis
                  </div>
                </div>
                
                <div className={`p-8 ${isAnnual ? 'pt-16' : 'pt-12'}`}>
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan?.name}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {plan?.description}
                    </p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(plan?.price_amount)}
                      </span>
                      <span className="text-gray-600 ml-2">
                        /{isAnnual ? 'año' : 'mes'}
                      </span>
                      {isAnnual && (
                        <div className="text-sm text-green-600 font-medium mt-1">
                          <Gift className="inline h-4 w-4 mr-1" />
                          Equivale a {formatPrice(plan?.price_amount / 12)}/mes
                        </div>
                      )}
                    </div>

                    {/* Free Trial Highlight */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                      <div className="flex items-center justify-center text-blue-700 text-sm font-semibold">
                        <Gift className="h-4 w-4 mr-2" />
                        Incluye 7 días de prueba gratuita
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        Cancela cuando quieras, sin compromiso
                      </p>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    {features?.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className={`h-5 w-5 mr-3 flex-shrink-0 ${
                          feature?.includes('7 días') ? 'text-blue-500' : 'text-green-500'
                        }`} />
                        <span className={`text-gray-700 ${
                          feature?.includes('7 días') ? 'font-semibold text-blue-700' : ''
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Subscribe Button */}
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={activeSubscription?.plan_type === plan?.plan_type}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center ${
                      activeSubscription?.plan_type === plan?.plan_type
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : isAnnual
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                        : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg'
                    }`}
                  >
                    {activeSubscription?.plan_type === plan?.plan_type ? (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Plan Actual
                      </>
                    ) : (
                      <>
                        <Gift className="h-5 w-5 mr-2" />
                        Comenzar Prueba Gratuita
                      </>
                    )}
                  </button>

                  {/* Payment Info */}
                  <div className="text-center mt-4">
                    <div className="flex items-center justify-center text-xs text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>7 días gratis</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        <span>Sin compromiso</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="text-xl font-bold text-gray-900">
              Comparación de Características
            </h3>
            <p className="text-gray-600 mt-1">
              Ambos planes incluyen todas las características premium
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Características</h4>
                <div className="space-y-3 text-left">
                  <div>Mascotas ilimitadas</div>
                  <div>Placas NFC ilimitadas</div>
                  <div>Seguimiento GPS</div>
                  <div>Historial de escaneos</div>
                  <div>Alertas de ubicación</div>
                  <div>Soporte prioritario</div>
                  <div>Análiticas avanzadas</div>
                  <div>Respaldo automático</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Plan Mensual</h4>
                <div className="space-y-3 text-green-600">
                  <div><Check className="h-4 w-4 inline" /></div>
                  <div><Check className="h-4 w-4 inline" /></div>
                  <div><Check className="h-4 w-4 inline" /></div>
                  <div><Check className="h-4 w-4 inline" /></div>
                  <div><Check className="h-4 w-4 inline" /></div>
                  <div><Check className="h-4 w-4 inline" /></div>
                  <div><Check className="h-4 w-4 inline" /></div>
                  <div><Check className="h-4 w-4 inline" /></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Plan Anual</h4>
                <div className="space-y-3 text-green-600">
                  <div><Check className="h-4 w-4 inline" /></div>
                  <div><Check className="h-4 w-4 inline" /></div>
                  <div><Check className="h-4 w-4 inline" /></div>
                  <div><Check className="h-4 w-4 inline" /></div>
                  <div><Check className="h-4 w-4 inline" /></div>
                  <div><Check className="h-4 w-4 inline" /></div>
                  <div><Check className="h-4 w-4 inline" /></div>
                  <div><Check className="h-4 w-4 inline" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Support */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Gift className="h-6 w-6 mr-2 text-blue-600" />
              Prueba Gratuita de 7 Días
            </h3>
            <p className="text-gray-600 mb-4">
              Comienza tu experiencia sin costo alguno. Explora todas las funciones premium durante una semana completa.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Acceso completo a todas las funciones</li>
              <li>• Sin necesidad de tarjeta de crédito</li>
              <li>• Cancela cuando quieras sin costo</li>
              <li>• Activación inmediata</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-green-600" />
              Pago Seguro
            </h3>
            <p className="text-gray-600 mb-4">
              Procesado de forma segura a través de MercadoPago, la plataforma de pagos más confiable de Argentina.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Encriptación SSL de 256 bits</li>
              <li>• Datos protegidos según PCI DSS</li>
              <li>• Política de reembolso de 30 días</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;