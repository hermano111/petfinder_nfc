import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const LoginForm = ({ isActive, onSuccess }) => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Don't render if not active
  if (!isActive) {
    return null;
  }

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData?.email?.trim()) {
      setError('El correo electrónico es obligatorio');
      setLoading(false);
      return;
    }

    if (!formData?.password) {
      setError('La contraseña es obligatoria');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn(formData?.email?.trim(), formData?.password);
      
      if (result?.success) {
        onSuccess?.();
        // Show success and redirect
        setTimeout(() => {
          window.location.href = '/pet-owner-dashboard';
        }, 1000);
      } else {
        // Handle specific Supabase errors in Spanish
        let errorMessage = result?.error || 'Error al iniciar sesión';
        
        if (errorMessage?.includes('Invalid login credentials') || 
            errorMessage?.includes('invalid credentials') ||
            errorMessage?.includes('Email not confirmed')) {
          errorMessage = 'Credenciales incorrectas. Verifica tu correo y contraseña';
        } else if (errorMessage?.includes('email')) {
          errorMessage = 'Formato de correo electrónico inválido';
        } else if (errorMessage?.includes('rate limit') || errorMessage?.includes('too many')) {
          errorMessage = 'Demasiados intentos de inicio de sesión. Espera unos minutos e intenta de nuevo';
        } else if (errorMessage?.includes('Supabase project')) {
          errorMessage = 'Servicio temporalmente no disponible. Intenta de nuevo más tarde';
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      let errorMessage = 'Ocurrió un error inesperado al iniciar sesión';
      
      if (err?.message?.includes('Failed to fetch') || 
          err?.message?.includes('NetworkError') ||
          err?.name === 'TypeError' && err?.message?.includes('fetch')) {
        errorMessage = 'No se puede conectar al servicio. Verifica tu conexión a internet';
      }
      
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error when user starts typing
    if (error) setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="text-red-400 mr-3">⚠️</div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Error de Inicio de Sesión</h3>
              <div className="mt-1 text-sm text-red-700">
                {error}
              </div>
              {error?.includes('Credenciales incorrectas') && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => window.location.hash = 'register'}
                    className="text-sm text-red-600 underline hover:text-red-800"
                  >
                    ¿No tienes cuenta? Regístrate aquí
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Correo Electrónico
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData?.email}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
          placeholder="Ingresa tu correo electrónico"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData?.password}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="Ingresa tu contraseña"
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

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={formData?.rememberMe}
            onChange={handleChange}
            disabled={loading}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:bg-gray-50"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
            Recordar mi sesión
          </label>
        </div>

        <div className="text-sm">
          <button 
            type="button" 
            className="font-medium text-indigo-600 hover:text-indigo-500"
            disabled={loading}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Iniciando Sesión...
          </>
        ) : (
          'Iniciar Sesión'
        )}
      </button>

      <div className="text-center text-sm text-gray-600">
        <p>
          ¿No tienes una cuenta?{' '}
          <button
            type="button"
            onClick={() => window.location.hash = 'register'}
            className="font-medium text-indigo-600 hover:text-indigo-500"
            disabled={loading}
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;