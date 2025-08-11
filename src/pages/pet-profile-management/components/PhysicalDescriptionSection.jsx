import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const PhysicalDescriptionSection = ({ 
  petData, 
  onUpdate, 
  isExpanded, 
  onToggle,
  errors = {} 
}) => {
  const [localData, setLocalData] = useState(petData);

  const colorOptions = [
    { value: 'negro', label: 'Negro' },
    { value: 'blanco', label: 'Blanco' },
    { value: 'marron', label: 'Marrón' },
    { value: 'dorado', label: 'Dorado' },
    { value: 'gris', label: 'Gris' },
    { value: 'crema', label: 'Crema' },
    { value: 'tricolor', label: 'Tricolor' },
    { value: 'atigrado', label: 'Atigrado' },
    { value: 'manchado', label: 'Manchado' },
    { value: 'otro', label: 'Otro' }
  ];

  const coatTypeOptions = [
    { value: 'corto', label: 'Pelo Corto' },
    { value: 'medio', label: 'Pelo Medio' },
    { value: 'largo', label: 'Pelo Largo' },
    { value: 'rizado', label: 'Rizado' },
    { value: 'sin_pelo', label: 'Sin Pelo' }
  ];

  const eyeColorOptions = [
    { value: 'marron', label: 'Marrón' },
    { value: 'azul', label: 'Azul' },
    { value: 'verde', label: 'Verde' },
    { value: 'ambar', label: 'Ámbar' },
    { value: 'heterocromia', label: 'Heterocromía (diferentes colores)' }
  ];

  const distinctiveFeatures = [
    { id: 'collar', label: 'Lleva collar habitualmente' },
    { id: 'cicatrices', label: 'Tiene cicatrices visibles' },
    { id: 'manchas_especiales', label: 'Manchas o marcas distintivas' },
    { id: 'orejas_cortadas', label: 'Orejas cortadas' },
    { id: 'cola_cortada', label: 'Cola cortada' },
    { id: 'cojera', label: 'Cojea o tiene dificultad para caminar' },
    { id: 'sordo', label: 'Sordo o con problemas auditivos' },
    { id: 'ciego', label: 'Ciego o con problemas visuales' }
  ];

  const handleInputChange = (field, value) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    onUpdate(updatedData);
  };

  const handleFeatureToggle = (featureId, checked) => {
    const currentFeatures = localData?.distinctiveFeatures || [];
    const updatedFeatures = checked 
      ? [...currentFeatures, featureId]
      : currentFeatures?.filter(id => id !== featureId);
    
    handleInputChange('distinctiveFeatures', updatedFeatures);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted transition-smooth"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Eye" size={20} className="text-accent" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Descripción Física</h3>
            <p className="text-sm text-muted-foreground">
              Color, pelaje, marcas distintivas
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
            <Select
              label="Color principal *"
              placeholder="Selecciona el color"
              options={colorOptions}
              value={localData?.primaryColor || ''}
              onChange={(value) => handleInputChange('primaryColor', value)}
              error={errors?.primaryColor}
              required
              className="col-span-1"
            />

            <Select
              label="Colores secundarios"
              placeholder="Selecciona colores adicionales"
              options={colorOptions?.filter(option => option?.value !== localData?.primaryColor)}
              value={localData?.secondaryColors || []}
              onChange={(value) => handleInputChange('secondaryColors', value)}
              error={errors?.secondaryColors}
              multiple
              className="col-span-1"
            />

            <Select
              label="Tipo de pelaje"
              placeholder="Selecciona el tipo"
              options={coatTypeOptions}
              value={localData?.coatType || ''}
              onChange={(value) => handleInputChange('coatType', value)}
              error={errors?.coatType}
              className="col-span-1"
            />

            <Select
              label="Color de ojos"
              placeholder="Selecciona el color"
              options={eyeColorOptions}
              value={localData?.eyeColor || ''}
              onChange={(value) => handleInputChange('eyeColor', value)}
              error={errors?.eyeColor}
              className="col-span-1"
            />

            <div className="col-span-1 md:col-span-2">
              <Input
                label="Marcas específicas"
                type="text"
                placeholder="Ej: Mancha blanca en el pecho, cicatriz en la pata trasera..."
                value={localData?.specificMarkings || ''}
                onChange={(e) => handleInputChange('specificMarkings', e?.target?.value)}
                error={errors?.specificMarkings}
                description="Describe marcas, manchas o características únicas"
              />
            </div>
          </div>

          {/* Distinctive Features */}
          <div className="mt-8">
            <h4 className="font-medium text-foreground mb-4">Características Distintivas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {distinctiveFeatures?.map((feature) => (
                <Checkbox
                  key={feature?.id}
                  label={feature?.label}
                  checked={(localData?.distinctiveFeatures || [])?.includes(feature?.id)}
                  onChange={(e) => handleFeatureToggle(feature?.id, e?.target?.checked)}
                />
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="mt-6">
            <Input
              label="Notas adicionales sobre apariencia"
              type="text"
              placeholder="Cualquier otra característica física importante..."
              value={localData?.physicalNotes || ''}
              onChange={(e) => handleInputChange('physicalNotes', e?.target?.value)}
              error={errors?.physicalNotes}
              description="Esta información ayudará a identificar a tu mascota"
            />
          </div>

          {/* Size Measurements */}
          <div className="mt-6">
            <h4 className="font-medium text-foreground mb-4">Medidas (Opcional)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Altura (cm)"
                type="number"
                placeholder="45"
                value={localData?.height || ''}
                onChange={(e) => handleInputChange('height', e?.target?.value)}
                min="1"
                className="col-span-1"
              />
              
              <Input
                label="Longitud (cm)"
                type="number"
                placeholder="60"
                value={localData?.length || ''}
                onChange={(e) => handleInputChange('length', e?.target?.value)}
                min="1"
                className="col-span-1"
              />
              
              <Input
                label="Perímetro pecho (cm)"
                type="number"
                placeholder="70"
                value={localData?.chestGirth || ''}
                onChange={(e) => handleInputChange('chestGirth', e?.target?.value)}
                min="1"
                className="col-span-1"
              />
              
              <Input
                label="Perímetro cuello (cm)"
                type="number"
                placeholder="35"
                value={localData?.neckGirth || ''}
                onChange={(e) => handleInputChange('neckGirth', e?.target?.value)}
                min="1"
                className="col-span-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Info" size={16} />
              <span>Información detallada ayuda en la identificación</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhysicalDescriptionSection;