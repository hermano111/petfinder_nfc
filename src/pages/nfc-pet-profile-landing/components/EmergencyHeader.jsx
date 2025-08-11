import React from 'react';
import Icon from '../../../components/AppIcon';

const EmergencyHeader = ({ emergencyNumber = "+34 900 123 456" }) => {
  const handleEmergencyCall = () => {
    window.location.href = `tel:${emergencyNumber}`;
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Heart" size={20} color="white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">PetFinder</h1>
            <p className="text-xs text-muted-foreground -mt-1">NFC</p>
          </div>
        </div>

        {/* Emergency Contact */}
        <button
          onClick={handleEmergencyCall}
          className="flex items-center space-x-2 bg-error hover:bg-error/90 text-error-foreground px-4 py-2 rounded-lg transition-smooth"
        >
          <Icon name="Phone" size={18} />
          <div className="text-left hidden sm:block">
            <p className="text-xs font-medium">Emergencia 24/7</p>
            <p className="text-xs opacity-90">{emergencyNumber}</p>
          </div>
          <span className="sm:hidden text-sm font-medium">SOS</span>
        </button>
      </div>

      {/* Emergency Banner */}
      <div className="bg-error/10 border-t border-error/20 px-4 py-2">
        <div className="flex items-center space-x-2 text-sm">
          <Icon name="AlertTriangle" size={16} className="text-error" />
          <p className="text-error font-medium">
            Mascota Perdida - Contacta al propietario inmediatamente
          </p>
        </div>
      </div>
    </header>
  );
};

export default EmergencyHeader;