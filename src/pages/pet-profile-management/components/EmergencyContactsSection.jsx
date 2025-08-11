import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const EmergencyContactsSection = ({ 
  petData, 
  onUpdate, 
  isExpanded, 
  onToggle,
  errors = {} 
}) => {
  const [localData, setLocalData] = useState(petData);

  const contactTypes = [
    { value: 'propietario', label: 'Propietario Principal' },
    { value: 'familiar', label: 'Familiar' },
    { value: 'cuidador', label: 'Cuidador' },
    { value: 'vecino', label: 'Vecino' },
    { value: 'amigo', label: 'Amigo' },
    { value: 'veterinario', label: 'Veterinario' },
    { value: 'emergencia', label: 'Contacto de Emergencia' }
  ];

  const handleInputChange = (field, value) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    onUpdate(updatedData);
  };

  const addContact = () => {
    const currentContacts = localData?.emergencyContacts || [];
    const newContact = {
      id: Date.now(),
      name: '',
      phone: '',
      email: '',
      relationship: '',
      isPrimary: currentContacts?.length === 0,
      notes: ''
    };
    handleInputChange('emergencyContacts', [...currentContacts, newContact]);
  };

  const updateContact = (contactId, field, value) => {
    const currentContacts = localData?.emergencyContacts || [];
    const updatedContacts = currentContacts?.map(contact => {
      if (contact?.id === contactId) {
        // If setting as primary, unset others
        if (field === 'isPrimary' && value) {
          return { ...contact, [field]: value };
        }
        return { ...contact, [field]: value };
      } else if (field === 'isPrimary' && value) {
        // Unset primary from other contacts
        return { ...contact, isPrimary: false };
      }
      return contact;
    });
    handleInputChange('emergencyContacts', updatedContacts);
  };

  const removeContact = (contactId) => {
    const currentContacts = localData?.emergencyContacts || [];
    const updatedContacts = currentContacts?.filter(contact => contact?.id !== contactId);
    
    // If we removed the primary contact, make the first remaining contact primary
    if (updatedContacts?.length > 0 && !updatedContacts?.some(c => c?.isPrimary)) {
      updatedContacts[0].isPrimary = true;
    }
    
    handleInputChange('emergencyContacts', updatedContacts);
  };

  const formatPhoneNumber = (phone) => {
    // Simple phone formatting for Spanish numbers
    const cleaned = phone?.replace(/\D/g, '');
    if (cleaned?.length === 9) {
      return cleaned?.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    return phone;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted transition-smooth"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
            <Icon name="Phone" size={20} className="text-error" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Contactos de Emergencia</h3>
            <p className="text-sm text-muted-foreground">
              {(localData?.emergencyContacts || [])?.length} contacto{(localData?.emergencyContacts || [])?.length !== 1 ? 's' : ''} registrado{(localData?.emergencyContacts || [])?.length !== 1 ? 's' : ''}
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
          <div className="flex items-center justify-between mt-6 mb-4">
            <div>
              <h4 className="font-medium text-foreground">Lista de Contactos</h4>
              <p className="text-sm text-muted-foreground">
                Personas que pueden ser contactadas si encuentran a tu mascota
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              iconPosition="left"
              onClick={addContact}
            >
              Agregar Contacto
            </Button>
          </div>

          {(localData?.emergencyContacts || [])?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Users" size={48} className="mx-auto mb-4 opacity-50" />
              <h5 className="font-medium mb-2">No hay contactos registrados</h5>
              <p className="text-sm mb-4">
                Agrega al menos un contacto para que puedan comunicarse contigo si encuentran a tu mascota
              </p>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={addContact}
              >
                Agregar Primer Contacto
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {(localData?.emergencyContacts || [])?.map((contact, index) => (
                <div 
                  key={contact?.id} 
                  className={`p-6 border rounded-lg ${
                    contact?.isPrimary 
                      ? 'border-primary bg-primary/5' :'border-border bg-card'
                  }`}
                >
                  {/* Primary Contact Badge */}
                  {contact?.isPrimary && (
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium flex items-center space-x-1">
                        <Icon name="Star" size={12} />
                        <span>Contacto Principal</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Este contacto aparecerá primero en el perfil NFC
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nombre completo *"
                      type="text"
                      placeholder="Ej: María García López"
                      value={contact?.name}
                      onChange={(e) => updateContact(contact?.id, 'name', e?.target?.value)}
                      required
                    />

                    <Select
                      label="Relación *"
                      placeholder="Selecciona la relación"
                      options={contactTypes}
                      value={contact?.relationship}
                      onChange={(value) => updateContact(contact?.id, 'relationship', value)}
                      required
                    />

                    <Input
                      label="Teléfono *"
                      type="tel"
                      placeholder="Ej: 612 345 678"
                      value={contact?.phone}
                      onChange={(e) => updateContact(contact?.id, 'phone', formatPhoneNumber(e?.target?.value))}
                      required
                      description="Número principal para WhatsApp"
                    />

                    <Input
                      label="Email"
                      type="email"
                      placeholder="Ej: maria@email.com"
                      value={contact?.email}
                      onChange={(e) => updateContact(contact?.id, 'email', e?.target?.value)}
                    />
                  </div>

                  <div className="mt-4">
                    <Input
                      label="Notas adicionales"
                      type="text"
                      placeholder="Horarios disponibles, instrucciones especiales..."
                      value={contact?.notes}
                      onChange={(e) => updateContact(contact?.id, 'notes', e?.target?.value)}
                    />
                  </div>

                  {/* Contact Actions */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <div className="flex items-center space-x-4">
                      {!contact?.isPrimary && (
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="Star"
                          iconPosition="left"
                          onClick={() => updateContact(contact?.id, 'isPrimary', true)}
                        >
                          Hacer Principal
                        </Button>
                      )}
                      
                      {contact?.phone && (
                        <a
                          href={`https://wa.me/${contact?.phone?.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-success hover:underline flex items-center space-x-1"
                        >
                          <Icon name="MessageCircle" size={16} />
                          <span>Probar WhatsApp</span>
                        </a>
                      )}
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => removeContact(contact?.id)}
                      disabled={(localData?.emergencyContacts || [])?.length === 1}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <div>
                <h5 className="font-medium text-foreground mb-2">Información Importante</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• El contacto principal aparecerá destacado en el perfil NFC</li>
                  <li>• Los números de teléfono se usarán para notificaciones WhatsApp</li>
                  <li>• Asegúrate de que los números estén activos y disponibles</li>
                  <li>• Puedes agregar hasta 5 contactos de emergencia</li>
                </ul>
              </div>
            </div>
          </div>

          {/* WhatsApp Integration Status */}
          <div className="mt-6 p-4 bg-success/5 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="MessageCircle" size={20} className="text-success" />
              <div>
                <h5 className="font-medium text-foreground">Integración WhatsApp Activa</h5>
                <p className="text-sm text-muted-foreground">
                  Cuando alguien escanee el NFC de tu mascota, recibirás una notificación automática con la ubicación
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyContactsSection;