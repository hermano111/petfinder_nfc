import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const AuthHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => navigate('/nfc-pet-profile-landing')}
          className="flex items-center space-x-3 hover:opacity-80 transition-smooth"
        >
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-soft">
            <Icon name="Heart" size={28} color="white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">PetFinder</h1>
            <p className="text-sm text-primary font-medium -mt-1">NFC</p>
          </div>
        </button>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Bienvenido a PetFinder NFC
        </h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          La plataforma más avanzada para proteger a tus mascotas con tecnología NFC
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="flex justify-center items-center space-x-6 mt-6 pt-6 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
            <Icon name="Shield" size={16} color="var(--color-success)" />
          </div>
          <span className="text-xs text-muted-foreground">Seguro</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Zap" size={16} color="var(--color-primary)" />
          </div>
          <span className="text-xs text-muted-foreground">Rápido</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
            <Icon name="MapPin" size={16} color="var(--color-warning)" />
          </div>
          <span className="text-xs text-muted-foreground">Preciso</span>
        </div>
      </div>
    </div>
  );
};

export default AuthHeader;