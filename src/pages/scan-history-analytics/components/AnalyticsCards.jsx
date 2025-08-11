import React from 'react';
import Icon from '../../../components/AppIcon';

const AnalyticsCards = ({ analytics, className = "" }) => {
  const cards = [
    {
      title: 'Total de Escaneos',
      value: analytics?.totalScans,
      change: analytics?.scanChange,
      icon: 'Smartphone',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Ubicaciones Únicas',
      value: analytics?.uniqueLocations,
      change: analytics?.locationChange,
      icon: 'MapPin',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Área Más Activa',
      value: analytics?.mostActiveArea,
      subtitle: `${analytics?.mostActiveScans} escaneos`,
      icon: 'TrendingUp',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Último Escaneo',
      value: analytics?.lastScanTime,
      subtitle: analytics?.lastScanLocation,
      icon: 'Clock',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    }
  ];

  const formatChange = (change) => {
    if (!change) return null;
    const isPositive = change > 0;
    return (
      <div className={`flex items-center space-x-1 text-xs ${
        isPositive ? 'text-success' : 'text-error'
      }`}>
        <Icon name={isPositive ? 'TrendingUp' : 'TrendingDown'} size={12} />
        <span>{Math.abs(change)}%</span>
      </div>
    );
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {cards?.map((card, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 hover:shadow-soft transition-smooth">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${card?.bgColor} flex items-center justify-center`}>
              <Icon name={card?.icon} size={20} className={card?.color} />
            </div>
            {card?.change && formatChange(card?.change)}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{card?.title}</h3>
            <p className="text-2xl font-bold text-foreground mb-1">{card?.value}</p>
            {card?.subtitle && (
              <p className="text-sm text-muted-foreground">{card?.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;