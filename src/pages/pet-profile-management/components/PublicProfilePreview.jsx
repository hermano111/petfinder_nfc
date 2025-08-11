import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PublicProfilePreview = ({ petData, className = "" }) => {
  const primaryPhoto = petData?.photos?.find(photo => photo?.id === petData?.primaryPhotoId) || petData?.photos?.[0];
  const primaryContact = petData?.emergencyContacts?.find(contact => contact?.isPrimary) || petData?.emergencyContacts?.[0];
  const primaryTag = petData?.nfcTags?.find(tag => tag?.isPrimary) || petData?.nfcTags?.[0];

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return 'text-success bg-success/10 border-success/20';
      case 'lost': return 'text-error bg-error/10 border-error/20';
      default: return 'text-warning bg-warning/10 border-warning/20';
    }
  };

  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return '';
    return phone?.replace(/\D/g, '');
  };

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
      {/* Preview Header */}
      <div className="px-4 py-3 bg-muted/50 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Eye" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Vista Previa Pública</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Smartphone" size={14} />
            <span>Móvil</span>
          </div>
        </div>
      </div>
      {/* Mobile Preview Container */}
      <div className="p-4">
        <div className="max-w-sm mx-auto bg-white border-2 border-gray-300 rounded-2xl overflow-hidden shadow-lg">
          {/* Mobile Status Bar */}
          <div className="bg-black text-white px-4 py-1 text-xs flex justify-between items-center">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <Icon name="Signal" size={12} />
              <Icon name="Wifi" size={12} />
              <Icon name="Battery" size={12} />
            </div>
          </div>

          {/* Pet Profile Content */}
          <div className="p-4 bg-background min-h-96">
            {/* Pet Photo */}
            <div className="relative mb-4">
              <div className="w-full h-48 bg-muted rounded-lg overflow-hidden">
                {primaryPhoto ? (
                  <Image
                    src={primaryPhoto?.url}
                    alt={petData?.name || 'Mascota'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon name="Camera" size={48} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              
              {/* Status Badge */}
              {petData?.status && (
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(petData?.status)}`}>
                  {petData?.status === 'safe' ? 'Seguro' : 
                   petData?.status === 'lost' ? '¡PERDIDO!' : 'Estado Desconocido'}
                </div>
              )}
            </div>

            {/* Pet Basic Info */}
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold text-foreground mb-1">
                {petData?.name || 'Nombre de la mascota'}
              </h1>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <span>{petData?.breed || 'Raza'}</span>
                {petData?.gender && (
                  <>
                    <span>•</span>
                    <span>{petData?.gender}</span>
                  </>
                )}
                {petData?.age && (
                  <>
                    <span>•</span>
                    <span>{petData?.age}</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            {petData?.description && (
              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground text-center">
                  {petData?.description}
                </p>
              </div>
            )}

            {/* Emergency Medical Info */}
            {petData?.emergencyMedicalNotes && (
              <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-error mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-error mb-1">Información Médica Importante</h4>
                    <p className="text-xs text-foreground">{petData?.emergencyMedicalNotes}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            {primaryContact && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-foreground mb-3 text-center">
                  Contactar al Propietario
                </h3>
                
                <div className="space-y-2">
                  {/* WhatsApp Button */}
                  {primaryContact?.phone && (
                    <a
                      href={`https://wa.me/${formatPhoneForWhatsApp(primaryContact?.phone)}?text=¡Hola! He encontrado a ${petData?.name || 'tu mascota'}. Estoy en [ubicación] y está bien.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-success text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-success/90 transition-smooth"
                    >
                      <Icon name="MessageCircle" size={18} />
                      <span className="font-medium">Enviar WhatsApp</span>
                    </a>
                  )}
                  
                  {/* Call Button */}
                  {primaryContact?.phone && (
                    <a
                      href={`tel:${primaryContact?.phone}`}
                      className="w-full bg-primary text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-primary/90 transition-smooth"
                    >
                      <Icon name="Phone" size={18} />
                      <span className="font-medium">Llamar</span>
                    </a>
                  )}
                </div>

                <div className="mt-3 text-center">
                  <p className="text-xs text-muted-foreground">
                    Contacto: {primaryContact?.name}
                  </p>
                  {primaryContact?.relationship && (
                    <p className="text-xs text-muted-foreground">
                      {primaryContact?.relationship}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="space-y-2 text-xs">
              {petData?.microchipId && (
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-muted-foreground">Microchip:</span>
                  <span className="font-mono text-foreground">{petData?.microchipId}</span>
                </div>
              )}
              
              {primaryTag && (
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-muted-foreground">ID NFC:</span>
                  <span className="font-mono text-foreground">{primaryTag?.tagId}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-border text-center">
              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Heart" size={12} />
                <span>PetFinder NFC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Preview Actions */}
      <div className="px-4 py-3 bg-muted/50 border-t border-border">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Así verán tu mascota quienes escaneen el NFC
          </p>
          <Button
            variant="outline"
            size="sm"
            iconName="ExternalLink"
            iconPosition="left"
            onClick={() => {
              if (primaryTag) {
                window.open(`/nfc-pet-profile-landing/${primaryTag?.tagId}`, '_blank');
              }
            }}
            disabled={!primaryTag}
          >
            Ver Completo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePreview;