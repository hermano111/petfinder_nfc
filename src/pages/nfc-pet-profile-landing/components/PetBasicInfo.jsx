import React from 'react';
import Icon from '../../../components/AppIcon';

const PetBasicInfo = ({ pet = {} }) => {
  const {
    name = "Mascota Desconocida",
    breed = "Raza no especificada",
    color = "Color no especificado",
    age = null,
    weight = null,
    gender = null,
    distinctiveMarks = [],
    lastKnownLocation = null,
    status = "perdido"
  } = pet;

  const getStatusInfo = (status) => {
    switch (status) {
      case 'perdido':
        return { color: 'text-error', bgColor: 'bg-error/10', icon: 'AlertTriangle', text: 'PERDIDO' };
      case 'encontrado':
        return { color: 'text-warning', bgColor: 'bg-warning/10', icon: 'MapPin', text: 'ENCONTRADO' };
      case 'seguro':
        return { color: 'text-success', bgColor: 'bg-success/10', icon: 'Shield', text: 'SEGURO' };
      default:
        return { color: 'text-muted-foreground', bgColor: 'bg-muted', icon: 'HelpCircle', text: 'DESCONOCIDO' };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      {/* Pet Name and Status */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{name}</h1>
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${statusInfo?.bgColor}`}>
          <Icon name={statusInfo?.icon} size={20} className={statusInfo?.color} />
          <span className={`font-semibold ${statusInfo?.color}`}>{statusInfo?.text}</span>
        </div>
      </div>
      {/* Basic Information Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Dog" size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Raza</p>
            <p className="font-medium text-foreground">{breed}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Palette" size={20} className="text-secondary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Color</p>
            <p className="font-medium text-foreground">{color}</p>
          </div>
        </div>

        {age && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Edad</p>
              <p className="font-medium text-foreground">{age} años</p>
            </div>
          </div>
        )}

        {weight && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Scale" size={20} className="text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Peso</p>
              <p className="font-medium text-foreground">{weight} kg</p>
            </div>
          </div>
        )}

        {gender && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name={gender === 'macho' ? 'Mars' : 'Venus'} size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sexo</p>
              <p className="font-medium text-foreground capitalize">{gender}</p>
            </div>
          </div>
        )}
      </div>
      {/* Distinctive Marks */}
      {distinctiveMarks && distinctiveMarks?.length > 0 && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Eye" size={20} className="text-destructive" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Marcas Distintivas</p>
              <div className="space-y-1">
                {distinctiveMarks?.map((mark, index) => (
                  <p key={index} className="text-sm font-medium text-foreground bg-muted px-3 py-1 rounded-md">
                    {mark}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Last Known Location */}
      {lastKnownLocation && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="MapPin" size={20} className="text-error" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Última Ubicación Conocida</p>
              <p className="font-medium text-foreground">{lastKnownLocation}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Reportado el {new Date()?.toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetBasicInfo;