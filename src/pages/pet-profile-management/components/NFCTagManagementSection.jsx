import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { nfcService } from '../../../services/nfcService';

const NFCTagManagementSection = ({ 
  petData, 
  onUpdate, 
  isExpanded, 
  onToggle,
  errors = {} 
}) => {
  const [localData, setLocalData] = useState(petData);
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagId, setNewTagId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [realNfcTags, setRealNfcTags] = useState([]);

  // Load real NFC tags when component mounts
  useEffect(() => {
    if (petData?.id) {
      loadNFCTags();
    }
  }, [petData?.id]);

  const loadNFCTags = async () => {
    try {
      setLoading(true);
      const tags = await nfcService?.getPetNFCTags(petData?.id);
      setRealNfcTags(tags || []);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Error loading NFC tags');
      setRealNfcTags([]);
    } finally {
      setLoading(false);
    }
  };

  const tagStatusOptions = [
    { value: 'active', label: 'Activo', color: 'text-success' },
    { value: 'inactive', label: 'Inactivo', color: 'text-muted-foreground' },
    { value: 'lost', label: 'Perdido', color: 'text-error' },
    { value: 'stolen', label: 'Robado', color: 'text-error' },
    { value: 'damaged', label: 'Dañado', color: 'text-warning' }
  ];

  const handleInputChange = (field, value) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    onUpdate(updatedData);
  };

  const addNFCTag = async () => {
    if (!petData?.id) {
      setError('Error: No se puede agregar placa sin ID de mascota. Guarda la mascota primero.');
      return;
    }

    let tagIdentifierToUse = newTagId?.trim();
    
    // If no custom identifier provided, generate a default one
    if (!tagIdentifierToUse) {
      tagIdentifierToUse = nfcService?.generateTagIdentifier(petData?.name, petData?.id);
      setNewTagId(tagIdentifierToUse); // Show the generated identifier
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const newTag = await nfcService?.createNFCTag(petData?.id, {
        tag_identifier: tagIdentifierToUse,
        is_active: true
      });
      
      // Reload tags to get updated list
      await loadNFCTags();
      setNewTagId('');
      setShowAddTag(false);
      
    } catch (err) {
      setError(err?.message || 'Error adding NFC tag');
    } finally {
      setLoading(false);
    }
  };

  const updateTagStatus = async (tagId, status) => {
    try {
      setLoading(true);
      await nfcService?.updateNFCTag(tagId, { 
        is_active: status === 'active',
        is_lost: status === 'lost',
        is_stolen: status === 'stolen'
      });
      
      // Reload tags to get updated list
      await loadNFCTags();
      setError(null);
    } catch (err) {
      setError(err?.message || 'Error updating NFC tag');
    } finally {
      setLoading(false);
    }
  };

  const removeTag = async (tagId) => {
    try {
      setLoading(true);
      await nfcService?.deleteNFCTag(tagId);
      
      // Reload tags to get updated list
      await loadNFCTags();
      setError(null);
    } catch (err) {
      setError(err?.message || 'Error deleting NFC tag');
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = (tagIdentifier) => {
    const baseUrl = window.location?.origin;
    return `${baseUrl}/nfc-pet-profile-landing/${tagIdentifier}`;
  };

  const generateNewTagId = () => {
    if (petData?.name && petData?.id) {
      const generatedId = nfcService?.generateTagIdentifier(petData?.name, petData?.id);
      setNewTagId(generatedId);
    } else {
      setError('Primero debes guardar la mascota para generar un ID de placa.');
    }
  };

  const getStatusFromTag = (tag) => {
    if (tag?.is_lost) return 'lost';
    if (tag?.is_stolen) return 'stolen';
    if (!tag?.is_active) return 'inactive';
    return 'active';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'CheckCircle';
      case 'inactive': return 'Circle';
      case 'lost': return 'AlertTriangle';
      case 'stolen': return 'Shield';
      case 'damaged': return 'AlertCircle';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    const statusOption = tagStatusOptions?.find(opt => opt?.value === status);
    return statusOption?.color || 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted transition-smooth"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={20} className="text-secondary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Gestión de Placas NFC</h3>
            <p className="text-sm text-muted-foreground">
              {realNfcTags?.length} placa{realNfcTags?.length !== 1 ? 's' : ''} registrada{realNfcTags?.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border">
          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
              {error}
            </div>
          )}

          {/* Auto-Creation Notice for New Pets */}
          {realNfcTags?.length === 0 && petData?.id && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
              <div className="flex items-center space-x-2">
                <Icon name="Info" size={16} className="text-blue-500" />
                <span className="font-medium">Placa Automática</span>
              </div>
              <p className="mt-1">
                Se creará automáticamente una placa NFC por defecto cuando guardes la mascota. 
                También puedes agregar placas adicionales manualmente.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mt-6 mb-4">
            <div>
              <h4 className="font-medium text-foreground">Placas NFC Registradas</h4>
              <p className="text-sm text-muted-foreground">
                Gestiona las placas NFC asociadas a esta mascota
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              iconPosition="left"
              onClick={() => setShowAddTag(true)}
              disabled={loading}
            >
              Agregar Placa
            </Button>
          </div>

          {/* Add New Tag Form */}
          {showAddTag && (
            <div className="mb-6 p-4 border border-primary/20 bg-primary/5 rounded-lg">
              <h5 className="font-medium text-foreground mb-4">Agregar Nueva Placa NFC</h5>
              <div className="space-y-4">
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <Input
                      label="ID de la placa NFC"
                      type="text"
                      placeholder="Deja vacío para generar automáticamente"
                      value={newTagId}
                      onChange={(e) => setNewTagId(e?.target?.value)}
                      description="Introduce un ID personalizado o genera uno automático"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={generateNewTagId}
                    disabled={loading || !petData?.name}
                    iconName="Shuffle"
                  >
                    Generar
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button
                    variant="default"
                    onClick={addNFCTag}
                    disabled={loading}
                  >
                    {loading ? 'Agregando...' : 'Agregar Placa'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddTag(false);
                      setNewTagId('');
                    }}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && !showAddTag && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Cargando placas NFC...</p>
            </div>
          )}

          {/* NFC Tags List */}
          {!loading && realNfcTags?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Zap" size={48} className="mx-auto mb-4 opacity-50" />
              <h5 className="font-medium mb-2">No hay placas NFC registradas</h5>
              <p className="text-sm mb-4">
                Agrega una placa NFC para activar el sistema de localización
              </p>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setShowAddTag(true)}
              >
                Agregar Primera Placa
              </Button>
            </div>
          ) : !loading && realNfcTags?.length > 0 ? (
            <div className="space-y-4">
              {realNfcTags?.map((tag, index) => {
                const isPrimary = index === 0; // First tag is considered primary
                const status = getStatusFromTag(tag);
                
                return (
                  <div 
                    key={tag?.id} 
                    className={`p-6 border rounded-lg ${
                      isPrimary 
                        ? 'border-primary bg-primary/5' : 'border-border bg-card'
                    }`}
                  >
                    {/* Primary Tag Badge */}
                    {isPrimary && (
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium flex items-center space-x-1">
                          <Icon name="Star" size={12} />
                          <span>Placa Principal</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Tag Information */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground">ID de la Placa</label>
                          <p className="text-lg font-mono text-primary mt-1">{tag?.tag_identifier}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground">Estado</label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Icon 
                                name={getStatusIcon(status)} 
                                size={16} 
                                className={getStatusColor(status)} 
                              />
                              <Select
                                options={tagStatusOptions}
                                value={status}
                                onChange={(value) => updateTagStatus(tag?.id, value)}
                                className="flex-1"
                                disabled={loading}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-foreground">Activada</label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {tag?.activated_at ? new Date(tag?.activated_at)?.toLocaleDateString('es-ES') : 'No activada'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Tag Actions & QR Code */}
                      <div className="space-y-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <Icon name="Zap" size={24} className="mx-auto mb-2 text-primary" />
                          <p className="text-sm font-medium text-foreground">
                            {tag?.is_active ? 'Activa' : 'Inactiva'}
                          </p>
                          <p className="text-xs text-muted-foreground">Estado actual</p>
                        </div>

                        {/* QR Code Backup */}
                        <div className="p-3 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">URL de acceso</span>
                            <Button
                              variant="outline"
                              size="sm"
                              iconName="Copy"
                              onClick={() => {
                                const url = generateQRCode(tag?.tag_identifier);
                                navigator.clipboard?.writeText(url);
                              }}
                            >
                              Copiar
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground break-all">
                            {generateQRCode(tag?.tag_identifier)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tag Actions */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="ExternalLink"
                          iconPosition="left"
                          onClick={() => {
                            const url = generateQRCode(tag?.tag_identifier);
                            window.open(url, '_blank');
                          }}
                        >
                          Probar Enlace
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="BarChart3"
                          iconPosition="left"
                          onClick={() => {
                            window.location.href = `/scan-history-analytics?tag=${tag?.tag_identifier}`;
                          }}
                        >
                          Ver Historial
                        </Button>
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        iconName="Trash2"
                        onClick={() => removeTag(tag?.id)}
                        disabled={loading}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <div>
                <h5 className="font-medium text-foreground mb-2">Instrucciones de Uso</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Cada placa NFC tiene un ID único que identifica a tu mascota</li>
                  <li>• El enlace de acceso funciona tanto para NFC como para códigos QR</li>
                  <li>• Puedes probar el enlace haciendo clic en "Probar Enlace"</li>
                  <li>• Marca como "perdida" o "robada" para desactivar temporalmente</li>
                  <li>• El historial mostrará todos los escaneos de esta placa específica</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFCTagManagementSection;