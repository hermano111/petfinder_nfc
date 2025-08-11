import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EmergencyAlert = ({ lostPets }) => {
  const navigate = useNavigate();

  if (!lostPets || lostPets?.length === 0) {
    return null;
  }

  const handleManageLostPet = (petId) => {
    navigate(`/lost-pet-management/${petId}`);
  };

  const handleViewAllLost = () => {
    navigate('/lost-pets-overview');
  };

  return (
    <div className="bg-error/5 border border-error/20 rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-error/10 rounded-full">
          <Icon name="AlertTriangle" size={24} className="text-error" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-error">Alerta de Emergencia</h3>
          <p className="text-sm text-muted-foreground">
            {lostPets?.length} mascota{lostPets?.length > 1 ? 's' : ''} reportada{lostPets?.length > 1 ? 's' : ''} como perdida{lostPets?.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {lostPets?.slice(0, 2)?.map((pet, index) => (
          <div key={index} className="bg-card border border-error/20 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Image
                src={pet?.photo}
                alt={pet?.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-error"
              />
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{pet?.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Perdida desde: {new Date(pet.lostDate)?.toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>

            {pet?.lastKnownLocation && (
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="MapPin" size={14} className="text-error" />
                <span className="text-sm text-muted-foreground">
                  Última ubicación: {pet?.lastKnownLocation}
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Search"
                iconPosition="left"
                onClick={() => handleManageLostPet(pet?.id)}
                className="flex-1"
              >
                Gestionar Búsqueda
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                iconName="Share"
                iconPosition="left"
                onClick={() => {/* Handle share */}}
                className="flex-1"
              >
                Compartir Alerta
              </Button>
            </div>
          </div>
        ))}

        {lostPets?.length > 2 && (
          <Button
            variant="outline"
            size="sm"
            iconName="Eye"
            iconPosition="left"
            onClick={handleViewAllLost}
            fullWidth
          >
            Ver todas las mascotas perdidas ({lostPets?.length})
          </Button>
        )}
      </div>
      {/* Emergency Contacts */}
      <div className="mt-4 pt-4 border-t border-error/20">
        <p className="text-sm font-medium text-foreground mb-2">Contactos de Emergencia:</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Phone"
            iconPosition="left"
            onClick={() => window.open('tel:112')}
          >
            Emergencias 112
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="MessageCircle"
            iconPosition="left"
            onClick={() => window.open('https://wa.me/34600000000')}
          >
            WhatsApp Soporte
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlert;