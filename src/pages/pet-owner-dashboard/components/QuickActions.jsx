import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Añadir Mascota',
      description: 'Registra una nueva mascota',
      icon: 'Plus',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      action: () => navigate('/pet-profile-management?action=add')
    },
    {
      title: 'Escanear Placa',
      description: 'Prueba tu placa NFC',
      icon: 'Scan',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      action: () => navigate('/nfc-test-scan')
    },
    {
      title: 'Historial Médico',
      description: 'Ver registros médicos',
      icon: 'FileText',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      action: () => navigate('/medical-records-center')
    },
    {
      title: 'Configuración',
      description: 'Ajustar preferencias',
      icon: 'Settings',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/10',
      action: () => navigate('/settings')
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <h3 className="text-lg font-semibold text-foreground mb-4">Acciones Rápidas</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickActions?.map((action, index) => (
          <button
            key={index}
            onClick={action?.action}
            className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-smooth text-left"
          >
            <div className={`p-2 rounded-lg ${action?.bgColor}`}>
              <Icon name={action?.icon} size={20} className={action?.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{action?.title}</p>
              <p className="text-sm text-muted-foreground">{action?.description}</p>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>
      {/* Emergency Action */}
      <div className="mt-4 pt-4 border-t border-border">
        <Button
          variant="destructive"
          size="lg"
          iconName="AlertTriangle"
          iconPosition="left"
          onClick={() => navigate('/report-lost-pet')}
          fullWidth
          className="animate-pulse-gentle"
        >
          Reportar Mascota Perdida
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;