import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { petService } from '../../services/petService';
import WelcomeHeader from './components/WelcomeHeader';
import DashboardStats from './components/DashboardStats';
import PetCard from './components/PetCard';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';
import EmergencyAlert from './components/EmergencyAlert';

const PetOwnerDashboard = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [todayScans, setTodayScans] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState(0);

  useEffect(() => {
    if (user?.id && !authLoading) {
      loadDashboardData();
    } else if (!authLoading && !user) {
      // User is not authenticated, stop loading
      setLoading(false);
    }
  }, [user?.id, authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userPets = await petService?.getUserPets(user?.id);
      setPets(userPets || []);
      
      // Load today's scans
      const todayScansData = await petService?.getTodayScans(user?.id);
      setTodayScans(todayScansData || []);
      
      // Load active alerts
      const alertsCount = await petService?.getActiveAlerts(user?.id);
      setActiveAlerts(alertsCount || 0);
      
      // Load recent scan activity for all pets
      const allScans = [];
      for (const pet of userPets || []) {
        const scans = await petService?.getPetScanHistory(pet?.id);
        // Transform scan data to activity format
        const petActivities = (scans || [])?.map(scan => ({
          id: scan?.id,
          type: 'scan',
          petName: pet?.name,
          petPhoto: pet?.pet_photos?.find(photo => photo?.is_primary)?.photo_url,
          timestamp: scan?.scan_timestamp, // Map scan_timestamp to timestamp
          description: getActivityDescription(scan, pet?.name),
          location: getLocationString(scan?.latitude, scan?.longitude),
          status: scan?.status,
          scanData: scan // Keep original scan data for reference
        }));
        allScans?.push(...(petActivities || []));
      }
      
      // Sort by most recent and take top 10
      allScans?.sort((a, b) => new Date(b?.timestamp) - new Date(a?.timestamp));
      setRecentScans(allScans?.slice(0, 10));
      
    } catch (err) {
      setError(err?.message || 'Failed to load dashboard data');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActivityDescription = (scan, petName) => {
    switch (scan?.status) {
      case 'found':
        return `${petName} fue encontrado por alguien`;
      case 'returned':
        return `${petName} fue devuelto a casa`;
      case 'false_alarm':
        return `Falsa alarma para ${petName}`;
      default:
        return `Escaneo de código NFC de ${petName}`;
    }
  };

  const getLocationString = (latitude, longitude) => {
    if (!latitude || !longitude) return null;
    
    // Simple formatting - in a real app you might want to use reverse geocoding
    const lat = parseFloat(latitude)?.toFixed(4);
    const lng = parseFloat(longitude)?.toFixed(4);
    return `${lat}, ${lng}`;
  };

  if (authLoading || (user && loading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            {authLoading ? 'Verificando autenticación...' : 'Cargando tu panel de control...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Preview Mode Banner - Updated messaging */}
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-blue-500 text-2xl mr-3">👀</div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Modo Vista Previa - Panel de Control</h3>
                  <p className="text-blue-700 text-sm">
                    Esta es una demostración del Panel de Propietario de Mascotas. ¡Regístrate para gestionar tus propias mascotas con perfil vacío y agregar tu información!
                  </p>
                </div>
              </div>
              <div className="space-x-3">
                <button
                  onClick={() => window.location.href = '/owner-login-registration#register'}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Crear Cuenta Nueva
                </button>
                <button
                  onClick={() => window.location.href = '/owner-login-registration#login'}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md border border-blue-300 hover:bg-blue-50 text-sm font-medium"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Show demo dashboard with example data */}
          <WelcomeHeader 
            userProfile={{ full_name: 'Usuario Demo' }}
            petCount={2}
            userName="Usuario Demo"
            currentTime={new Date()}
          />
          
          <DashboardStats 
            stats={{
              totalPets: 2,
              activeTags: 2,
              todayScans: 3,
              activeAlerts: 0
            }}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PetCard 
                  pet={{
                    id: 1,
                    name: 'Cuchu',
                    pet_type: 'dog',
                    breed: 'Golden Retriever Mix',
                    is_lost: false,
                    pet_photos: [{ photo_url: '/api/placeholder/300/300', is_primary: true }],
                    nfc_tags: [{ is_active: true }]
                  }}
                  isPreview={true}
                  onReportLost={() => {}}
                  onEditProfile={() => {}}
                  onViewHistory={() => {}}
                />
                <PetCard 
                  pet={{
                    id: 2,
                    name: 'Luna',
                    pet_type: 'cat',
                    breed: 'Persian',
                    is_lost: false,
                    pet_photos: [{ photo_url: '/api/placeholder/300/300', is_primary: true }],
                    nfc_tags: [{ is_active: true }]
                  }}
                  isPreview={true}
                  onReportLost={() => {}}
                  onEditProfile={() => {}}
                  onViewHistory={() => {}}
                />
              </div>
            </div>
            
            <div>
              <QuickActions isPreview={true} />
              <RecentActivity 
                activities={[
                  { 
                    id: 1,
                    type: 'scan',
                    timestamp: new Date()?.toISOString(), 
                    petName: 'Cuchu',
                    petPhoto: '/api/placeholder/300/300',
                    description: 'Cuchu fue escaneado por alguien',
                    location: '40.4168, -3.7038'
                  },
                  { 
                    id: 2,
                    type: 'scan', 
                    timestamp: new Date(Date.now() - 3600000)?.toISOString(), 
                    petName: 'Luna',
                    petPhoto: '/api/placeholder/300/300',
                    description: 'Luna fue escaneado por alguien',
                    location: '40.4200, -3.7100'
                  }
                ]}
                isPreview={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al Cargar Panel</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadDashboardData}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 font-medium"
          >
            Intentar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  // AUTHENTICATED USER DASHBOARD - This is the real user dashboard with EMPTY profiles for new users
  // Check for lost pets
  const lostPets = pets?.filter(pet => pet?.is_lost) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome message for NEW users with empty profiles */}
        {userProfile && pets?.length === 0 && (
          <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <div className="text-green-500 text-2xl mr-3">🎉</div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">¡Bienvenido a PetFinder, {userProfile?.full_name}!</h3>
                <p className="text-green-700 text-sm">
                  Tu cuenta ha sido creada exitosamente con un perfil vacío y limpio. Ahora puedes agregar tus mascotas y comenzar a usar el sistema de seguimiento NFC.
                </p>
                {(!userProfile?.address && !userProfile?.phone_number) && (
                  <p className="text-green-600 text-xs mt-2">
                    💡 Tu perfil está listo para que agregues tu información personal y tus mascotas.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Emergency Alert for Lost Pets */}
        {lostPets?.length > 0 && (
          <EmergencyAlert lostPets={lostPets} />
        )}

        <WelcomeHeader 
          userProfile={userProfile}
          petCount={pets?.length || 0}
          userName={userProfile?.full_name || 'Propietario de Mascotas'}
          currentTime={new Date()}
        />
        
        <DashboardStats 
          stats={{
            totalPets: pets?.length || 0,
            activeTags: pets?.reduce((acc, pet) => acc + (pet?.nfc_tags?.filter(tag => tag?.is_active)?.length || 0), 0),
            todayScans: todayScans?.length || 0,
            activeAlerts: activeAlerts
          }}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            {pets?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pets?.map((pet) => (
                  <PetCard 
                    key={pet?.id} 
                    pet={pet}
                    onPetUpdated={loadDashboardData}
                    onReportLost={() => {}}
                    onEditProfile={() => window.location.href = `/pet-profile-management?petId=${pet?.id}`}
                    onViewHistory={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">🐾</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ¡Perfil Limpio y Listo!
                </h3>
                <p className="text-gray-600 mb-2">
                  Tu cuenta nueva está lista. No hay mascotas registradas aún.
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  Agrega tu primera mascota para comenzar a usar el sistema de seguimiento NFC.
                </p>
                <button
                  onClick={() => window.location.href = '/pet-profile-management'}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-medium transition-colors duration-200 shadow-sm"
                >
                  Crear Mi Primera Mascota
                </button>
              </div>
            )}
          </div>
          
          <div>
            <QuickActions />
            <RecentActivity 
              activities={recentScans}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetOwnerDashboard;