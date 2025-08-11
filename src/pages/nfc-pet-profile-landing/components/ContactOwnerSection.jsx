import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContactOwnerSection = ({ 
  ownerName = "Propietario", 
  whatsappNumber = "+34600000000",
  onContactOwner = () => {},
  petName = "Mascota",
  currentLocation = null 
}) => {
  const [isContacting, setIsContacting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactOwner = async () => {
    setIsContacting(true);
    
    try {
      // Simulate webhook call to n8n for WhatsApp notification
      await onContactOwner({
        petName,
        finderLocation: currentLocation,
        timestamp: new Date()?.toISOString(),
        whatsappNumber
      });
      
      setContactSuccess(true);
      
      // Open WhatsApp with pre-filled message
      const message = encodeURIComponent(
        `¡Hola! He encontrado a ${petName}. Vi su información en la placa NFC. ¿Podemos coordinar para reunirlos?`
      );
      const whatsappUrl = `https://wa.me/${whatsappNumber?.replace(/[^0-9]/g, '')}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      
    } catch (error) {
      console.error('Error contacting owner:', error);
    } finally {
      setIsContacting(false);
    }
  };

  const handleEmergencyCall = () => {
    window.location.href = `tel:${whatsappNumber}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
          <Icon name="MessageCircle" size={32} className="text-success" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Contactar al Propietario</h2>
        <p className="text-muted-foreground">
          Notificaremos inmediatamente a {ownerName} que has encontrado a su mascota
        </p>
      </div>
      {!contactSuccess ? (
        <div className="space-y-4">
          {/* Main Contact Button */}
          <Button
            variant="success"
            size="lg"
            fullWidth
            loading={isContacting}
            iconName="MessageCircle"
            iconPosition="left"
            onClick={handleContactOwner}
            className="text-lg py-4"
          >
            {isContacting ? 'Notificando...' : 'Contactar por WhatsApp'}
          </Button>

          {/* Emergency Call Button */}
          <Button
            variant="outline"
            size="lg"
            fullWidth
            iconName="Phone"
            iconPosition="left"
            onClick={handleEmergencyCall}
          >
            Llamar Directamente
          </Button>

          {/* Information Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-primary">
                <p className="font-medium mb-1">¿Qué sucede cuando contactas?</p>
                <ul className="space-y-1 text-primary/80">
                  <li>• El propietario recibe una notificación inmediata</li>
                  <li>• Se comparte tu ubicación actual (si das permiso)</li>
                  <li>• Se abre WhatsApp con un mensaje predefinido</li>
                  <li>• Se registra el escaneo para seguimiento</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-success mb-2">¡Notificación Enviada!</h3>
            <p className="text-muted-foreground mb-4">
              El propietario ha sido notificado y debería contactarte pronto por WhatsApp.
            </p>
          </div>
          
          {/* Additional Actions */}
          <div className="space-y-3">
            <Button
              variant="outline"
              fullWidth
              iconName="MessageCircle"
              iconPosition="left"
              onClick={() => {
                const message = encodeURIComponent(
                  `¡Hola! He encontrado a ${petName}. Vi su información en la placa NFC. ¿Podemos coordinar para reunirlos?`
                );
                const whatsappUrl = `https://wa.me/${whatsappNumber?.replace(/[^0-9]/g, '')}?text=${message}`;
                window.open(whatsappUrl, '_blank');
              }}
            >
              Abrir WhatsApp Nuevamente
            </Button>
            
            <Button
              variant="ghost"
              fullWidth
              iconName="Phone"
              iconPosition="left"
              onClick={handleEmergencyCall}
            >
              Llamar por Teléfono
            </Button>
          </div>
        </div>
      )}
      {/* Emergency Information */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Shield" size={16} />
          <span>Línea de emergencia 24/7: +34 900 123 456</span>
        </div>
      </div>
    </div>
  );
};

export default ContactOwnerSection;