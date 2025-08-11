import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { petService } from '../../services/petService';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PetContextBar from '../../components/ui/PetContextBar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ScanTimelineItem from './components/ScanTimelineItem';
import ScanMap from './components/ScanMap';
import AnalyticsCards from './components/AnalyticsCards';
import ScanFilters from './components/ScanFilters';
import AlertSettings from './components/AlertSettings';

const ScanHistoryAnalytics = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [selectedScan, setSelectedScan] = useState(null);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'map'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scans, setScans] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: 'month',
    scanType: 'all',
    sortBy: 'newest',
    searchLocation: '',
    startDate: '',
    endDate: ''
  });
  const [alertSettings, setAlertSettings] = useState({
    scanAlerts: true,
    unusualLocationAlerts: true,
    inactivityAlerts: false,
    notificationMethods: ['whatsapp', 'push'],
    alertFrequency: 'immediate',
    inactivityPeriod: 24,
    knownLocationRadius: 2,
    maxAlertsPerDay: 10,
    quietHours: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    emergencyBypass: true,
    emergencyMultipleContacts: false
  });

  // Load user's pets and scan data
  useEffect(() => {
    if (user?.id) {
      loadUserData();
    }
  }, [user?.id]);

  // Handle pet selection change
  useEffect(() => {
    if (selectedPetId) {
      loadPetScans();
    }
  }, [selectedPetId, filters]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user's pets
      const userPets = await petService?.getUserPets(user?.id);
      setPets(userPets || []);
      
      // Set initial pet selection
      if (userPets?.length > 0) {
        const tagParam = searchParams?.get('tag');
        if (tagParam) {
          // Find pet by NFC tag identifier
          const petWithTag = userPets?.find(pet => 
            pet?.nfc_tags?.some(tag => tag?.tag_identifier === tagParam)
          );
          setSelectedPetId(petWithTag?.id || userPets?.[0]?.id);
        } else {
          setSelectedPetId(userPets?.[0]?.id);
        }
      }
      
      setError(null);
    } catch (err) {
      setError(err?.message || 'Error loading user data');
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPetScans = async () => {
    if (!selectedPetId) return;
    
    try {
      setLoading(true);
      
      // Load scan history for selected pet
      const scanHistory = await petService?.getPetScanHistory(selectedPetId);
      setScans(scanHistory || []);
      
      // Calculate analytics from real data
      calculateAnalytics(scanHistory || []);
      
      setError(null);
    } catch (err) {
      setError(err?.message || 'Error loading scan history');
      setScans([]);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (scanData) => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const recentScans = scanData?.filter(scan => new Date(scan?.scan_timestamp) >= lastMonth);
    const previousMonth = scanData?.filter(scan => {
      const scanDate = new Date(scan?.scan_timestamp);
      const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
      return scanDate >= twoMonthsAgo && scanDate < lastMonth;
    });

    const uniqueLocations = [...new Set(scanData?.map(scan => {
      if (scan?.latitude && scan?.longitude) {
        return `${Math.round(scan?.latitude * 1000)}:${Math.round(scan?.longitude * 1000)}`;
      }
      return null;
    })?.filter(Boolean))];

    const lastScan = scanData?.[0]; // Already ordered by timestamp desc

    setAnalytics({
      totalScans: recentScans?.length || 0,
      scanChange: recentScans?.length - previousMonth?.length,
      uniqueLocations: uniqueLocations?.length || 0,
      locationChange: uniqueLocations?.length - Math.max(previousMonth?.length / 2, 0), // Rough estimate
      mostActiveArea: 'Área de actividad', // Would need geo-coding for real location names
      mostActiveScans: Math.max(...Object.values(
        scanData?.reduce((acc, scan) => {
          const date = new Date(scan?.scan_timestamp)?.toDateString();
          acc[date] = (acc?.[date] || 0) + 1;
          return acc;
        }, {}) || {}
      ), 0),
      lastScanTime: lastScan ? getTimeAgo(lastScan?.scan_timestamp) : 'No hay escaneos',
      lastScanLocation: 'Ubicación registrada'
    });
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const scanTime = new Date(timestamp);
    const diffInHours = Math.floor((now - scanTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  };

  // Filter scans based on current filters
  const getFilteredScans = () => {
    let filtered = [...scans];

    // Apply date range filter
    const now = new Date();
    const filterDate = new Date();
    
    switch (filters?.dateRange) {
      case 'today':
        filterDate?.setHours(0, 0, 0, 0);
        break;
      case 'week':
        filterDate?.setDate(now?.getDate() - 7);
        break;
      case 'month':
        filterDate?.setMonth(now?.getMonth() - 1);
        break;
      case '3months':
        filterDate?.setMonth(now?.getMonth() - 3);
        break;
      case 'year':
        filterDate?.setFullYear(now?.getFullYear() - 1);
        break;
      case 'custom':
        if (filters?.startDate) {
          const startDate = new Date(filters.startDate);
          filtered = filtered?.filter(scan => new Date(scan?.scan_timestamp) >= startDate);
        }
        if (filters?.endDate) {
          const endDate = new Date(filters.endDate);
          endDate?.setHours(23, 59, 59, 999);
          filtered = filtered?.filter(scan => new Date(scan?.scan_timestamp) <= endDate);
        }
        break;
    }

    if (filters?.dateRange !== 'custom') {
      filtered = filtered?.filter(scan => new Date(scan?.scan_timestamp) >= filterDate);
    }

    // Apply scan type filter - map database status to expected types
    if (filters?.scanType !== 'all') {
      filtered = filtered?.filter(scan => {
        const status = scan?.status || 'found';
        switch (filters?.scanType) {
          case 'emergency':
            return status === 'found' && scan?.finder_message?.toLowerCase()?.includes('emergencia');
          case 'finder':
            return status === 'found' && scan?.finder_message;
          case 'owner':
            return !scan?.finder_message; // Scans without finder messages are likely owner scans
          default:
            return true;
        }
      });
    }

    // Apply sorting
    switch (filters?.sortBy) {
      case 'newest':
        filtered?.sort((a, b) => new Date(b?.scan_timestamp) - new Date(a?.scan_timestamp));
        break;
      case 'oldest':
        filtered?.sort((a, b) => new Date(a?.scan_timestamp) - new Date(b?.scan_timestamp));
        break;
      case 'location':
        filtered?.sort((a, b) => (a?.latitude || 0) - (b?.latitude || 0));
        break;
      case 'type':
        filtered?.sort((a, b) => (a?.status || '')?.localeCompare(b?.status || ''));
        break;
    }

    return filtered;
  };

  const filteredScans = getFilteredScans();

  const handleLocationClick = (coordinates) => {
    setSelectedScan({ coordinates });
    setViewMode('map');
  };

  const handleExport = () => {
    const selectedPet = pets?.find(p => p?.id === selectedPetId);
    const exportData = {
      pet: selectedPet,
      scans: filteredScans,
      analytics: analytics,
      exportDate: new Date()?.toISOString(),
      filters: filters
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scan-history-${selectedPet?.name}-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    link?.click();
    URL.revokeObjectURL(url);
  };

  const breadcrumbs = [
    { label: 'Dashboard', path: '/pet-owner-dashboard', icon: 'Home' },
    { label: 'Historial de Escaneos', path: '/scan-history-analytics', icon: 'Activity', isActive: true }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Acceso requerido</h2>
          <p className="text-muted-foreground mb-6">Debes iniciar sesión para ver el historial de escaneos.</p>
          <Button onClick={() => navigate('/owner-login-registration')}>
            Iniciar Sesión
          </Button>
        </div>
      </div>
    );
  }

  if (loading && pets?.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando datos...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error && pets?.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <Icon name="AlertTriangle" size={48} className="text-error mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">Error al cargar datos</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={loadUserData}>
                Intentar de nuevo
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (pets?.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <Icon name="PawPrint" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">No hay mascotas registradas</h2>
              <p className="text-muted-foreground mb-6">
                Debes agregar al menos una mascota para ver el historial de escaneos.
              </p>
              <Button onClick={() => navigate('/pet-profile-management')}>
                Agregar Mascota
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const selectedPet = pets?.find(p => p?.id === selectedPetId);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb customBreadcrumbs={breadcrumbs} />
          
          <PetContextBar
            pets={pets}
            selectedPetId={selectedPetId}
            onPetSelect={setSelectedPetId}
          />

          {/* Error Display */}
          {error && pets?.length > 0 && (
            <div className="mb-4 p-4 bg-error/10 border border-error/20 rounded-lg text-error">
              {error}
            </div>
          )}

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Historial de Escaneos y Análisis
              </h1>
              <p className="text-muted-foreground">
                Monitorea la actividad de la placa NFC de {selectedPet?.name} y analiza patrones de movimiento
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <div className="flex items-center bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                    viewMode === 'timeline' ? 'bg-card text-foreground shadow-soft' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name="List" size={16} />
                  <span>Cronología</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                    viewMode === 'map' ? 'bg-card text-foreground shadow-soft' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name="Map" size={16} />
                  <span>Mapa</span>
                </button>
              </div>
              
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                onClick={handleExport}
              >
                Exportar
              </Button>
            </div>
          </div>

          {/* Analytics Cards */}
          {analytics && (
            <AnalyticsCards analytics={analytics} className="mb-8" />
          )}

          {/* Filters */}
          <ScanFilters
            filters={filters}
            onFiltersChange={setFilters}
            onExport={handleExport}
            className="mb-8"
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timeline/Map View */}
            <div className="lg:col-span-2">
              {viewMode === 'timeline' ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">
                      Cronología de Escaneos ({filteredScans?.length})
                    </h2>
                    {filteredScans?.length === 0 && (
                      <Button
                        variant="ghost"
                        iconName="RotateCcw"
                        onClick={() => setFilters({
                          dateRange: 'month',
                          scanType: 'all',
                          sortBy: 'newest',
                          searchLocation: '',
                          startDate: '',
                          endDate: ''
                        })}
                      >
                        Restablecer filtros
                      </Button>
                    )}
                  </div>
                  
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Cargando escaneos...</p>
                    </div>
                  ) : filteredScans?.length > 0 ? (
                    <div className="space-y-4">
                      {filteredScans?.map((scan) => (
                        <ScanTimelineItem
                          key={scan?.id}
                          scan={{
                            id: scan?.id,
                            petId: scan?.pet_id,
                            timestamp: scan?.scan_timestamp,
                            location: scan?.latitude && scan?.longitude ? 
                              `${scan?.latitude?.toFixed(4)}, ${scan?.longitude?.toFixed(4)}` : 
                              'Ubicación no disponible',
                            coordinates: scan?.latitude && scan?.longitude ? 
                              { lat: parseFloat(scan?.latitude), lng: parseFloat(scan?.longitude) } : 
                              null,
                            scanType: scan?.finder_message ? 'finder' : 'owner',
                            message: scan?.finder_message,
                            scannerInfo: scan?.scanner_device_info || {},
                            accuracy: scan?.location_accuracy || null,
                            notes: scan?.finder_message
                          }}
                          onLocationClick={handleLocationClick}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-card border border-border rounded-lg p-12 text-center">
                      <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        No se encontraron escaneos
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {scans?.length === 0 
                          ? 'Esta mascota aún no tiene escaneos registrados.' 
                          : 'No hay escaneos que coincidan con los filtros seleccionados.'
                        }
                      </p>
                      <Button
                        variant="outline"
                        iconName="RotateCcw"
                        onClick={() => setFilters({
                          dateRange: 'month',
                          scanType: 'all',
                          sortBy: 'newest',
                          searchLocation: '',
                          startDate: '',
                          endDate: ''
                        })}
                      >
                        Restablecer filtros
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <ScanMap
                  scans={filteredScans?.map(scan => ({
                    id: scan?.id,
                    coordinates: scan?.latitude && scan?.longitude ? 
                      { lat: parseFloat(scan?.latitude), lng: parseFloat(scan?.longitude) } : 
                      null,
                    timestamp: scan?.scan_timestamp,
                    type: scan?.finder_message ? 'finder' : 'owner',
                    message: scan?.finder_message
                  }))?.filter(scan => scan?.coordinates)}
                  selectedScan={selectedScan}
                  onScanSelect={setSelectedScan}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Alert Settings */}
              <AlertSettings
                settings={alertSettings}
                onSettingsChange={setAlertSettings}
              />

              {/* Quick Stats */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Estadísticas Rápidas</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Escaneos totales</span>
                    <span className="font-medium text-foreground">{scans?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Este mes</span>
                    <span className="font-medium text-foreground">{analytics?.totalScans || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ubicaciones únicas</span>
                    <span className="font-medium text-foreground">{analytics?.uniqueLocations || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Último escaneo</span>
                    <span className="font-medium text-foreground">{analytics?.lastScanTime || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-4">Actividad Reciente</h3>
                <div className="space-y-3">
                  {filteredScans?.slice(0, 3)?.map((scan) => (
                    <div key={scan?.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        scan?.finder_message?.toLowerCase()?.includes('emergencia') ? 'bg-error' :
                        scan?.finder_message ? 'bg-warning': 'bg-success'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {scan?.latitude && scan?.longitude 
                            ? `${scan?.latitude?.toFixed(4)}, ${scan?.longitude?.toFixed(4)}`
                            : 'Ubicación registrada'
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(scan?.scan_timestamp)?.toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {filteredScans?.length === 0 && (
                    <p className="text-sm text-muted-foreground">No hay actividad reciente</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScanHistoryAnalytics;