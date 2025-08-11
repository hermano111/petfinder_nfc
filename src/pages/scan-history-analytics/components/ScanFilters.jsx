import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ScanFilters = ({ filters, onFiltersChange, onExport, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const dateRangeOptions = [
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Última semana' },
    { value: 'month', label: 'Último mes' },
    { value: '3months', label: 'Últimos 3 meses' },
    { value: 'year', label: 'Último año' },
    { value: 'custom', label: 'Rango personalizado' }
  ];

  const scanTypeOptions = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'owner', label: 'Propietario' },
    { value: 'finder', label: 'Persona que encontró' },
    { value: 'vet', label: 'Veterinario' },
    { value: 'emergency', label: 'Emergencia' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Más reciente primero' },
    { value: 'oldest', label: 'Más antiguo primero' },
    { value: 'location', label: 'Por ubicación' },
    { value: 'type', label: 'Por tipo de escaneo' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleReset = () => {
    onFiltersChange({
      dateRange: 'month',
      scanType: 'all',
      sortBy: 'newest',
      searchLocation: '',
      startDate: '',
      endDate: ''
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.dateRange !== 'month') count++;
    if (filters?.scanType !== 'all') count++;
    if (filters?.searchLocation) count++;
    if (filters?.startDate || filters?.endDate) count++;
    return count;
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Filtros</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            onClick={handleReset}
            title="Restablecer filtros"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
            onClick={onExport}
            title="Exportar datos"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>
      </div>
      {/* Quick Filters - Always Visible */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Rango de fechas"
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
          />
          
          <Select
            label="Tipo de escaneo"
            options={scanTypeOptions}
            value={filters?.scanType}
            onChange={(value) => handleFilterChange('scanType', value)}
          />
          
          <Select
            label="Ordenar por"
            options={sortOptions}
            value={filters?.sortBy}
            onChange={(value) => handleFilterChange('sortBy', value)}
          />
        </div>

        {/* Search Location */}
        <Input
          label="Buscar por ubicación"
          type="text"
          placeholder="Ej: Madrid, Parque del Retiro..."
          value={filters?.searchLocation}
          onChange={(e) => handleFilterChange('searchLocation', e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Advanced Filters - Expandable */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="pt-4 space-y-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Filtros avanzados</h4>
            
            {filters?.dateRange === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Fecha de inicio"
                  type="date"
                  value={filters?.startDate}
                  onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
                />
                <Input
                  label="Fecha de fin"
                  type="date"
                  value={filters?.endDate}
                  onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
                />
              </div>
            )}

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Radio de búsqueda
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={filters?.radiusKm || 10}
                    onChange={(e) => handleFilterChange('radiusKm', parseInt(e?.target?.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-12">
                    {filters?.radiusKm || 10}km
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hora del día
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="time"
                    value={filters?.startTime || ''}
                    onChange={(e) => handleFilterChange('startTime', e?.target?.value)}
                    placeholder="Desde"
                  />
                  <Input
                    type="time"
                    value={filters?.endTime || ''}
                    onChange={(e) => handleFilterChange('endTime', e?.target?.value)}
                    placeholder="Hasta"
                  />
                </div>
              </div>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {filters?.dateRange !== 'month' && (
                <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {dateRangeOptions?.find(opt => opt?.value === filters?.dateRange)?.label}
                  <button
                    onClick={() => handleFilterChange('dateRange', 'month')}
                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </span>
              )}
              
              {filters?.scanType !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                  {scanTypeOptions?.find(opt => opt?.value === filters?.scanType)?.label}
                  <button
                    onClick={() => handleFilterChange('scanType', 'all')}
                    className="ml-1 hover:bg-success/20 rounded-full p-0.5"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </span>
              )}
              
              {filters?.searchLocation && (
                <span className="inline-flex items-center px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">
                  {filters?.searchLocation}
                  <button
                    onClick={() => handleFilterChange('searchLocation', '')}
                    className="ml-1 hover:bg-warning/20 rounded-full p-0.5"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanFilters;