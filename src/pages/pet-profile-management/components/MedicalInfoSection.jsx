import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const MedicalInfoSection = ({ 
  petData, 
  onUpdate, 
  isExpanded, 
  onToggle,
  errors = {} 
}) => {
  const [localData, setLocalData] = useState(petData);

  const commonAllergies = [
    { id: 'pollo', label: 'Pollo' },
    { id: 'ternera', label: 'Ternera' },
    { id: 'lacteos', label: 'Lácteos' },
    { id: 'trigo', label: 'Trigo' },
    { id: 'soja', label: 'Soja' },
    { id: 'maiz', label: 'Maíz' },
    { id: 'pulgas', label: 'Pulgas' },
    { id: 'polen', label: 'Polen' },
    { id: 'acaros', label: 'Ácaros del polvo' },
    { id: 'productos_quimicos', label: 'Productos químicos' }
  ];

  const vaccinationStatus = [
    { value: 'completa', label: 'Vacunación Completa' },
    { value: 'parcial', label: 'Vacunación Parcial' },
    { value: 'vencida', label: 'Vacunación Vencida' },
    { value: 'no_vacunado', label: 'No Vacunado' }
  ];

  const handleInputChange = (field, value) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    onUpdate(updatedData);
  };

  const handleAllergyToggle = (allergyId, checked) => {
    const currentAllergies = localData?.allergies || [];
    const updatedAllergies = checked 
      ? [...currentAllergies, allergyId]
      : currentAllergies?.filter(id => id !== allergyId);
    
    handleInputChange('allergies', updatedAllergies);
  };

  const addMedication = () => {
    const currentMedications = localData?.medications || [];
    const newMedication = {
      id: Date.now(),
      name: '',
      dosage: '',
      frequency: '',
      notes: ''
    };
    handleInputChange('medications', [...currentMedications, newMedication]);
  };

  const updateMedication = (medicationId, field, value) => {
    const currentMedications = localData?.medications || [];
    const updatedMedications = currentMedications?.map(med => 
      med?.id === medicationId ? { ...med, [field]: value } : med
    );
    handleInputChange('medications', updatedMedications);
  };

  const removeMedication = (medicationId) => {
    const currentMedications = localData?.medications || [];
    const updatedMedications = currentMedications?.filter(med => med?.id !== medicationId);
    handleInputChange('medications', updatedMedications);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted transition-smooth"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Heart" size={20} className="text-success" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Información Médica</h3>
            <p className="text-sm text-muted-foreground">
              Alergias, medicamentos, vacunas
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
          {/* Vaccination Status */}
          <div className="mt-6">
            <Select
              label="Estado de vacunación"
              placeholder="Selecciona el estado"
              options={vaccinationStatus}
              value={localData?.vaccinationStatus || ''}
              onChange={(value) => handleInputChange('vaccinationStatus', value)}
              error={errors?.vaccinationStatus}
              className="max-w-md"
            />
          </div>

          {/* Last Vaccination Date */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Última vacunación"
              type="date"
              value={localData?.lastVaccinationDate || ''}
              onChange={(e) => handleInputChange('lastVaccinationDate', e?.target?.value)}
              error={errors?.lastVaccinationDate}
            />
            
            <Input
              label="Próxima vacunación"
              type="date"
              value={localData?.nextVaccinationDate || ''}
              onChange={(e) => handleInputChange('nextVaccinationDate', e?.target?.value)}
              error={errors?.nextVaccinationDate}
            />
          </div>

          {/* Allergies */}
          <div className="mt-8">
            <h4 className="font-medium text-foreground mb-4">Alergias Conocidas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {commonAllergies?.map((allergy) => (
                <Checkbox
                  key={allergy?.id}
                  label={allergy?.label}
                  checked={(localData?.allergies || [])?.includes(allergy?.id)}
                  onChange={(e) => handleAllergyToggle(allergy?.id, e?.target?.checked)}
                />
              ))}
            </div>
            
            <div className="mt-4">
              <Input
                label="Otras alergias"
                type="text"
                placeholder="Especifica otras alergias no listadas..."
                value={localData?.otherAllergies || ''}
                onChange={(e) => handleInputChange('otherAllergies', e?.target?.value)}
                error={errors?.otherAllergies}
              />
            </div>
          </div>

          {/* Current Medications */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-foreground">Medicamentos Actuales</h4>
              <Button
                variant="outline"
                size="sm"
                iconName="Plus"
                iconPosition="left"
                onClick={addMedication}
              >
                Agregar Medicamento
              </Button>
            </div>

            {(localData?.medications || [])?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Pill" size={48} className="mx-auto mb-4 opacity-50" />
                <p>No hay medicamentos registrados</p>
                <p className="text-sm">Haz clic en "Agregar Medicamento" para comenzar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(localData?.medications || [])?.map((medication) => (
                  <div key={medication?.id} className="p-4 border border-border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="Nombre del medicamento"
                        type="text"
                        placeholder="Ej: Apoquel"
                        value={medication?.name}
                        onChange={(e) => updateMedication(medication?.id, 'name', e?.target?.value)}
                      />
                      
                      <Input
                        label="Dosis"
                        type="text"
                        placeholder="Ej: 5mg"
                        value={medication?.dosage}
                        onChange={(e) => updateMedication(medication?.id, 'dosage', e?.target?.value)}
                      />
                      
                      <Input
                        label="Frecuencia"
                        type="text"
                        placeholder="Ej: 2 veces al día"
                        value={medication?.frequency}
                        onChange={(e) => updateMedication(medication?.id, 'frequency', e?.target?.value)}
                      />
                    </div>
                    
                    <div className="mt-4 flex items-end space-x-4">
                      <div className="flex-1">
                        <Input
                          label="Notas adicionales"
                          type="text"
                          placeholder="Instrucciones especiales, efectos secundarios..."
                          value={medication?.notes}
                          onChange={(e) => updateMedication(medication?.id, 'notes', e?.target?.value)}
                        />
                      </div>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        iconName="Trash2"
                        onClick={() => removeMedication(medication?.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Medical Conditions */}
          <div className="mt-8">
            <Input
              label="Condiciones médicas"
              type="text"
              placeholder="Ej: Displasia de cadera, epilepsia, diabetes..."
              value={localData?.medicalConditions || ''}
              onChange={(e) => handleInputChange('medicalConditions', e?.target?.value)}
              error={errors?.medicalConditions}
              description="Enumera condiciones médicas crónicas o importantes"
            />
          </div>

          {/* Veterinary Contact */}
          <div className="mt-8">
            <h4 className="font-medium text-foreground mb-4">Contacto Veterinario</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre de la clínica"
                type="text"
                placeholder="Ej: Clínica Veterinaria San Martín"
                value={localData?.vetClinicName || ''}
                onChange={(e) => handleInputChange('vetClinicName', e?.target?.value)}
                error={errors?.vetClinicName}
              />
              
              <Input
                label="Teléfono de emergencia"
                type="tel"
                placeholder="Ej: +34 912 345 678"
                value={localData?.vetEmergencyPhone || ''}
                onChange={(e) => handleInputChange('vetEmergencyPhone', e?.target?.value)}
                error={errors?.vetEmergencyPhone}
              />
            </div>
            
            <div className="mt-4">
              <Input
                label="Dirección de la clínica"
                type="text"
                placeholder="Calle, número, ciudad..."
                value={localData?.vetAddress || ''}
                onChange={(e) => handleInputChange('vetAddress', e?.target?.value)}
                error={errors?.vetAddress}
              />
            </div>
          </div>

          {/* Emergency Medical Notes */}
          <div className="mt-8 p-4 bg-error/5 border border-error/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-error mt-0.5" />
              <div className="flex-1">
                <h5 className="font-medium text-foreground mb-2">Información de Emergencia</h5>
                <Input
                  type="text"
                  placeholder="Información crítica para emergencias médicas..."
                  value={localData?.emergencyMedicalNotes || ''}
                  onChange={(e) => handleInputChange('emergencyMedicalNotes', e?.target?.value)}
                  error={errors?.emergencyMedicalNotes}
                  description="Esta información aparecerá destacada en el perfil NFC"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Shield" size={16} />
              <span>Información médica confidencial y segura</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalInfoSection;