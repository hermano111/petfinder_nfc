import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { petService } from '../../services/petService';
import { supabase } from '../../lib/supabase';

const ReportLostPet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reportData, setReportData] = useState({
    pet_id: '',
    last_seen_location: '',
    last_seen_date: '',
    description: '',
    contact_info: '',
    reward_offered: '',
    special_instructions: ''
  });

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
    } catch (error) {
      setError(error?.message || 'Error al cargar mascotas');
    } finally {
      setLoading(false);
    }
  };

  const handlePetSelect = (petId) => {
    const pet = pets?.find(p => p?.id === petId);
    setSelectedPet(pet);
    setReportData({
      ...reportData,
      pet_id: petId,
      reward_offered: pet?.reward_amount?.toString() || ''
    });
  };

  const handleSubmitReport = async () => {
    if (!reportData?.pet_id || !reportData?.last_seen_location || !reportData?.last_seen_date) {
      setError('Por favor completa los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Update pet status to lost and store report data
      const { error: updateError } = await supabase
        ?.from('pets')
        ?.update({
          is_lost: true,
          last_seen_location: reportData?.last_seen_location,
          last_seen_date: reportData?.last_seen_date,
          lost_report_description: reportData?.description,
          special_instructions: reportData?.special_instructions,
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', reportData?.pet_id);

      if (updateError) throw updateError;

      setSuccess('Reporte enviado exitosamente. Tu mascota ha sido marcada como perdida.');
      
      // Reset form
      setReportData({
        pet_id: '',
        last_seen_location: '',
        last_seen_date: '',
        description: '',
        contact_info: '',
        reward_offered: '',
        special_instructions: ''
      });
      setSelectedPet(null);
      
      // Reload pets
      await loadUserPets();

    } catch (error) {
      setError(error?.message || 'Error al enviar reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsFound = async (petId) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        ?.from('pets')
        ?.update({
          is_lost: false,
          last_seen_location: null,
          last_seen_date: null,
          lost_report_description: null,
          special_instructions: null,
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', petId);

      if (error) throw error;

      setSuccess('¡Excelente! Tu mascota ha sido marcada como encontrada.');
      await loadUserPets();
    } catch (error) {
      setError(error?.message || 'Error al actualizar estado');
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const lostPets = pets?.filter(pet => pet?.is_lost) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Reportar Mascota Perdida"
        showBackButton={true}
        onBack={() => navigate('/pet-owner-dashboard')}
      />
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="AlertTriangle" size={16} />
                <span>{error}</span>
              </div>
              <button onClick={clearMessages} className="text-destructive hover:text-destructive/80">
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="CheckCircle" size={16} />
                <span>{success}</span>
              </div>
              <button onClick={clearMessages} className="text-green-700 hover:text-green-600">
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Currently Lost Pets */}
        {lostPets?.length > 0 && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-destructive">
              <Icon name="AlertTriangle" size={20} />
              Mascotas Perdidas Actualmente
            </h2>
            
            <div className="space-y-4">
              {lostPets?.map((pet) => (
                <div key={pet?.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-foreground">{pet?.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {pet?.pet_type} • {pet?.breed}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleMarkAsFound(pet?.id)}
                      disabled={loading}
                      iconName="CheckCircle"
                      iconPosition="left"
                    >
                      Marcar como Encontrada
                    </Button>
                  </div>
                  
                  {pet?.last_seen_location && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Última ubicación:</strong> {pet?.last_seen_location}
                    </p>
                  )}
                  
                  {pet?.last_seen_date && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Última vez vista:</strong> {new Date(pet?.last_seen_date)?.toLocaleDateString('es-ES')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report Form */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon name="AlertTriangle" size={20} className="text-destructive" />
            Reportar Nueva Mascota Perdida
          </h2>
          
          <div className="space-y-4">
            {/* Pet Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Mascota Perdida *</label>
              <Select
                value={reportData?.pet_id}
                onChange={(e) => handlePetSelect(e?.target?.value)}
              >
                <option value="">Seleccionar mascota...</option>
                {pets?.filter(pet => !pet?.is_lost)?.map((pet) => (
                  <option key={pet?.id} value={pet?.id}>
                    {pet?.name} ({pet?.pet_type})
                  </option>
                ))}
              </Select>
            </div>

            {selectedPet && (
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-2">Mascota Seleccionada:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Nombre:</strong> {selectedPet?.name}
                  </div>
                  <div>
                    <strong>Tipo:</strong> {selectedPet?.pet_type}
                  </div>
                  <div>
                    <strong>Raza:</strong> {selectedPet?.breed}
                  </div>
                  <div>
                    <strong>Color:</strong> {selectedPet?.color}
                  </div>
                </div>
              </div>
            )}
            
            {/* Location and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Última Ubicación Vista *</label>
                <Input
                  value={reportData?.last_seen_location}
                  onChange={(e) => setReportData({...reportData, last_seen_location: e?.target?.value})}
                  placeholder="Dirección o lugar específico..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Fecha de Pérdida *</label>
                <Input
                  type="date"
                  value={reportData?.last_seen_date}
                  onChange={(e) => setReportData({...reportData, last_seen_date: e?.target?.value})}
                />
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Descripción del Evento</label>
              <Input
                value={reportData?.description}
                onChange={(e) => setReportData({...reportData, description: e?.target?.value})}
                placeholder="¿Cómo y cuándo se perdió? Detalles importantes..."
              />
            </div>
            
            {/* Reward */}
            <div>
              <label className="block text-sm font-medium mb-2">Recompensa Ofrecida</label>
              <Input
                value={reportData?.reward_offered}
                onChange={(e) => setReportData({...reportData, reward_offered: e?.target?.value})}
                placeholder="Cantidad de recompensa (opcional)..."
              />
            </div>
            
            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-medium mb-2">Instrucciones Especiales</label>
              <Input
                value={reportData?.special_instructions}
                onChange={(e) => setReportData({...reportData, special_instructions: e?.target?.value})}
                placeholder="¿Cómo debe actuar la persona que la encuentre?"
              />
            </div>
          </div>
          
          {/* Warning Box */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 my-6">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800 mb-2">Información Importante:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Una vez reportada, la placa NFC mostrará un estado de "MASCOTA PERDIDA"</li>
                  <li>• Cualquier persona que escanee la placa verá tu información de contacto</li>
                  <li>• Recibirás notificaciones de todos los escaneos mientras esté perdida</li>
                  <li>• Podrás actualizar el estado cuando la encuentres</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={handleSubmitReport}
              disabled={loading || !reportData?.pet_id}
              iconName="AlertTriangle"
              iconPosition="left"
              className="flex-1"
            >
              {loading ? 'Enviando...' : 'Reportar como Perdida'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/pet-owner-dashboard')}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>

        {/* No Pets Available */}
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

export default ReportLostPet;