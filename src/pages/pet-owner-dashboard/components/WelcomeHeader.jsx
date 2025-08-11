import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = ({ userName, currentTime }) => {
  const getGreeting = () => {
    const hour = new Date()?.getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const formatDate = () => {
    const now = new Date();
    return now?.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {getGreeting()}, {userName}
          </h1>
          <p className="text-muted-foreground capitalize">
            {formatDate()}
          </p>
        </div>
        
        <div className="hidden sm:flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Hora actual</p>
            <p className="text-lg font-semibold text-foreground">
              {currentTime?.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          
          <div className="p-3 bg-primary/10 rounded-full">
            <Icon name="Sun" size={24} className="text-primary" />
          </div>
        </div>
      </div>
      {/* Weather-like info */}
      <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Icon name="Thermometer" size={16} />
          <span>Perfecto para pasear mascotas</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={16} />
          <span>Todas las placas funcionando</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;