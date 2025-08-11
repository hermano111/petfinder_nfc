import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import { petService } from '../../services/petService';

const NFCTestScan = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadUserPets();
    }
  }, [user?.id]);

  const loadUserPets = async () => {
    try {
      setLoading(true);
      const data = await petService?.getUserPets(user?.id);
      setPets(data || []);
    } catch (error) {
      setError(error?.message || 'Error al cargar mascotas');
    } finally {
      setLoading(false);
    }
  };

  const loadScanHistory = async (petId) => {
    try {
      const data = await petService?.getPetScanHistory(petId);
      setScanHistory(data || []);
    } catch (error) {
      setError(error?.message || 'Error al cargar historial');
    }
  };

  const handlePetSelect = (pet) => {
    setSelectedPet(pet);
    loadScanHistory(pet?.id);
  };

  const simulateNFCScan = async () => {
    if (!selectedPet) return;

    try {
      setLoading(true);
      
      // Get the actual NFC tag identifier from the pet's tags
      const tagIdentifier = selectedPet?.nfc_tags?.[0]?.tag_identifier;
      
      if (!tagIdentifier) {
        setError('Esta mascota no tiene placas NFC registradas. Ve a "Gestión de Perfil" para crear una.');
        return;
      }
      
      console.log('🧪 Testing NFC scan for tag:', tagIdentifier);
      
      // Simulate scan data
      const mockScanData = {
        tagIdentifier: tagIdentifier,
        latitude: -34.6037 + (Math.random() - 0.5) * 0.01,
        longitude: -58.3816 + (Math.random() - 0.5) * 0.01,
        deviceInfo: {
          userAgent: navigator?.userAgent,
          platform: navigator?.platform,
          timestamp: new Date()?.toISOString(),
          test: true
        },
        finderMessage: 'Prueba de funcionamiento de placa NFC desde panel de pruebas'
      };

      const result = await petService?.recordPetScan(mockScanData);
      
      // Reload scan history
      await loadScanHistory(selectedPet?.id);
      
      setError('');
      
      // Show detailed result
      if (result?.success) {
        alert(`✅ ¡Simulación de escaneo exitosa!
        
Detalles:
- Placa NFC: ${tagIdentifier}
- Ubicación registrada: Sí
- Webhook enviado: ${result?.webhook_sent ? 'Sí' : 'No'}
- Mensaje: ${result?.message || 'Sin mensaje'}

El escaneo se ha registrado en el historial.`);
      } else {
        alert(`⚠️ Simulación completada con advertencias:
        
- Mensaje: ${result?.message || 'Sin detalles'}
        
Revisa la configuración de webhooks.`);
      }
    } catch (error) {
      console.error('❌ Error in simulation:', error);
      setError(`Error en la simulación: ${error?.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Prueba de Placa NFC"
        showBackButton={true}
        onBack={() => navigate('/pet-owner-dashboard')}
      />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <Icon name="AlertCircle" size={16} />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {/* Pet Selection */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon name="Heart" size={20} className="text-primary" />
              Seleccionar Mascota
            </h2>
            
            {loading && pets?.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : pets?.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="Heart" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No tienes mascotas registradas</p>
                <Button onClick={() => navigate('/pet-profile-management?action=add')}>
                  Registrar Primera Mascota
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pets?.map((pet) => (
                  <div
                    key={pet?.id}
                    onClick={() => handlePetSelect(pet)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPet?.id === pet?.id
                        ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name="Heart" size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{pet?.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {pet?.pet_type} • {pet?.breed}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* NFC Test Actions */}
          {selectedPet && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="Scan" size={20} className="text-accent" />
                Prueba de Funcionamiento
              </h2>
              
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-foreground mb-2">Mascota Seleccionada:</h3>
                <p className="text-foreground">{selectedPet?.name}</p>
                <p className="text-sm text-muted-foreground">
                  NFC ID: {selectedPet?.nfc_tags?.[0]?.tag_identifier || 'Sin placa asignada'}
                </p>
              </div>
              
              <Button
                onClick={simulateNFCScan}
                disabled={loading}
                size="lg"
                iconName="Scan"
                iconPosition="left"
                className="w-full mb-4"
              >
                {loading ? 'Simulando...' : 'Simular Escaneo NFC'}
              </Button>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Esta función simula el escaneo de la placa NFC</p>
                <p>• Se registrará un nuevo escaneo en el historial</p>
                <p>• Útil para probar que el sistema funciona correctamente</p>
              </div>
            </div>
          )}

          {/* Recent Scans */}
          {selectedPet && scanHistory?.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="History" size={20} className="text-secondary" />
                Escaneos Recientes
              </h2>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {scanHistory?.slice(0, 10)?.map((scan, index) => (
                  <div key={scan?.id || index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {formatDate(scan?.scan_timestamp)}
                        </p>
                        {scan?.scan_latitude && scan?.scan_longitude && (
                          <p className="text-xs text-muted-foreground">
                            Ubicación: {scan?.scan_latitude?.toFixed(6)}, {scan?.scan_longitude?.toFixed(6)}
                          </p>
                        )}
                      </div>
                    </div>
                    <Icon name="MapPin" size={16} className="text-muted-foreground" />
                  </div>
                ))}
              </div>
              
              {scanHistory?.length > 10 && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/scan-history-analytics')}
                  className="w-full mt-4"
                >
                  Ver Historial Completo
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFCTestScan;