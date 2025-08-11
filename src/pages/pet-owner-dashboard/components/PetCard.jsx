import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PetCard = ({ pet, onReportLost, onEditProfile, onViewHistory }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'inactive':
        return 'bg-warning text-warning-foreground';
      case 'lost':
        return 'bg-error text-error-foreground';
      case 'needs_replacement':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'inactive':
        return 'Inactiva';
      case 'lost':
        return 'Perdida';
      case 'needs_replacement':
        return 'Reemplazar';
      default:
        return 'Desconocido';
    }
  };

  const formatLastScan = (lastScan) => {
    if (!lastScan) return 'Sin escaneos';
    const date = new Date(lastScan);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} días`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft hover:shadow-elevated transition-smooth">
      {/* Pet Header */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative">
          <Image
            src={pet?.photo}
            alt={pet?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
          />
          {pet?.tagStatus === 'lost' && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full border-2 border-card flex items-center justify-center">
              <Icon name="AlertTriangle" size={12} color="white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground truncate">{pet?.name}</h3>
          <p className="text-sm text-muted-foreground">{pet?.breed} • {pet?.age} años</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pet?.tagStatus)}`}>
              <Icon name="Zap" size={12} className="mr-1" />
              {getStatusText(pet?.tagStatus)}
            </span>
          </div>
        </div>
      </div>
      {/* Pet Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Icon name="Scan" size={16} className="text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">{pet?.totalScans}</p>
          <p className="text-xs text-muted-foreground">Escaneos</p>
        </div>
        
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Icon name="Clock" size={16} className="text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">{formatLastScan(pet?.lastScan)}</p>
          <p className="text-xs text-muted-foreground">Último escaneo</p>
        </div>
      </div>
      {/* Microchip Info */}
      {pet?.microchipId && (
        <div className="flex items-center space-x-2 mb-4 p-2 bg-muted rounded-lg">
          <Icon name="Zap" size={14} className="text-muted-foreground" />
          <span className="text-sm font-mono text-muted-foreground">{pet?.microchipId}</span>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          iconName="Edit"
          iconPosition="left"
          onClick={() => onEditProfile(pet?.id)}
          className="flex-1"
        >
          Editar
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          iconName="Activity"
          iconPosition="left"
          onClick={() => onViewHistory(pet?.id)}
          className="flex-1"
        >
          Historial
        </Button>
        
        {pet?.tagStatus !== 'lost' && (
          <Button
            variant="destructive"
            size="sm"
            iconName="AlertTriangle"
            iconPosition="left"
            onClick={() => onReportLost(pet?.id)}
            className="flex-1"
          >
            Reportar
          </Button>
        )}
      </div>
      {/* Lost Pet Alert */}
      {pet?.tagStatus === 'lost' && (
        <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">Mascota Perdida</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Reportada como perdida el {new Date(pet.lostDate)?.toLocaleDateString('es-ES')}
          </p>
          <Button
            variant="outline"
            size="sm"
            iconName="MapPin"
            iconPosition="left"
            onClick={() => navigate(`/lost-pet-management/${pet?.id}`)}
            fullWidth
          >
            Gestionar Búsqueda
          </Button>
        </div>
      )}
    </div>
  );
};

export default PetCard;