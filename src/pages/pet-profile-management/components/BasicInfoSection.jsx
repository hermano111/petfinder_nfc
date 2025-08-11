import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const BasicInfoSection = ({ 
  petData, 
  onUpdate, 
  isExpanded, 
  onToggle,
  errors = {} 
}) => {
  const [localData, setLocalData] = useState(petData);

  const breedOptions = [
    { value: 'labrador', label: 'Labrador Retriever' },
    { value: 'golden_retriever', label: 'Golden Retriever' },
    { value: 'pastor_aleman', label: 'Pastor Alemán' },
    { value: 'bulldog_frances', label: 'Bulldog Francés' },
    { value: 'chihuahua', label: 'Chihuahua' },
    { value: 'yorkshire', label: 'Yorkshire Terrier' },
    { value: 'poodle', label: 'Poodle' },
    { value: 'mestizo', label: 'Mestizo' },
    { value: 'otro', label: 'Otro' }
  ];

  const genderOptions = [
    { value: 'macho', label: 'Macho' },
    { value: 'hembra', label: 'Hembra' }
  ];

  const sizeOptions = [
    { value: 'toy', label: 'Toy (< 2kg)' },
    { value: 'pequeño', label: 'Pequeño (2-10kg)' },
    { value: 'mediano', label: 'Mediano (10-25kg)' },
    { value: 'grande', label: 'Grande (25-45kg)' },
    { value: 'gigante', label: 'Gigante (> 45kg)' }
  ];

  const handleInputChange = (field, value) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    onUpdate(updatedData);
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    const ageInMonths = (today?.getFullYear() - birth?.getFullYear()) * 12 + today?.getMonth() - birth?.getMonth();
    
    if (ageInMonths < 12) {
      return `${ageInMonths} meses`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      return months > 0 ? `${years} años, ${months} meses` : `${years} años`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted transition-smooth"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="User" size={20} className="text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Información Básica</h3>
            <p className="text-sm text-muted-foreground">
              Nombre, raza, edad y datos principales
            </p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Input
              label="Nombre de la mascota *"
              type="text"
              placeholder="Ej: Max, Luna, Rocky"
              value={localData?.name || ''}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              error={errors?.name}
              required
              className="col-span-1"
            />

            <Select
              label="Raza *"
              placeholder="Selecciona la raza"
              options={breedOptions}
              value={localData?.breed || ''}
              onChange={(value) => handleInputChange('breed', value)}
              error={errors?.breed}
              required
              searchable
              className="col-span-1"
            />

            <Input
              label="Fecha de nacimiento"
              type="date"
              value={localData?.birthDate || ''}
              onChange={(e) => handleInputChange('birthDate', e?.target?.value)}
              error={errors?.birthDate}
              description={localData?.birthDate ? `Edad: ${calculateAge(localData?.birthDate)}` : ''}
              className="col-span-1"
            />

            <Select
              label="Género *"
              placeholder="Selecciona el género"
              options={genderOptions}
              value={localData?.gender || ''}
              onChange={(value) => handleInputChange('gender', value)}
              error={errors?.gender}
              required
              className="col-span-1"
            />

            <Input
              label="Peso (kg)"
              type="number"
              placeholder="Ej: 15.5"
              value={localData?.weight || ''}
              onChange={(e) => handleInputChange('weight', e?.target?.value)}
              error={errors?.weight}
              min="0"
              step="0.1"
              className="col-span-1"
            />

            <Select
              label="Tamaño"
              placeholder="Selecciona el tamaño"
              options={sizeOptions}
              value={localData?.size || ''}
              onChange={(value) => handleInputChange('size', value)}
              error={errors?.size}
              className="col-span-1"
            />

            <Input
              label="Número de microchip"
              type="text"
              placeholder="Ej: 982000123456789"
              value={localData?.microchipId || ''}
              onChange={(e) => handleInputChange('microchipId', e?.target?.value)}
              error={errors?.microchipId}
              description="15 dígitos del microchip ISO"
              className="col-span-1 md:col-span-2"
            />

            <div className="col-span-1 md:col-span-2">
              <Input
                label="Descripción especial"
                type="text"
                placeholder="Características distintivas, personalidad, comportamiento..."
                value={localData?.description || ''}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                error={errors?.description}
                description="Esta información aparecerá en el perfil público NFC"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Info" size={16} />
              <span>Los campos marcados con * son obligatorios</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="RotateCcw"
              iconPosition="left"
              onClick={() => {
                setLocalData(petData);
                onUpdate(petData);
              }}
            >
              Restablecer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicInfoSection;