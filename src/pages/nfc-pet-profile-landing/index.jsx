import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { nfcService } from '../../services/nfcService';
import { petService } from '../../services/petService';
import EmergencyHeader from './components/EmergencyHeader';
import PetBasicInfo from './components/PetBasicInfo';
import PetPhotoCarousel from './components/PetPhotoCarousel';
import MedicalAlertsSection from './components/MedicalAlertsSection';
import ContactOwnerSection from './components/ContactOwnerSection';
import RewardInfoSection from './components/RewardInfoSection';
import LocationCapture from './components/LocationCapture';

const NFCPetProfileLanding = () => {
  const { tagId } = useParams();
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState(null);
  
  // Refs to prevent duplicate webhook calls
  const webhookExecutedRef = useRef(false);
  const webhookTimeoutRef = useRef(null);
  const componentMountedRef = useRef(true);

  useEffect(() => {
    componentMountedRef.current = true;
    
    const loadPetData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Extract tag identifier from URL - enhanced error handling
        const tagIdentifier = tagId || 'DEMO_TAG';

        if (!tagIdentifier) {
          throw new Error('No se proporcionó identificador de placa NFC válido en la URL.');
        }

        console.log('🔍 Looking up NFC tag from URL:', tagIdentifier);

        // Use nfcService directly for better error handling
        const data = await nfcService?.getNFCTagByIdentifier(tagIdentifier);
        
        if (!data || !data?.pets) {
          throw new Error(`La placa NFC "${tagIdentifier}" no está registrada o no está vinculada a ninguna mascota.`);
        }

        console.log('✅ Pet data found via NFC service:', data);
        setPetData(data);

        // SINGLE WEBHOOK TRIGGER with debouncing and duplicate prevention
        if (data?.pets && data?.pets?.id && !webhookExecutedRef?.current && componentMountedRef?.current) {
          // Mark as executed immediately to prevent duplicates
          webhookExecutedRef.current = true;
          
          // Clear any existing timeout
          if (webhookTimeoutRef?.current) {
            clearTimeout(webhookTimeoutRef?.current);
          }
          
          // Debounced webhook execution (300ms delay)
          webhookTimeoutRef.current = setTimeout(async () => {
            if (!componentMountedRef?.current) return;
            
            try {
              // Set processing status immediately
              setWebhookStatus({
                success: false,
                message: 'Notificando al dueño...',
                processing: true
              });

              // Try to get location for automatic scan
              if (navigator.geolocation) {
                navigator.geolocation?.getCurrentPosition(
                  async (position) => {
                    if (!componentMountedRef?.current) return;
                    
                    // Location available - send webhook with location
                    try {
                      const result = await petService?.recordAutomaticPetScan(
                        tagIdentifier,
                        {
                          latitude: position?.coords?.latitude,
                          longitude: position?.coords?.longitude
                        }
                      );
                      
                      if (componentMountedRef?.current) {
                        setNotificationSent(result?.success);
                        setLocationCaptured(true);
                        setWebhookStatus({
                          success: result?.webhook_sent,
                          message: result?.webhook_message || 'Webhook notification attempted',
                          processing: false
                        });
                      }
                    } catch (err) {
                      console.error('❌ Error in automatic scan with location:', err);
                      // Fallback - try without location
                      if (componentMountedRef?.current) {
                        await triggerAutomaticScanWithoutLocation(tagIdentifier);
                      }
                    }
                  },
                  async (error) => {
                    console.error('❌ Geolocation error:', error);
                    // Location denied or unavailable - send webhook without location
                    if (componentMountedRef?.current) {
                      await triggerAutomaticScanWithoutLocation(tagIdentifier);
                    }
                  },
                  {
                    timeout: 5000,
                    enableHighAccuracy: true,
                    maximumAge: 60000
                  }
                );
              } else {
                // Geolocation not supported - send webhook without location
                await triggerAutomaticScanWithoutLocation(tagIdentifier);
              }
            } catch (err) {
              console.error('💥 Error in webhook execution:', err);
              if (componentMountedRef?.current) {
                setWebhookStatus({
                  success: false,
                  message: 'Error al notificar al dueño. Intenta contactar directamente.',
                  processing: false
                });
              }
            }
          }, 300); // 300ms debounce delay
        }
      } catch (err) {
        if (componentMountedRef?.current) {
          console.error('💥 Error loading pet data:', err);
          
          // Enhanced error handling with specific messages
          let errorMessage = err?.message || 'Failed to load pet information';
          
          if (err?.message && err?.message?.includes('Failed to fetch')) {
            errorMessage = 'No se pudo conectar con la base de datos. Tu proyecto de Supabase podría estar pausado. Verifica tu panel de control de Supabase y reactiva tu proyecto si es necesario.';
          } else if (err?.message && (err?.message?.includes('no está registrada') || err?.message?.includes('no está vinculada'))) {
            errorMessage = err?.message; // Use the specific error message from the service
          } else if (err?.message && err?.message?.includes('No data returned') || err?.code === 'PGRST116') {
            errorMessage = `La placa NFC "${tagIdentifier}" no está registrada en el sistema. Contacta al dueño para verificar que la placa esté correctamente configurada.`;
          }
          
          setError(errorMessage);
        }
      } finally {
        if (componentMountedRef?.current) {
          setLoading(false);
        }
      }
    };

    const triggerAutomaticScanWithoutLocation = async (tagIdentifier) => {
      if (!componentMountedRef?.current) return;
      
      try {
        console.log('🚀 Triggering automatic scan without location');
        const result = await petService?.recordAutomaticPetScan(tagIdentifier);
        
        if (componentMountedRef?.current) {
          setNotificationSent(result?.success);
          setWebhookStatus({
            success: result?.webhook_sent,
            message: result?.webhook_message || 'Webhook notification attempted without location',
            processing: false
          });
        }
      } catch (err) {
        console.error('❌ Error in automatic scan without location:', err);
        if (componentMountedRef?.current) {
          setWebhookStatus({
            success: false,
            message: 'Failed to send notification to owner',
            processing: false
          });
        }
      }
    };

    loadPetData();

    // Cleanup function to prevent race conditions
    return () => {
      componentMountedRef.current = false;
      if (webhookTimeoutRef?.current) {
        clearTimeout(webhookTimeoutRef?.current);
      }
    };
  }, [tagId]); // Only depend on tagId

  const handleLocationCaptured = async (location) => {
    // This is for manual location capture - if automatic didn't work
    if (!petData || !petData?.pets || !petData?.pets?.id || notificationSent || webhookExecutedRef?.current) return;

    // Prevent duplicate manual webhook calls
    if (webhookExecutedRef?.current) return;
    webhookExecutedRef.current = true;

    try {
      const scanData = {
        tagIdentifier: petData?.tag_identifier,
        latitude: location?.latitude,
        longitude: location?.longitude,
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          timestamp: new Date()?.toISOString()
        },
        finderMessage: 'Ubicación capturada manualmente por el rescatista'
      };

      const result = await petService?.recordPetScan(scanData);
      if (result?.success && componentMountedRef?.current) {
        setNotificationSent(true);
        setLocationCaptured(true);
        setWebhookStatus({
          success: result?.webhook_sent,
          message: result?.webhook_message,
          processing: false
        });
      }
    } catch (err) {
      console.error('❌ Error recording manual scan:', err);
      if (componentMountedRef?.current) {
        setWebhookStatus({
          success: false,
          message: 'Error al registrar el escaneo manual',
          processing: false
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando información de la mascota...</p>
          <p className="text-sm text-gray-500 mt-2">Verificando placa NFC...</p>
        </div>
      </div>);
  }

  if (error || !petData || !petData?.pets) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mascota No Encontrada</h2>
          <p className="text-gray-600 mb-6">
            {error || 'La información de la mascota no pudo ser encontrada. Esta placa NFC puede estar inactiva o el perfil de la mascota puede no existir.'}
          </p>
          
          {/* Debug Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-gray-800 text-sm font-medium mb-2">Información de depuración:</p>
            <p className="text-gray-700 text-sm">
              <strong>Tag ID:</strong> {tagId || 'No proporcionado'}
            </p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 text-sm font-medium mb-2">¿Acabas de crear esta mascota?</p>
            <p className="text-yellow-700 text-sm">
              Asegúrate de que se haya creado y vinculado correctamente una placa NFC en la sección de "Gestión de Placas NFC" del perfil de tu mascota.
            </p>
          </div>
          <div className="text-sm text-gray-500">
            <p>If you believe this is an error, please contact support.</p>
          </div>
        </div>
      </div>);
  }

  const pet = petData?.pets;
  const owner = pet?.user_profiles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Emergency Header */}
        <EmergencyHeader
          petName={pet?.name}
          notificationSent={notificationSent} />

        {/* Webhook Status Notification - Enhanced with processing state */}
        {webhookStatus && (
          <div className={`mb-4 p-4 rounded-lg shadow-md ${
            webhookStatus?.processing
              ? 'bg-blue-50 border border-blue-200'
              : webhookStatus?.success 
              ? 'bg-green-50 border border-green-200' :'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-start">
              <div className={`flex-shrink-0 ${
                webhookStatus?.processing 
                  ? 'text-blue-400' 
                  : webhookStatus?.success 
                  ? 'text-green-400' :'text-yellow-400'
              }`}>
                {webhookStatus?.processing 
                  ? '🔄' 
                  : webhookStatus?.success 
                  ? '✅' :'⚠️'}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  webhookStatus?.processing
                    ? 'text-blue-800'
                    : webhookStatus?.success 
                    ? 'text-green-800' :'text-yellow-800'
                }`}>
                  {webhookStatus?.processing
                    ? 'Procesando notificación...'
                    : webhookStatus?.success 
                    ? '¡Notificación enviada al dueño!' 
                    : 'Estado de notificación'}
                </h3>
                <div className={`mt-1 text-sm ${
                  webhookStatus?.processing
                    ? 'text-blue-700'
                    : webhookStatus?.success 
                    ? 'text-green-700' :'text-yellow-700'
                }`}>
                  <p>{webhookStatus?.message}</p>
                  {webhookStatus?.success && !webhookStatus?.processing && (
                    <p className="mt-1">El dueño ha sido notificado automáticamente por WhatsApp.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location Capture - Show only if automatic scan didn't get location */}
        {!locationCaptured && !loading &&
        <LocationCapture
          onLocationCaptured={handleLocationCaptured}
          petName={pet?.name} />
        }

        {/* Pet Photo Carousel */}
        <PetPhotoCarousel
          photos={pet?.pet_photos || []}
          petName={pet?.name} />

        {/* Pet Basic Info */}
        <PetBasicInfo pet={pet} />

        {/* Medical Alerts Section */}
        {pet?.special_needs &&
        <MedicalAlertsSection specialNeeds={pet?.special_needs} />
        }

        {/* Reward Information */}
        {pet?.reward_amount &&
        <RewardInfoSection amount={pet?.reward_amount} />
        }

        {/* Contact Owner Section */}
        <ContactOwnerSection
          owner={owner}
          petName={pet?.name}
          emergencyContacts={pet?.emergency_contacts || []} />

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gracias por ayudar! 🙏</h3>
            <p className="text-gray-600 text-sm mb-4">Tu escaneo ayuda a que este peludo esté un paso más cerca de su hogar.</p>
            {notificationSent && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-800 text-sm font-medium">
                  ✅ El dueño ha sido notificado automáticamente
                </p>
              </div>
            )}
            <div className="text-xs text-gray-500">
              <p>Powered by PetFinder NFC Technology</p>
              <p>Secure • Fast • Reliable</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFCPetProfileLanding;