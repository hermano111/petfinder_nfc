import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { petService } from '../../services/petService';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PetContextBar from '../../components/ui/PetContextBar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import all section components
import BasicInfoSection from './components/BasicInfoSection';
import PhotoManagementSection from './components/PhotoManagementSection';
import PhysicalDescriptionSection from './components/PhysicalDescriptionSection';
import MedicalInfoSection from './components/MedicalInfoSection';
import EmergencyContactsSection from './components/EmergencyContactsSection';
import NFCTagManagementSection from './components/NFCTagManagementSection';
import PublicProfilePreview from './components/PublicProfilePreview';

const PetProfileManagement = () => {
  const navigate = useNavigate();
  const { petId } = useParams();
  const { user, userProfile, loading: authLoading } = useAuth();
  
  // State management
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState(petId ? parseInt(petId) : null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [petData, setPetData] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Section expansion state
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    photos: false,
    physical: false,
    medical: false,
    contacts: false,
    nfc: false
  });

  // Load user's pets on component mount
  useEffect(() => {
    if (user?.id && !authLoading) {
      loadUserPets();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user?.id, authLoading]);

  // Update selected pet when pets are loaded or ID changes
  useEffect(() => {
    if (pets?.length > 0) {
      // If petId from URL exists, try to find that pet
      if (petId && petId !== 'new') {
        const pet = pets?.find(p => p?.id === parseInt(petId));
        if (pet) {
          setSelectedPet(pet);
          setPetData({ ...pet });
          setSelectedPetId(pet?.id);
          setHasUnsavedChanges(false);
          setValidationErrors({});
          return;
        }
      }
      
      // If no valid petId or pet not found, select first pet
      if (!petId || petId === 'new') {
        const pet = pets?.[0];
        if (pet) {
          setSelectedPet(pet);
          setPetData({ ...pet });
          setSelectedPetId(pet?.id);
          setHasUnsavedChanges(false);
          setValidationErrors({});
          // Update URL to reflect selected pet
          navigate(`/pet-profile-management/${pet?.id}`, { replace: true });
        }
      }
    } else if (pets?.length === 0 && !loading) {
      // No pets - clear selection and ensure we're on base route
      setSelectedPet(null);
      setPetData(null);
      setSelectedPetId(null);
      if (petId) {
        navigate('/pet-profile-management', { replace: true });
      }
    }
  }, [pets, petId, loading, navigate]);

  const loadUserPets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userPets = await petService?.getUserPets(user?.id);
      setPets(userPets || []);
      
    } catch (err) {
      setError(err?.message || 'Failed to load pets');
      console.error('Pet load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle pet selection
  const handlePetSelect = (newPetId) => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "Tienes cambios sin guardar. ¿Estás seguro de que quieres cambiar de mascota?"
      );
      if (!confirmLeave) return;
    }
    
    // Navigate to the selected pet
    navigate(`/pet-profile-management/${newPetId}`);
  };

  // Handle section toggle
  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev?.[sectionKey]
    }));
  };

  // Handle data updates
  const handleSectionUpdate = (sectionData) => {
    setPetData(prev => ({ ...prev, ...sectionData }));
    setHasUnsavedChanges(true);
  };

  // Handle photo updates
  const handlePhotosUpdate = (photos) => {
    setPetData(prev => ({ ...prev, photos }));
    setHasUnsavedChanges(true);
  };

  // Handle primary photo change
  const handlePrimaryPhotoChange = (photoId) => {
    setPetData(prev => ({ ...prev, primaryPhotoId: photoId }));
    setHasUnsavedChanges(true);
  };

  // Create new pet - FIXED: Now creates database record immediately
  const handleCreateNewPet = async () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "Tienes cambios sin guardar. ¿Estás seguro de que quieres crear una nueva mascota?"
      );
      if (!confirmLeave) return;
    }

    // Check if user is authenticated
    if (!user?.id) {
      setError('Debes iniciar sesión para crear una mascota.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create minimal pet record immediately in database
      const minimalPetData = {
        name: 'Mi Mascota', // Temporary name that user can change
        pet_type: 'dog',
        breed: '', // Will be filled by user
        size: 'medium'
      };

      console.log('Creating new pet record in database...');
      
      // Create the pet record in database
      const newPet = await petService?.createPet(minimalPetData, user?.id);
      
      if (!newPet) {
        throw new Error('No se pudo crear la mascota en la base de datos.');
      }

      console.log('New pet created with ID:', newPet?.id);

      // Reload pets to get the new pet with all relations
      await loadUserPets();

      // Set up the form with the created pet data
      const newPetTemplate = {
        ...newPet,
        // Initialize empty arrays for related data that will be loaded
        pet_photos: [],
        emergency_contacts: [],
        nfc_tags: [],
        pet_medical_records: []
      };

      setPetData(newPetTemplate);
      setSelectedPet(newPet);
      setSelectedPetId(newPet?.id);
      setHasUnsavedChanges(false); // No unsaved changes since we just created it
      setValidationErrors({});
      
      // Expand basic info section for new pet
      setExpandedSections(prev => ({ ...prev, basicInfo: true }));
      
      // Navigate to the new pet with its actual database ID
      navigate(`/pet-profile-management/${newPet?.id}`, { replace: true });

      // Show success message
      setError(null);
      setLastSaved(new Date());

    } catch (error) {
      console.error('Error creating new pet:', error);
      
      // Provide specific error messages
      let errorMessage = 'Error desconocido. Inténtalo de nuevo.';
      
      if (error?.message?.includes('Failed to fetch') || error?.message?.includes('Network')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.';
      } else if (error?.message?.includes('Cannot connect to database')) {
        errorMessage = 'No se pudo conectar con la base de datos. Es posible que el proyecto de Supabase esté pausado. Contacta al administrador.';
      } else if (error?.message?.includes('RLS')) {
        errorMessage = 'No tienes permisos para crear mascotas. Por favor, inicia sesión nuevamente.';
      } else if (error?.message) {
        errorMessage = error?.message;
      }
      
      setError(`❌ Error al crear la mascota: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced validation
  const validateData = () => {
    const newErrors = {};
    
    if (!petData?.name?.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }
    if (!petData?.breed?.trim()) {
      newErrors.breed = "La raza es obligatoria";
    }
    if (!petData?.pet_type) {
      newErrors.pet_type = "El tipo de mascota es obligatorio";
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  // Enhanced save handler - Modified to handle updates only since creation is now immediate
  const handleSave = async () => {
    // Ensure we have data to save
    if (!petData) {
      setError('No hay datos para guardar. Por favor, completa la información de la mascota.');
      return;
    }

    // Check if this is an existing pet (should always be the case now)
    if (selectedPetId === 'new' || petId === 'new' || !selectedPetId) {
      setError('Error: No se puede guardar una mascota sin ID. Por favor, recarga la página.');
      return;
    }

    // Validate the data
    const isValid = validateData();
    if (!isValid) {
      // Show validation errors and expand basic info section
      setExpandedSections(prev => ({ ...prev, basicInfo: true }));
      
      // Create a user-friendly error message
      const errorMessages = [];
      if (validationErrors?.name) errorMessages?.push('• Nombre de la mascota');
      if (validationErrors?.breed) errorMessages?.push('• Raza de la mascota');
      if (validationErrors?.pet_type) errorMessages?.push('• Tipo de mascota');
      
      setError(`Por favor, completa los siguientes campos obligatorios:\n${errorMessages?.join('\n')}`);
      return;
    }

    // Check if user is authenticated
    if (!user?.id) {
      setError('Debes iniciar sesión para guardar la información de tu mascota.');
      return;
    }

    setIsSaving(true);
    setError(null);
    
    try {
      // Update existing pet (since we now create immediately)
      const updates = {
        name: petData?.name?.trim(),
        pet_type: petData?.pet_type,
        breed: petData?.breed?.trim(),
        size: petData?.size || 'medium',
        color: petData?.color?.trim() || null,
        age_years: petData?.age_years || null,
        age_months: petData?.age_months || null,
        weight_kg: petData?.weight_kg || null,
        microchip_number: petData?.microchip_number?.trim() || null,
        distinctive_marks: petData?.distinctive_marks?.trim() || null,
        personality_description: petData?.personality_description?.trim() || null,
        special_needs: petData?.special_needs?.trim() || null,
        reward_amount: petData?.reward_amount || null
      };
      
      console.log('Updating pet with data:', updates);
      
      const savedPet = await petService?.updatePet(selectedPetId, updates);
      
      if (!savedPet) {
        throw new Error('No se pudo actualizar la mascota. Inténtalo de nuevo.');
      }
      
      console.log('Pet updated successfully:', savedPet);
      
      // Reload pets to get updated data
      await loadUserPets();
      
      // Show success message
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      setError(null);
      
    } catch (error) {
      console.error('Error saving pet profile:', error);
      
      // Provide specific error messages based on the error type
      let errorMessage = 'Error desconocido. Inténtalo de nuevo.';
      
      if (error?.message?.includes('duplicate key value violates unique constraint')) {
        if (error?.message?.includes('microchip_number')) {
          errorMessage = 'El número de microchip ya está registrado para otra mascota. Por favor, verifica el número.';
        } else {
          errorMessage = 'Ya existe una mascota con esta información. Por favor, verifica los datos.';
        }
      } else if (error?.message?.includes('Failed to fetch') || error?.message?.includes('Network')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.';
      } else if (error?.message?.includes('Cannot connect to database')) {
        errorMessage = 'No se pudo conectar con la base de datos. Es posible que el proyecto de Supabase esté pausado. Contacta al administrador.';
      } else if (error?.message?.includes('RLS')) {
        errorMessage = 'No tienes permisos para realizar esta acción. Por favor, inicia sesión nuevamente.';
      } else if (error?.message) {
        errorMessage = error?.message;
      }
      
      setError(`❌ Error al guardar: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Loading states
  if (authLoading || (user && loading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">
            {authLoading ? 'Verificando autenticación...' : 'Cargando tus mascotas...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Preview Mode Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-blue-500 text-3xl mr-4">🔒</div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900">Acceso Requerido - Gestión de Perfiles</h3>
                    <p className="text-blue-700 mt-1">
                      Inicia sesión o créa una cuenta gratuita para gestionar los perfiles de tus mascotas. 
                      Los usuarios nuevos comenzarán con un perfil completamente vacío y limpio.
                    </p>
                  </div>
                </div>
                <div className="space-x-3">
                  <button
                    onClick={() => window.location.href = '/owner-login-registration#register'}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
                  >
                    Crear Cuenta Nueva
                  </button>
                  <button
                    onClick={() => window.location.href = '/owner-login-registration#login'}
                    className="bg-white text-blue-600 px-6 py-2 rounded-md border border-blue-300 hover:bg-blue-50 font-medium"
                  >
                    Iniciar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white border border-border rounded-lg p-8 text-center">
              <div className="text-error text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Error al Cargar Mascotas</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button
                variant="default"
                onClick={loadUserPets}
              >
                Intentar de Nuevo
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Empty state - no pets
  if (pets?.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumb />
            
            {/* Welcome message for new users */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-center">
                <div className="text-green-500 text-3xl mr-4">🎉</div>
                <div>
                  <h3 className="text-xl font-semibold text-green-900">¡Perfil Limpio y Listo, {userProfile?.full_name}!</h3>
                  <p className="text-green-700 mt-1">
                    Tu cuenta nueva está perfecta - sin datos de ejemplo ni información previa. 
                    Crear tu primera mascota desde cero y personaliza completamente su perfil.
                  </p>
                </div>
              </div>
            </div>

            {/* Empty state */}
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <div className="text-muted-foreground text-8xl mb-6">🐾</div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                ¡Comienza Creando Tu Primera Mascota!
              </h2>
              <p className="text-muted-foreground text-lg mb-2">
                No tienes mascotas registradas aún. Tu perfil está completamente vacío y listo.
              </p>
              <p className="text-muted-foreground mb-8">
                Al hacer clic, se creará automáticamente un registro en la base de datos y podrás completar toda la información.
              </p>
              
              <Button
                variant="default"
                size="lg"
                iconName="Plus"
                iconPosition="left"
                onClick={handleCreateNewPet}
                className="text-lg px-8 py-4"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Creando Mascota...' : 'Crear Mi Primera Mascota'}
              </Button>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-background p-4 rounded-lg border border-border">
                  <div className="text-primary text-2xl mb-2">📝</div>
                  <h4 className="font-semibold text-foreground mb-1">Registro Inmediato</h4>
                  <p className="text-sm text-muted-foreground">Se crea automáticamente el registro con ID único en la base de datos</p>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border">
                  <div className="text-primary text-2xl mb-2">📷</div>
                  <h4 className="font-semibold text-foreground mb-1">Formulario Completo</h4>
                  <p className="text-sm text-muted-foreground">Aparecen todos los campos para completar información de tu mascota</p>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border">
                  <div className="text-primary text-2xl mb-2">🚨</div>
                  <h4 className="font-semibold text-foreground mb-1">Información Personalizada</h4>
                  <p className="text-sm text-muted-foreground">Completa contactos de emergencia y características únicas</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show pet management interface if creating new pet or have existing pets
  if (selectedPetId === 'new' || petId === 'new' || (pets?.length > 0 && selectedPet && petData)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumb />
            
            {/* Success Message Display */}
            {(selectedPetId === 'new' || petId === 'new') && lastSaved && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="text-green-500 text-2xl mr-3">🎉</div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">¡Mascota Creada Exitosamente!</h3>
                    <p className="text-green-700 text-sm mt-1">
                      {petData?.name} ha sido creada exitosamente. Ahora puedes agregar fotos, contactos de emergencia y más información.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-red-500 text-2xl mr-3">⚠️</div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-900">Error</h3>
                      <p className="text-red-700 text-sm mt-1 whitespace-pre-line">{error}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-500 hover:text-red-700 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Pet Context Bar - only show if we have pets and not creating new */}
            {pets?.length > 0 && selectedPetId !== 'new' && petId !== 'new' && (
              <PetContextBar
                pets={pets}
                selectedPetId={selectedPetId}
                onPetSelect={handlePetSelect}
              />
            )}

            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Gestión de Perfil - {selectedPet?.name}
                </h1>
                <p className="text-muted-foreground mt-2">
                  Completa y actualiza la información de tu mascota para el sistema NFC
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={handleCreateNewPet}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Creando...' : 'Agregar Mascota'}
                </Button>
                
                {lastSaved && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Check" size={16} className="text-success" />
                    <span>Guardado {lastSaved?.toLocaleTimeString()}</span>
                  </div>
                )}
                
                <Button
                  variant="outline"
                  iconName="RotateCcw"
                  iconPosition="left"
                  onClick={() => {
                    if (hasUnsavedChanges) {
                      const confirmReset = window.confirm(
                        "¿Estás seguro de que quieres descartar todos los cambios?"
                      );
                      if (confirmReset) {
                        setPetData({ ...selectedPet });
                        setHasUnsavedChanges(false);
                        setValidationErrors({});
                      }
                    }
                  }}
                  disabled={!hasUnsavedChanges}
                >
                  Descartar Cambios
                </Button>
                
                <Button
                  variant="default"
                  iconName="Save"
                  iconPosition="left"
                  onClick={handleSave}
                  loading={isSaving}
                  disabled={!hasUnsavedChanges || isSaving}
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Form Sections */}
              <div className="xl:col-span-2 space-y-6">
                {/* Basic Information */}
                <BasicInfoSection
                  petData={petData}
                  onUpdate={handleSectionUpdate}
                  isExpanded={expandedSections?.basicInfo}
                  onToggle={() => toggleSection('basicInfo')}
                  errors={validationErrors}
                />

                {/* Photo Management */}
                <PhotoManagementSection
                  photos={petData?.photos || petData?.pet_photos || []}
                  onPhotosUpdate={handlePhotosUpdate}
                  isExpanded={expandedSections?.photos}
                  onToggle={() => toggleSection('photos')}
                  primaryPhotoId={petData?.primaryPhotoId}
                  onPrimaryPhotoChange={handlePrimaryPhotoChange}
                />

                {/* Physical Description */}
                <PhysicalDescriptionSection
                  petData={petData}
                  onUpdate={handleSectionUpdate}
                  isExpanded={expandedSections?.physical}
                  onToggle={() => toggleSection('physical')}
                  errors={validationErrors}
                />

                {/* Medical Information */}
                <MedicalInfoSection
                  petData={petData}
                  onUpdate={handleSectionUpdate}
                  isExpanded={expandedSections?.medical}
                  onToggle={() => toggleSection('medical')}
                  errors={validationErrors}
                />

                {/* Emergency Contacts */}
                <EmergencyContactsSection
                  petData={petData}
                  onUpdate={handleSectionUpdate}
                  isExpanded={expandedSections?.contacts}
                  onToggle={() => toggleSection('contacts')}
                  errors={validationErrors}
                />

                {/* NFC Tag Management */}
                <NFCTagManagementSection
                  petData={petData}
                  onUpdate={handleSectionUpdate}
                  isExpanded={expandedSections?.nfc}
                  onToggle={() => toggleSection('nfc')}
                  errors={validationErrors}
                />
              </div>

              {/* Right Column - Preview */}
              <div className="xl:col-span-1">
                <div className="sticky top-24">
                  <PublicProfilePreview petData={petData} />
                  
                  {/* Quick Actions - only show for existing pets */}
                  {selectedPetId !== 'new' && (
                    <div className="mt-6 space-y-3">
                      <Button
                        variant="outline"
                        fullWidth
                        iconName="BarChart3"
                        iconPosition="left"
                        onClick={() => navigate('/scan-history-analytics')}
                      >
                        Ver Historial de Escaneos
                      </Button>
                      
                      <Button
                        variant="outline"
                        fullWidth
                        iconName="FileText"
                        iconPosition="left"
                        onClick={() => navigate('/medical-records-center')}
                      >
                        Gestionar Registros Médicos
                      </Button>
                      
                      <Button
                        variant="destructive"
                        fullWidth
                        iconName="AlertTriangle"
                        iconPosition="left"
                        onClick={() => navigate('/report-lost-pet')}
                      >
                        Reportar como Perdido
                      </Button>
                    </div>
                  )}

                  {/* Profile Completeness */}
                  <div className="mt-6 p-4 bg-card border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-3">Completitud del Perfil</h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Información básica</span>
                        <span className={petData?.name && petData?.breed && petData?.pet_type ? 'text-success' : 'text-warning'}>
                          {petData?.name && petData?.breed && petData?.pet_type ? '✓' : '○'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Fotos</span>
                        <span className={(petData?.photos?.length || petData?.pet_photos?.length || 0) > 0 ? 'text-success' : 'text-warning'}>
                          {(petData?.photos?.length || petData?.pet_photos?.length || 0) > 0 ? '✓' : '○'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Contactos de emergencia</span>
                        <span className={(petData?.emergencyContacts?.length || petData?.emergency_contacts?.length || 0) > 0 ? 'text-success' : 'text-error'}>
                          {(petData?.emergencyContacts?.length || petData?.emergency_contacts?.length || 0) > 0 ? '✓' : '✗'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Placa NFC</span>
                        <span className={(petData?.nfcTags?.length || petData?.nfc_tags?.length || 0) > 0 ? 'text-success' : 'text-warning'}>
                          {(petData?.nfcTags?.length || petData?.nfc_tags?.length || 0) > 0 ? '✓' : '○'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-smooth" 
                          style={{ 
                            width: `${
                              ((petData?.name && petData?.breed && petData?.pet_type ? 25 : 0) +
                               ((petData?.photos?.length || petData?.pet_photos?.length || 0) > 0 ? 25 : 0) +
                               ((petData?.emergencyContacts?.length || petData?.emergency_contacts?.length || 0) > 0 ? 25 : 0) +
                               ((petData?.nfcTags?.length || petData?.nfc_tags?.length || 0) > 0 ? 25 : 0))
                            }%` 
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Perfil {
                          ((petData?.name && petData?.breed && petData?.pet_type ? 25 : 0) +
                           ((petData?.photos?.length || petData?.pet_photos?.length || 0) > 0 ? 25 : 0) +
                           ((petData?.emergencyContacts?.length || petData?.emergency_contacts?.length || 0) > 0 ? 25 : 0) +
                           ((petData?.nfcTags?.length || petData?.nfc_tags?.length || 0) > 0 ? 25 : 0))
                        }% completo
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Fallback loading state
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground text-lg">Preparando gestión de mascotas...</p>
      </div>
    </div>
  );
};

export default PetProfileManagement;