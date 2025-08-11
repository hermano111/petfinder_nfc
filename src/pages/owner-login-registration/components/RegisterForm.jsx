import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const RegisterForm = ({ isActive, onSuccess }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Don't render if not active
  if (!isActive) {
    return null;
  }

  const handleSubmit = async (e) => {
    // Prevent default form submission behavior
    e?.preventDefault();
    e?.stopPropagation();
    
    console.log('Form submitted', { loading, formData }); // Debug log
    
    // Prevent double submission
    if (loading) {
      console.log('Submission blocked due to loading state');
      return;
    }
    
    setLoading(true);
    setError(null);

    // Validation
    if (!formData?.fullName?.trim()) {
      setError('El nombre completo es obligatorio');
      setLoading(false);
      return;
    }

    if (!formData?.email?.trim()) {
      setError('El correo electrónico es obligatorio');
      setLoading(false);
      return;
    }

    if (!formData?.password || formData?.password?.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (formData?.password !== formData?.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (!formData?.agreeToTerms) {
      setError('Debes aceptar los Términos de Servicio y Política de Privacidad');
      setLoading(false);
      return;
    }

    try {
      console.log('Calling signUp...'); // Debug log
      const result = await signUp(
        formData?.email?.trim(), 
        formData?.password, 
        formData?.fullName?.trim()
      );
      
      console.log('SignUp result:', result); // Debug log
      
      if (result?.success) {
        setSuccess(true);
        onSuccess?.();
        
        // Clear form data
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          agreeToTerms: false
        });
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/pet-owner-dashboard';
        }, 1500);
      } else {
        // Handle specific Supabase errors in Spanish
        let errorMessage = result?.error || 'Error en el registro';
        
        if (errorMessage?.includes('already registered') || errorMessage?.includes('already exists')) {
          errorMessage = 'Esta dirección de correo ya está registrada. ¿Ya tienes una cuenta?';
        } else if (errorMessage?.includes('password')) {
          errorMessage = 'La contraseña no cumple con los requisitos mínimos';
        } else if (errorMessage?.includes('email')) {
          errorMessage = 'Formato de correo electrónico inválido';
        } else if (errorMessage?.includes('rate limit') || errorMessage?.includes('too many')) {
          errorMessage = 'Demasiados intentos de registro. Espera unos minutos e intenta de nuevo';
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Registration error:', err);
      let errorMessage = 'Ocurrió un error inesperado durante el registro';
      
      if (err?.message?.includes('Failed to fetch') || 
          err?.message?.includes('NetworkError') ||
          err?.name === 'TypeError' && err?.message?.includes('fetch')) {
        errorMessage = 'No se puede conectar al servicio. Tu proyecto de Supabase puede estar pausado o inactivo. Por favor revisa tu panel de Supabase.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target || {};
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  // Handle button click explicitly
  const handleButtonClick = (e) => {
    console.log('Button clicked'); // Debug log
    // Don't prevent default here - let form submission handle it
    if (loading) {
      e?.preventDefault();
      return;
    }
    // The form onSubmit will handle the rest
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Registro Exitoso!
        </h3>
        <p className="text-gray-600 mb-4">
          ¡Bienvenido a PetFinder! Tu perfil ha sido creado correctamente.
        </p>
        <p className="text-gray-600 mb-4">
          Ya puedes gestionar tus mascotas y etiquetas NFC.
        </p>
        <div className="text-sm text-gray-500">
          Redirigiendo a tu panel de control personal...
        </div>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="text-red-400 mr-3">⚠️</div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Error de Registro</h3>
              <div className="mt-1 text-sm text-red-700">
                {error}
              </div>
              {error?.includes('Supabase') && (
                <div className="mt-2 text-xs text-red-600">
                  <p>Por favor verifica la configuración de tu proyecto Supabase:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Asegúrate de que tu proyecto no esté pausado</li>
                    <li>Verifica tus variables de entorno</li>
                    <li>Revisa la configuración de autenticación por email</li>
                  </ul>
                </div>
              )}
              {error?.includes('ya está registrada') && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => window.location.hash = 'login'}
                    className="text-sm text-red-600 underline hover:text-red-800"
                  >
                    ¿Ya tienes cuenta? Inicia sesión aquí
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre Completo *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData?.fullName || ''}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="Ingresa tu nombre completo"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Correo Electrónico *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData?.email || ''}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="Ingresa tu correo electrónico"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData?.password || ''}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Crea una contraseña (mínimo 6 caracteres)"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar Contraseña *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData?.confirmPassword || ''}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Confirma tu contraseña"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:text-gray-300"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData?.agreeToTerms || false}
              onChange={handleChange}
              required
              disabled={loading}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:bg-gray-50"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="agreeToTerms" className="text-gray-700">
              Acepto los{' '}
              <button type="button" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Términos de Servicio
              </button>{' '}
              y la{' '}
              <button type="button" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Política de Privacidad
              </button>
            </label>
          </div>
        </div>

        <button
          type="submit"
          onClick={handleButtonClick}
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Creando Cuenta...
            </>
          ) : (
            'Crear Cuenta'
          )}
        </button>

        <div className="text-center text-sm text-gray-600">
          <p>
            ¿Ya tienes una cuenta?{' '}
            <button
              type="button"
              onClick={() => window.location.hash = 'login'}
              className="font-medium text-indigo-600 hover:text-indigo-500"
              disabled={loading}
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;