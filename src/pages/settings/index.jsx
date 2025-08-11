import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import Input from '../../components/ui/Input';

import { Checkbox } from '../../components/ui/Checkbox';
import { supabase } from '../../lib/supabase';

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState({
    full_name: '',
    phone_number: '',
    whatsapp_number: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    sms_notifications: false,
    scan_alerts: true,
    medical_reminders: true
  });

  useEffect(() => {
    if (user?.id) {
      loadUserProfile();
    }
  }, [user?.id]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.select('*')
        ?.eq('id', user?.id)
        ?.single();

      if (error && error?.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          full_name: data?.full_name || '',
          phone_number: data?.phone_number || '',
          whatsapp_number: data?.whatsapp_number || '',
          address: data?.address || '',
          emergency_contact_name: data?.emergency_contact_name || '',
          emergency_contact_phone: data?.emergency_contact_phone || ''
        });
      }
    } catch (error) {
      setError(error?.message || 'Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.upsert({
          id: user?.id,
          ...profile,
          updated_at: new Date()?.toISOString()
        })
        ?.select()
        ?.single();

      if (error) throw error;

      setSuccess('Perfil actualizado correctamente');
    } catch (error) {
      setError(error?.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (window?.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      try {
        await signOut();
        navigate('/owner-login-registration');
      } catch (error) {
        setError(error?.message || 'Error al cerrar sesión');
      }
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Configuración"
        showBackButton={true}
        onBack={() => navigate('/pet-owner-dashboard')}
      />
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
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

        <div className="space-y-6">
          {/* User Profile Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon name="User" size={20} className="text-primary" />
              Perfil de Usuario
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre Completo</label>
                <Input
                  value={profile?.full_name}
                  onChange={(e) => setProfile({...profile, full_name: e?.target?.value})}
                  placeholder="Tu nombre completo..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Teléfono</label>
                  <Input
                    value={profile?.phone_number}
                    onChange={(e) => setProfile({...profile, phone_number: e?.target?.value})}
                    placeholder="Número de teléfono..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">WhatsApp</label>
                  <Input
                    value={profile?.whatsapp_number}
                    onChange={(e) => setProfile({...profile, whatsapp_number: e?.target?.value})}
                    placeholder="Número de WhatsApp..."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Dirección</label>
                <Input
                  value={profile?.address}
                  onChange={(e) => setProfile({...profile, address: e?.target?.value})}
                  placeholder="Tu dirección completa..."
                />
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3 text-foreground">Contacto de Emergencia</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre</label>
                    <Input
                      value={profile?.emergency_contact_name}
                      onChange={(e) => setProfile({...profile, emergency_contact_name: e?.target?.value})}
                      placeholder="Nombre del contacto..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Teléfono</label>
                    <Input
                      value={profile?.emergency_contact_phone}
                      onChange={(e) => setProfile({...profile, emergency_contact_phone: e?.target?.value})}
                      placeholder="Teléfono del contacto..."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button
                onClick={handleUpdateProfile}
                disabled={loading}
                iconName="Save"
                iconPosition="left"
              >
                Guardar Cambios
              </Button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon name="Bell" size={20} className="text-secondary" />
              Notificaciones
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-foreground">Notificaciones por Email</label>
                  <p className="text-sm text-muted-foreground">Recibir actualizaciones importantes por correo</p>
                </div>
                <Checkbox
                  checked={notifications?.email_notifications}
                  onChange={(e) => setNotifications({...notifications, email_notifications: e?.target?.checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-foreground">Alertas de Escaneo</label>
                  <p className="text-sm text-muted-foreground">Notificar cuando alguien escanee la placa de tu mascota</p>
                </div>
                <Checkbox
                  checked={notifications?.scan_alerts}
                  onChange={(e) => setNotifications({...notifications, scan_alerts: e?.target?.checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-foreground">Recordatorios Médicos</label>
                  <p className="text-sm text-muted-foreground">Recordatorios para citas veterinarias y vacunas</p>
                </div>
                <Checkbox
                  checked={notifications?.medical_reminders}
                  onChange={(e) => setNotifications({...notifications, medical_reminders: e?.target?.checked})}
                />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon name="Shield" size={20} className="text-accent" />
              Seguridad
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Email: {user?.email}</p>
                  <p className="text-sm text-muted-foreground">Verificado</p>
                </div>
                <Icon name="CheckCircle" size={20} className="text-green-500" />
              </div>
              
              <Button
                variant="outline"
                iconName="Key"
                iconPosition="left"
                fullWidth
              >
                Cambiar Contraseña
              </Button>
            </div>
          </div>

          {/* App Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon name="Info" size={20} className="text-muted-foreground" />
              Información de la App
            </h2>
            
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Versión:</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Última actualización:</span>
                <span>11 Agosto 2025</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 mt-6">
              <Button variant="outline" fullWidth>
                Términos y Condiciones
              </Button>
              <Button variant="outline" fullWidth>
                Política de Privacidad
              </Button>
              <Button variant="outline" fullWidth>
                Soporte Técnico
              </Button>
            </div>
          </div>

          {/* Sign Out */}
          <div className="bg-card border border-border rounded-lg p-6">
            <Button
              variant="destructive"
              onClick={handleSignOut}
              iconName="LogOut"
              iconPosition="left"
              fullWidth
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;