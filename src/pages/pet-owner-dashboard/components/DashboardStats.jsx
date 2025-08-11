import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardStats = ({ stats }) => {
  const statItems = [
    {
      label: 'Mascotas Registradas',
      value: stats?.totalPets,
      icon: 'Heart',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Placas Activas',
      value: stats?.activeTags,
      icon: 'Zap',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Escaneos Hoy',
      value: stats?.todayScans,
      icon: 'Scan',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'Alertas Activas',
      value: stats?.activeAlerts,
      icon: 'AlertTriangle',
      color: stats?.activeAlerts > 0 ? 'text-error' : 'text-muted-foreground',
      bgColor: stats?.activeAlerts > 0 ? 'bg-error/10' : 'bg-muted/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems?.map((item, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 shadow-soft">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${item?.bgColor}`}>
              <Icon name={item?.icon} size={20} className={item?.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold text-foreground">{item?.value}</p>
              <p className="text-sm text-muted-foreground truncate">{item?.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;