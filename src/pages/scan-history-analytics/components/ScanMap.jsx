import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScanMap = ({ scans, selectedScan, onScanSelect, className = "" }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 40.4168, lng: -3.7038 }); // Madrid default
  const [mapZoom, setMapZoom] = useState(12);

  useEffect(() => {
    if (selectedScan && selectedScan?.coordinates) {
      setMapCenter(selectedScan?.coordinates);
      setMapZoom(15);
    } else if (scans?.length > 0) {
      // Calculate center from all scans
      const avgLat = scans?.reduce((sum, scan) => sum + scan?.coordinates?.lat, 0) / scans?.length;
      const avgLng = scans?.reduce((sum, scan) => sum + scan?.coordinates?.lng, 0) / scans?.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
      setMapZoom(12);
    }
  }, [selectedScan, scans]);

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 1));
  };

  const handleCenterMap = () => {
    if (scans?.length > 0) {
      const avgLat = scans?.reduce((sum, scan) => sum + scan?.coordinates?.lat, 0) / scans?.length;
      const avgLng = scans?.reduce((sum, scan) => sum + scan?.coordinates?.lng, 0) / scans?.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
      setMapZoom(12);
    }
  };

  // Generate markers parameter for Google Maps
  const generateMarkersParam = () => {
    return scans?.map((scan, index) => {
      const color = scan?.scanType === 'emergency' ? 'red' : 
                   scan?.scanType === 'finder' ? 'orange' :
                   scan?.scanType === 'vet' ? 'blue' : 'green';
      return `color:${color}|label:${index + 1}|${scan?.coordinates?.lat},${scan?.coordinates?.lng}`;
    })?.join('&markers=');
  };

  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=demo&center=${mapCenter?.lat},${mapCenter?.lng}&zoom=${mapZoom}&maptype=roadmap`;

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
      {/* Map Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Map" size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Mapa de Escaneos</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Minus"
              onClick={handleZoomOut}
              title="Alejar"
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="Plus"
              onClick={handleZoomIn}
              title="Acercar"
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="Target"
              onClick={handleCenterMap}
              title="Centrar mapa"
            />
          </div>
        </div>
      </div>
      {/* Map Container */}
      <div className="relative h-96 bg-muted">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Mapa de escaneos NFC"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=${mapZoom}&output=embed`}
          className="border-0"
        />
        
        {/* Map Overlay Controls */}
        <div className="absolute top-4 right-4 bg-card border border-border rounded-lg p-2 shadow-elevated">
          <div className="flex flex-col space-y-1">
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-muted rounded transition-smooth"
              title="Acercar"
            >
              <Icon name="Plus" size={16} />
            </button>
            <div className="w-full h-px bg-border" />
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-muted rounded transition-smooth"
              title="Alejar"
            >
              <Icon name="Minus" size={16} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-3 shadow-elevated">
          <h4 className="text-sm font-medium text-foreground mb-2">Leyenda</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full" />
              <span className="text-muted-foreground">Propietario</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full" />
              <span className="text-muted-foreground">Persona que encontró</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-muted-foreground">Veterinario</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded-full" />
              <span className="text-muted-foreground">Emergencia</span>
            </div>
          </div>
        </div>
      </div>
      {/* Scan List */}
      {scans?.length > 0 && (
        <div className="p-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Ubicaciones de escaneo</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {scans?.slice(0, 5)?.map((scan, index) => (
              <button
                key={scan?.id}
                onClick={() => onScanSelect(scan)}
                className={`flex items-center space-x-3 w-full p-2 rounded-md text-left transition-smooth ${
                  selectedScan?.id === scan?.id
                    ? 'bg-primary/10 border border-primary/20' :'hover:bg-muted'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                  scan?.scanType === 'emergency' ? 'bg-error' :
                  scan?.scanType === 'finder' ? 'bg-warning' :
                  scan?.scanType === 'vet'? 'bg-primary' : 'bg-success'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{scan?.location}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(scan.timestamp)?.toLocaleDateString('es-ES')}
                  </p>
                </div>
                <Icon name="MapPin" size={14} className="text-muted-foreground" />
              </button>
            ))}
            
            {scans?.length > 5 && (
              <p className="text-xs text-muted-foreground text-center py-2">
                +{scans?.length - 5} ubicaciones más
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanMap;