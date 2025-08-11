import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PhotoManagementSection = ({ 
  photos = [], 
  onPhotosUpdate, 
  isExpanded, 
  onToggle,
  primaryPhotoId = null,
  onPrimaryPhotoChange 
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    if (!files || files?.length === 0) return;
    
    setUploading(true);
    const newPhotos = [];
    
    Array.from(files)?.forEach((file, index) => {
      if (file?.type?.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto = {
            id: Date.now() + index,
            url: e?.target?.result,
            name: file?.name,
            size: file?.size,
            type: file?.type,
            uploadDate: new Date()?.toISOString()
          };
          newPhotos?.push(newPhoto);
          
          if (newPhotos?.length === Array.from(files)?.filter(f => f?.type?.startsWith('image/'))?.length) {
            onPhotosUpdate([...photos, ...newPhotos]);
            setUploading(false);
          }
        };
        reader?.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setDragOver(false);
    handleFileSelect(e?.dataTransfer?.files);
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setDragOver(false);
  };

  const removePhoto = (photoId) => {
    const updatedPhotos = photos?.filter(photo => photo?.id !== photoId);
    onPhotosUpdate(updatedPhotos);
    
    if (primaryPhotoId === photoId && updatedPhotos?.length > 0) {
      onPrimaryPhotoChange(updatedPhotos?.[0]?.id);
    } else if (primaryPhotoId === photoId) {
      onPrimaryPhotoChange(null);
    }
  };

  const setPrimaryPhoto = (photoId) => {
    onPrimaryPhotoChange(photoId);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted transition-smooth"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Camera" size={20} className="text-secondary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Gestión de Fotos</h3>
            <p className="text-sm text-muted-foreground">
              {photos?.length} foto{photos?.length !== 1 ? 's' : ''} subida{photos?.length !== 1 ? 's' : ''}
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
          {/* Upload Area */}
          <div
            className={`mt-6 border-2 border-dashed rounded-lg p-8 text-center transition-smooth ${
              dragOver 
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e?.target?.files)}
              className="hidden"
            />
            
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Upload" size={24} className="text-primary" />
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">
                  Arrastra fotos aquí o haz clic para seleccionar
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Formatos soportados: JPG, PNG, WEBP (máx. 5MB cada una)
                </p>
                
                <Button
                  variant="outline"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => fileInputRef?.current?.click()}
                  loading={uploading}
                >
                  Seleccionar Fotos
                </Button>
              </div>
            </div>
          </div>

          {/* Photo Grid */}
          {photos?.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-foreground">Fotos de la mascota</h4>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Star" size={16} />
                  <span>Foto principal</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos?.map((photo) => (
                  <div
                    key={photo?.id}
                    className={`relative group bg-muted rounded-lg overflow-hidden aspect-square ${
                      primaryPhotoId === photo?.id ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Image
                      src={photo?.url}
                      alt={photo?.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Primary Photo Badge */}
                    {primaryPhotoId === photo?.id && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1">
                        <Icon name="Star" size={12} />
                        <span>Principal</span>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center space-x-2">
                      {primaryPhotoId !== photo?.id && (
                        <Button
                          variant="secondary"
                          size="sm"
                          iconName="Star"
                          onClick={() => setPrimaryPhoto(photo?.id)}
                          className="bg-white/90 text-gray-900 hover:bg-white"
                        >
                          Principal
                        </Button>
                      )}
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        iconName="Trash2"
                        onClick={() => removePhoto(photo?.id)}
                        className="bg-red-500/90 hover:bg-red-500"
                      >
                        Eliminar
                      </Button>
                    </div>
                    
                    {/* Photo Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-white text-xs truncate">{photo?.name}</p>
                      <p className="text-white/70 text-xs">{formatFileSize(photo?.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Lightbulb" size={20} className="text-warning mt-0.5" />
              <div>
                <h5 className="font-medium text-foreground mb-2">Consejos para mejores fotos</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Usa buena iluminación natural</li>
                  <li>• Incluye fotos de cuerpo completo y primer plano</li>
                  <li>• Muestra características distintivas (marcas, cicatrices)</li>
                  <li>• La foto principal aparecerá en el perfil NFC público</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoManagementSection;