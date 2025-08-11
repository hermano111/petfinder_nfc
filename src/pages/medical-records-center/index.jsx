import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { petService } from '../../services/petService';
import { medicalService } from '../../services/medicalService';

const MedicalRecordsCenter = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    record_type: '',
    description: '',
    veterinarian_name: '',
    clinic_name: '',
    date_performed: '',
    next_due_date: '',
    notes: ''
  });

  const recordTypes = [
    { value: 'vaccination', label: 'Vacunación' },
    { value: 'deworming', label: 'Desparasitación' },
    { value: 'checkup', label: 'Chequeo General' },
    { value: 'surgery', label: 'Cirugía' },
    { value: 'medication', label: 'Medicación' },
    { value: 'allergy', label: 'Alergia' },
    { value: 'injury', label: 'Lesión' },
    { value: 'other', label: 'Otro' }
  ];

  useEffect(() => {
    if (user?.id) {
      loadUserPets();
    }
  }, [user?.id]);

  const loadUserPets = async () => {
    try {
      setLoading(true);
      const data = await petService?.getUserPets(user?.id);
      setPets(data || []);
      if (data?.length > 0) {
        setSelectedPet(data?.[0]);
        loadMedicalRecords(data?.[0]?.id);
      }
    } catch (error) {
      setError(error?.message || 'Error al cargar mascotas');
    } finally {
      setLoading(false);
    }
  };

  const loadMedicalRecords = async (petId) => {
    try {
      setLoading(true);
      const data = await medicalService?.getPetMedicalRecords(petId);
      setMedicalRecords(data || []);
    } catch (error) {
      setError(error?.message || 'Error al cargar registros médicos');
    } finally {
      setLoading(false);
    }
  };

  const handlePetSelect = (petId) => {
    const pet = pets?.find(p => p?.id === petId);
    setSelectedPet(pet);
    if (pet) {
      loadMedicalRecords(pet?.id);
    }
  };

  const handleAddRecord = async () => {
    if (!selectedPet?.id || !newRecord?.record_type || !newRecord?.description) {
      setError('Por favor completa los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      await medicalService?.addMedicalRecord(selectedPet?.id, newRecord);
      
      // Reset form
      setNewRecord({
        record_type: '',
        description: '',
        veterinarian_name: '',
        clinic_name: '',
        date_performed: '',
        next_due_date: '',
        notes: ''
      });
      setShowAddForm(false);
      
      // Reload records
      await loadMedicalRecords(selectedPet?.id);
      setError('');
    } catch (error) {
      setError(error?.message || 'Error al guardar registro médico');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString)?.toLocaleDateString('es-ES');
  };

  const getRecordTypeLabel = (type) => {
    return recordTypes?.find(rt => rt?.value === type)?.label || type;
  };

  const getUpcomingRecords = () => {
    const today = new Date();
    const upcoming = medicalRecords?.filter(record => 
      record?.next_due_date && new Date(record?.next_due_date) > today
    )?.sort((a, b) => new Date(a?.next_due_date) - new Date(b?.next_due_date));
    
    return upcoming?.slice(0, 3) || [];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Centro Médico"
        showBackButton={true}
        onBack={() => navigate('/pet-owner-dashboard')}
      />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <Icon name="AlertCircle" size={16} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Pet Selection */}
        {pets?.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon name="Heart" size={20} className="text-primary" />
              Seleccionar Mascota
            </h2>
            
            <Select
              value={selectedPet?.id || ''}
              onChange={(e) => handlePetSelect(e?.target?.value)}
              className="mb-4"
            >
              <option value="">Seleccionar mascota...</option>
              {pets?.map((pet) => (
                <option key={pet?.id} value={pet?.id}>
                  {pet?.name} ({pet?.pet_type})
                </option>
              ))}
            </Select>
          </div>
        )}

        {selectedPet && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="FileText" size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{medicalRecords?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Registros Totales</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Calendar" size={20} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{getUpcomingRecords()?.length}</p>
                    <p className="text-sm text-muted-foreground">Próximas Citas</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name="Activity" size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {medicalRecords?.filter(r => new Date(r?.date_performed) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))?.length || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Último Mes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Record Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Icon name="FileText" size={20} className="text-secondary" />
                Historial Médico - {selectedPet?.name}
              </h2>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                iconName="Plus"
                iconPosition="left"
              >
                Agregar Registro
              </Button>
            </div>

            {/* Add Record Form */}
            {showAddForm && (
              <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Nuevo Registro Médico</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tipo de Registro *</label>
                    <Select
                      value={newRecord?.record_type}
                      onChange={(e) => setNewRecord({...newRecord, record_type: e?.target?.value})}
                    >
                      <option value="">Seleccionar tipo...</option>
                      {recordTypes?.map((type) => (
                        <option key={type?.value} value={type?.value}>
                          {type?.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Fecha Realizada</label>
                    <Input
                      type="date"
                      value={newRecord?.date_performed}
                      onChange={(e) => setNewRecord({...newRecord, date_performed: e?.target?.value})}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Descripción *</label>
                    <Input
                      value={newRecord?.description}
                      onChange={(e) => setNewRecord({...newRecord, description: e?.target?.value})}
                      placeholder="Describe el procedimiento o diagnóstico..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Veterinario</label>
                    <Input
                      value={newRecord?.veterinarian_name}
                      onChange={(e) => setNewRecord({...newRecord, veterinarian_name: e?.target?.value})}
                      placeholder="Nombre del veterinario..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Clínica</label>
                    <Input
                      value={newRecord?.clinic_name}
                      onChange={(e) => setNewRecord({...newRecord, clinic_name: e?.target?.value})}
                      placeholder="Nombre de la clínica..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Próxima Fecha</label>
                    <Input
                      type="date"
                      value={newRecord?.next_due_date}
                      onChange={(e) => setNewRecord({...newRecord, next_due_date: e?.target?.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Notas</label>
                    <Input
                      value={newRecord?.notes}
                      onChange={(e) => setNewRecord({...newRecord, notes: e?.target?.value})}
                      placeholder="Notas adicionales..."
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={handleAddRecord}
                    disabled={loading}
                    iconName="Save"
                    iconPosition="left"
                  >
                    Guardar Registro
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* Medical Records List */}
            <div className="bg-card border border-border rounded-lg p-6">
              {loading && medicalRecords?.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : medicalRecords?.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No hay registros médicos para {selectedPet?.name}</p>
                  <Button onClick={() => setShowAddForm(true)}>
                    Agregar Primer Registro
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {medicalRecords?.map((record) => (
                    <div key={record?.id} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="font-medium text-foreground">
                            {getRecordTypeLabel(record?.record_type)}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(record?.date_performed)}
                        </span>
                      </div>
                      
                      <p className="text-foreground mb-2">{record?.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        {record?.veterinarian_name && (
                          <div>
                            <strong>Veterinario:</strong> {record?.veterinarian_name}
                          </div>
                        )}
                        {record?.clinic_name && (
                          <div>
                            <strong>Clínica:</strong> {record?.clinic_name}
                          </div>
                        )}
                        {record?.next_due_date && (
                          <div>
                            <strong>Próxima cita:</strong> {formatDate(record?.next_due_date)}
                          </div>
                        )}
                        {record?.notes && (
                          <div className="md:col-span-2">
                            <strong>Notas:</strong> {record?.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {pets?.length === 0 && !loading && (
          <div className="text-center py-12">
            <Icon name="Heart" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No tienes mascotas registradas</p>
            <Button onClick={() => navigate('/pet-profile-management?action=add')}>
              Registrar Primera Mascota
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordsCenter;