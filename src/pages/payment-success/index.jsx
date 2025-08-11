import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Calendar, Heart, ArrowRight, Download, Share2, Settings, Smartphone, Tag } from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';
import { useAuth } from '../../contexts/AuthContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      loadUserSubscription();
    }
  }, [user?.id]);

  useEffect(() => {
    // Auto redirect countdown
    const timer = setInterval(() => {
      setRedirectCountdown(prev => {
        if (prev <= 1) {
          navigate('/pet-owner-dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const loadUserSubscription = async () => {
    try {
      const { data, error } = await subscriptionService?.getUserActiveSubscription(user?.id);
      if (!error && data) {
        setSubscription(data);
      }
    } catch (err) {
      console.error('Error loading subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToDashboard = () => {
    navigate('/pet-owner-dashboard');
  };

  const handleCompleteProfile = () => {
    navigate('/pet-profile-management');
  };

  const handleOrderNFC = () => {
    // For now, redirect to main landing page with NFC section
    navigate('/product-landing-page#nfc-tags');
  };

  const handleShareSuccess = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Pet Safety First',
        text: '¡Acabo de suscribirme a Pet Safety First para proteger a mis mascotas! 🐕🐱',
        url: window.location?.origin
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = '¡Acabo de suscribirme a Pet Safety First para proteger a mis mascotas! 🐕🐱 ' + window.location?.origin;
      navigator.clipboard?.writeText(text);
      alert('¡Link copiado al portapapeles!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">Verificando tu suscripción...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-green-600 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¡Pago Exitoso! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tu suscripción está activa. Ahora tienes acceso ilimitado para proteger a todas tus mascotas.
          </p>
        </div>

        {/* Subscription Details */}
        {subscription && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Detalles de tu Suscripción
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Plan:</span>
                  <span className="font-bold text-blue-600">{subscription?.plan_name}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Estado:</span>
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Activo
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Tipo de Plan:</span>
                  <span className="capitalize">{subscription?.plan_type === 'monthly' ? 'Mensual' : 'Anual'}</span>
                </div>
                
                {subscription?.expires_at && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Próximo pago:</span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {new Date(subscription.expires_at)?.toLocaleDateString('es-AR')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Premium Features Unlocked */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                🚀 Características Premium Activadas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Mascotas Ilimitadas</p>
                </div>
                <div className="text-center">
                  <Tag className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Placas NFC Ilimitadas</p>
                </div>
                <div className="text-center">
                  <Settings className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Análiticas Avanzadas</p>
                </div>
                <div className="text-center">
                  <Smartphone className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Soporte Prioritario</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Complete Profile */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Completa el Perfil de tu Mascota
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Agrega fotos, información médica y contactos de emergencia
            </p>
            <button
              onClick={handleCompleteProfile}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Completar Perfil
            </button>
          </div>

          {/* Order NFC Tags */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Ordena tus Placas NFC
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Recomendamos 2-3 placas por mascota para collar, arnés y portador
            </p>
            <button
              onClick={handleOrderNFC}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Ver Placas NFC
            </button>
          </div>

          {/* Download App */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Descarga la App Móvil
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Gestiona todo desde tu teléfono con notificaciones en tiempo real
            </p>
            <button
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              disabled
            >
              Próximamente
            </button>
          </div>
        </div>

        {/* Support & Sharing */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Customer Support */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              📧 Confirmación por Email
            </h3>
            <p className="text-gray-600 mb-4">
              Hemos enviado los detalles de tu suscripción a <strong>{user?.email}</strong>
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Factura detallada</p>
              <p>• Instrucciones de configuración</p>
              <p>• Enlaces de soporte técnico</p>
            </div>
            <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
              ¿No recibiste el email? Reenviar
            </button>
          </div>

          {/* Social Sharing */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              🎉 ¡Comparte tu Compromiso!
            </h3>
            <p className="text-gray-600 mb-4">
              Deja que tus amigos sepan que prioritizas la seguridad de tus mascotas
            </p>
            <button
              onClick={handleShareSuccess}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartir en Redes Sociales
            </button>
          </div>
        </div>

        {/* Continue to Dashboard */}
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-lg p-6 inline-block">
            <p className="text-gray-600 mb-4">
              Redireccionando a tu panel en <strong>{redirectCountdown}</strong> segundos...
            </p>
            <button
              onClick={handleContinueToDashboard}
              className="bg-blue-600 text-white py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors flex items-center mx-auto font-semibold"
            >
              Ir al Panel Ahora
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center text-green-600 bg-green-50 px-6 py-3 rounded-full">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span className="font-medium">Garantía de devolución de 30 días</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;