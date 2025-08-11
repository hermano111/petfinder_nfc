import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AlertSettings = ({ settings, onSettingsChange, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const notificationMethods = [
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'email', label: 'Correo electrónico' },
    { value: 'sms', label: 'SMS' },
    { value: 'push', label: 'Notificación push' }
  ];

  const frequencyOptions = [
    { value: 'immediate', label: 'Inmediato' },
    { value: 'hourly', label: 'Cada hora' },
    { value: 'daily', label: 'Diario' },
    { value: 'weekly', label: 'Semanal' }
  ];

  const handleSettingChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const handleNotificationMethodChange = (method, checked) => {
    const currentMethods = settings?.notificationMethods || [];
    const updatedMethods = checked
      ? [...currentMethods, method]
      : currentMethods?.filter(m => m !== method);
    
    handleSettingChange('notificationMethods', updatedMethods);
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Bell" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Configuración de Alertas</h3>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>
      {/* Quick Settings - Always Visible */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Smartphone" size={18} className="text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Alertas de escaneo</p>
              <p className="text-sm text-muted-foreground">Recibir notificación cuando alguien escanee la placa NFC</p>
            </div>
          </div>
          <Checkbox
            checked={settings?.scanAlerts || false}
            onChange={(e) => handleSettingChange('scanAlerts', e?.target?.checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="MapPin" size={18} className="text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Ubicaciones inusuales</p>
              <p className="text-sm text-muted-foreground">Alertar cuando se detecte actividad en ubicaciones nuevas</p>
            </div>
          </div>
          <Checkbox
            checked={settings?.unusualLocationAlerts || false}
            onChange={(e) => handleSettingChange('unusualLocationAlerts', e?.target?.checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Clock" size={18} className="text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Períodos sin actividad</p>
              <p className="text-sm text-muted-foreground">Notificar si no hay escaneos durante un tiempo prolongado</p>
            </div>
          </div>
          <Checkbox
            checked={settings?.inactivityAlerts || false}
            onChange={(e) => handleSettingChange('inactivityAlerts', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Advanced Settings - Expandable */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="pt-4 space-y-6">
            <h4 className="text-sm font-medium text-foreground mb-3">Configuración avanzada</h4>
            
            {/* Notification Methods */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Métodos de notificación
              </label>
              <div className="grid grid-cols-2 gap-3">
                {notificationMethods?.map((method) => (
                  <div key={method?.value} className="flex items-center space-x-2">
                    <Checkbox
                      checked={(settings?.notificationMethods || [])?.includes(method?.value)}
                      onChange={(e) => handleNotificationMethodChange(method?.value, e?.target?.checked)}
                    />
                    <span className="text-sm text-foreground">{method?.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Frequency Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Frecuencia de alertas"
                options={frequencyOptions}
                value={settings?.alertFrequency || 'immediate'}
                onChange={(value) => handleSettingChange('alertFrequency', value)}
              />
              
              <Input
                label="Período de inactividad (horas)"
                type="number"
                min="1"
                max="168"
                value={settings?.inactivityPeriod || 24}
                onChange={(e) => handleSettingChange('inactivityPeriod', parseInt(e?.target?.value))}
                description="Alertar si no hay escaneos durante este tiempo"
              />
            </div>

            {/* Location Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Radio de ubicaciones conocidas (km)"
                type="number"
                min="0.1"
                max="50"
                step="0.1"
                value={settings?.knownLocationRadius || 2}
                onChange={(e) => handleSettingChange('knownLocationRadius', parseFloat(e?.target?.value))}
                description="Considerar ubicaciones dentro de este radio como conocidas"
              />
              
              <Input
                label="Número máximo de alertas por día"
                type="number"
                min="1"
                max="100"
                value={settings?.maxAlertsPerDay || 10}
                onChange={(e) => handleSettingChange('maxAlertsPerDay', parseInt(e?.target?.value))}
                description="Limitar el número de notificaciones diarias"
              />
            </div>

            {/* Time Restrictions */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Horario de notificaciones
              </label>
              <div className="flex items-center space-x-4 mb-3">
                <Checkbox
                  checked={settings?.quietHours || false}
                  onChange={(e) => handleSettingChange('quietHours', e?.target?.checked)}
                  label="Activar horario silencioso"
                />
              </div>
              
              {settings?.quietHours && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <Input
                    label="Desde"
                    type="time"
                    value={settings?.quietHoursStart || '22:00'}
                    onChange={(e) => handleSettingChange('quietHoursStart', e?.target?.value)}
                  />
                  <Input
                    label="Hasta"
                    type="time"
                    value={settings?.quietHoursEnd || '08:00'}
                    onChange={(e) => handleSettingChange('quietHoursEnd', e?.target?.value)}
                  />
                </div>
              )}
            </div>

            {/* Emergency Settings */}
            <div className="bg-error/5 border border-error/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={20} className="text-error mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-medium text-foreground mb-2">Alertas de emergencia</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Las alertas de emergencia siempre se envían inmediatamente, independientemente de otras configuraciones.
                  </p>
                  
                  <div className="space-y-2">
                    <Checkbox
                      checked={settings?.emergencyBypass || true}
                      onChange={(e) => handleSettingChange('emergencyBypass', e?.target?.checked)}
                      label="Omitir horario silencioso para emergencias"
                    />
                    <Checkbox
                      checked={settings?.emergencyMultipleContacts || false}
                      onChange={(e) => handleSettingChange('emergencyMultipleContacts', e?.target?.checked)}
                      label="Notificar a todos los contactos de emergencia"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-border">
              <Button
                variant="default"
                iconName="Save"
                iconPosition="left"
                onClick={() => {
                  // Save settings logic would go here
                  console.log('Saving alert settings:', settings);
                }}
              >
                Guardar configuración
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertSettings;