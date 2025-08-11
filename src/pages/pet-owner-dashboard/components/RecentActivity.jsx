import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'scan':
        return 'Scan';
      case 'profile_update':
        return 'Edit';
      case 'lost_report':
        return 'AlertTriangle';
      case 'found_report':
        return 'CheckCircle';
      case 'medical_update':
        return 'FileText';
      default:
        return 'Bell';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'scan':
        return 'text-primary';
      case 'profile_update':
        return 'text-accent';
      case 'lost_report':
        return 'text-error';
      case 'found_report':
        return 'text-success';
      case 'medical_update':
        return 'text-secondary';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTime = (timestamp) => {
    try {
      if (!timestamp) return 'Fecha no disponible';
      
      const date = new Date(timestamp);
      
      // Check if the date is valid
      if (isNaN(date?.getTime())) {
        return 'Fecha inválida';
      }
      
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Ahora mismo';
      if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `Hace ${diffInHours}h`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return 'Hace 1 día';
      if (diffInDays < 7) return `Hace ${diffInDays} días`;
      
      // For older dates, show the actual date
      return date?.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short',
        year: date?.getFullYear() !== now?.getFullYear() ? 'numeric' : undefined
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Error en fecha';
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return null;
    
    const statusConfig = {
      found: { text: 'Encontrado', color: 'bg-yellow-100 text-yellow-800' },
      returned: { text: 'Devuelto', color: 'bg-green-100 text-green-800' },
      false_alarm: { text: 'Falsa Alarma', color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig?.[status];
    if (!config) return null;
    
    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${config?.color}`}>
        {config?.text}
      </span>
    );
  };

  if (!activities || activities?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-4">Actividad Reciente</h3>
        <div className="text-center py-8">
          <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No hay actividad reciente</p>
          <p className="text-sm text-muted-foreground mt-2">
            Los escaneos de códigos NFC aparecerán aquí
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Actividad Reciente</h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-smooth">
          Ver todo
        </button>
      </div>
      <div className="space-y-4">
        {activities?.slice(0, 5)?.map((activity, index) => (
          <div key={activity?.id || index} className="flex items-start space-x-3">
            <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity?.type)}`}>
              <Icon name={getActivityIcon(activity?.type)} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                {activity?.petPhoto && (
                  <Image
                    src={activity?.petPhoto}
                    alt={activity?.petName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <p className="text-sm font-medium text-foreground truncate">
                  {activity?.petName || 'Mascota desconocida'}
                </p>
                {getStatusBadge(activity?.status)}
              </div>
              
              <p className="text-sm text-muted-foreground mb-1">
                {activity?.description || 'Actividad sin descripción'}
              </p>
              
              {activity?.location && (
                <div className="flex items-center space-x-1 mb-1">
                  <Icon name="MapPin" size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{activity?.location}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {formatTime(activity?.timestamp)}
                </p>
                
                {/* Optional: Show scan details for debugging in development */}
                {process.env?.NODE_ENV === 'development' && activity?.scanData && (
                  <button
                    onClick={() => console.log('Scan details:', activity?.scanData)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Debug
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {activities?.length > 5 && (
        <div className="mt-4 pt-4 border-t border-border">
          <button className="w-full text-sm text-primary hover:text-primary/80 font-medium">
            Ver {activities?.length - 5} actividades más
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;