import React from 'react';
import Icon from '../../../components/AppIcon';

const MedicalAlertsSection = ({ medicalInfo = {} }) => {
  const {
    allergies = [],
    medications = [],
    conditions = [],
    emergencyVet = null,
    bloodType = null,
    microchipId = null,
    lastVetVisit = null
  } = medicalInfo;

  const hasAnyMedicalInfo = allergies?.length > 0 || medications?.length > 0 || 
                           conditions?.length > 0 || emergencyVet || bloodType || microchipId;

  if (!hasAnyMedicalInfo) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
          <Icon name="AlertTriangle" size={24} className="text-error" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Información Médica Importante</h2>
          <p className="text-sm text-muted-foreground">Información crítica para cuidadores y veterinarios</p>
        </div>
      </div>
      <div className="space-y-4">
        {/* Allergies */}
        {allergies?.length > 0 && (
          <div className="bg-error/5 border border-error/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-error mb-2">Alergias</h3>
                <div className="space-y-1">
                  {allergies?.map((allergy, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-error rounded-full"></div>
                      <span className="text-sm font-medium text-error">{allergy}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Medications */}
        {medications?.length > 0 && (
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Pill" size={20} className="text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-warning mb-2">Medicamentos Actuales</h3>
                <div className="space-y-2">
                  {medications?.map((medication, index) => (
                    <div key={index} className="bg-warning/10 rounded-md p-3">
                      <p className="font-medium text-warning">{medication?.name}</p>
                      <p className="text-sm text-warning/80">{medication?.dosage}</p>
                      {medication?.frequency && (
                        <p className="text-xs text-warning/70">Frecuencia: {medication?.frequency}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medical Conditions */}
        {conditions?.length > 0 && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Heart" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-destructive mb-2">Condiciones Médicas</h3>
                <div className="space-y-1">
                  {conditions?.map((condition, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-destructive rounded-full"></div>
                      <span className="text-sm font-medium text-destructive">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Medical Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bloodType && (
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <Icon name="Droplets" size={20} className="text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Sangre</p>
                <p className="font-medium text-foreground">{bloodType}</p>
              </div>
            </div>
          )}

          {microchipId && (
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <Icon name="Zap" size={20} className="text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Microchip</p>
                <p className="font-medium text-foreground font-mono">{microchipId}</p>
              </div>
            </div>
          )}

          {lastVetVisit && (
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg sm:col-span-2">
              <Icon name="Calendar" size={20} className="text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Última Visita Veterinaria</p>
                <p className="font-medium text-foreground">
                  {new Date(lastVetVisit)?.toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Vet Contact */}
        {emergencyVet && (
          <div className="bg-success/5 border border-success/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Phone" size={20} className="text-success flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-success mb-2">Veterinario de Emergencia</h3>
                <div className="space-y-1">
                  <p className="font-medium text-success">{emergencyVet?.name}</p>
                  <p className="text-sm text-success/80">{emergencyVet?.address}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <a
                      href={`tel:${emergencyVet?.phone}`}
                      className="inline-flex items-center space-x-2 text-sm font-medium text-success hover:text-success/80 transition-smooth"
                    >
                      <Icon name="Phone" size={16} />
                      <span>{emergencyVet?.phone}</span>
                    </a>
                    {emergencyVet?.hours && (
                      <span className="text-xs text-success/70">
                        Horario: {emergencyVet?.hours}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Important Notice */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-primary">
            <p className="font-medium mb-1">Importante para Cuidadores Temporales</p>
            <p className="text-primary/80">
              Si encuentras a esta mascota, por favor mantén esta información médica a mano 
              y compártela con cualquier veterinario que pueda necesitar atenderla.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalAlertsSection;