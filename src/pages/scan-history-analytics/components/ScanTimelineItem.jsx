import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ScanTimelineItem = ({ scan, onLocationClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(new Date(date));
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const scanDate = new Date(date);
    const diffInHours = Math.floor((now - scanDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    return formatDate(date);
  };

  const getScanTypeIcon = (type) => {
    switch (type) {
      case 'finder': return 'Search';
      case 'owner': return 'User';
      case 'vet': return 'Stethoscope';
      case 'emergency': return 'AlertTriangle';
      default: return 'Smartphone';
    }
  };

  const getScanTypeColor = (type) => {
    switch (type) {
      case 'finder': return 'text-warning';
      case 'owner': return 'text-success';
      case 'vet': return 'text-primary';
      case 'emergency': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getScanTypeLabel = (type) => {
    switch (type) {
      case 'finder': return 'Persona que encontró';
      case 'owner': return 'Propietario';
      case 'vet': return 'Veterinario';
      case 'emergency': return 'Emergencia';
      default: return 'Escaneo general';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-soft transition-smooth">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${getScanTypeColor(scan?.scanType)}`}>
            <Icon name={getScanTypeIcon(scan?.scanType)} size={20} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-foreground truncate">
                {scan?.location}
              </h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                scan?.scanType === 'emergency' ? 'bg-error/10 text-error' :
                scan?.scanType === 'finder' ? 'bg-warning/10 text-warning' :
                scan?.scanType === 'vet'? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
              }`}>
                {getScanTypeLabel(scan?.scanType)}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
              <span>{getTimeAgo(scan?.timestamp)}</span>
              {scan?.weather && (
                <div className="flex items-center space-x-1">
                  <Icon name="Cloud" size={14} />
                  <span>{scan?.weather?.condition}, {scan?.weather?.temperature}°C</span>
                </div>
              )}
            </div>

            {scan?.scannerInfo && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Smartphone" size={14} />
                <span>{scan?.scannerInfo?.device} • {scan?.scannerInfo?.browser}</span>
              </div>
            )}

            {scan?.message && (
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p className="text-sm text-foreground">{scan?.message}</p>
                {scan?.finderContact && (
                  <div className="mt-2 flex items-center space-x-2">
                    <Icon name="Phone" size={14} className="text-primary" />
                    <span className="text-sm text-primary font-medium">{scan?.finderContact}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onLocationClick(scan?.coordinates)}
            className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth"
            title="Ver en mapa"
          >
            <Icon name="MapPin" size={16} />
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-smooth"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Coordenadas GPS:</span>
              <p className="font-mono text-foreground">{scan?.coordinates?.lat}, {scan?.coordinates?.lng}</p>
            </div>
            
            <div>
              <span className="text-muted-foreground">Fecha completa:</span>
              <p className="text-foreground">{formatDate(scan?.timestamp)}</p>
            </div>

            {scan?.accuracy && (
              <div>
                <span className="text-muted-foreground">Precisión GPS:</span>
                <p className="text-foreground">±{scan?.accuracy}m</p>
              </div>
            )}

            {scan?.batteryLevel && (
              <div>
                <span className="text-muted-foreground">Batería del dispositivo:</span>
                <p className="text-foreground">{scan?.batteryLevel}%</p>
              </div>
            )}
          </div>

          {scan?.photos && scan?.photos?.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground mb-2 block">Fotos del escaneo:</span>
              <div className="flex space-x-2 overflow-x-auto">
                {scan?.photos?.map((photo, index) => (
                  <div key={index} className="flex-shrink-0">
                    <Image
                      src={photo}
                      alt={`Foto del escaneo ${index + 1}`}
                      className="w-16 h-16 rounded-md object-cover border border-border"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {scan?.notes && (
            <div>
              <span className="text-sm text-muted-foreground mb-1 block">Notas adicionales:</span>
              <p className="text-sm text-foreground bg-muted p-2 rounded-md">{scan?.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScanTimelineItem;