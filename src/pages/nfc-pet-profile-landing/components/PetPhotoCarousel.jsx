import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const PetPhotoCarousel = ({ photos = [], petName = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos?.length === 0) {
    return (
      <div className="relative w-full h-80 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Icon name="Camera" size={48} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No hay fotos disponibles</p>
        </div>
      </div>
    );
  }

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos?.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos?.length) % photos?.length);
  };

  const goToPhoto = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full">
      {/* Main Photo Display */}
      <div className="relative w-full h-80 sm:h-96 bg-muted rounded-lg overflow-hidden">
        <Image
          src={photos?.[currentIndex]}
          alt={`${petName} - Foto ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {photos?.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-smooth"
              aria-label="Foto anterior"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-smooth"
              aria-label="Siguiente foto"
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </>
        )}

        {/* Photo Counter */}
        {photos?.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentIndex + 1} / {photos?.length}
          </div>
        )}
      </div>
      {/* Thumbnail Navigation */}
      {photos?.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2 overflow-x-auto pb-2">
          {photos?.map((photo, index) => (
            <button
              key={index}
              onClick={() => goToPhoto(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-smooth ${
                index === currentIndex
                  ? 'border-primary shadow-md'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Image
                src={photo}
                alt={`${petName} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      {/* Photo Indicators */}
      {photos?.length > 1 && photos?.length <= 5 && (
        <div className="flex justify-center mt-3 space-x-2">
          {photos?.map((_, index) => (
            <button
              key={index}
              onClick={() => goToPhoto(index)}
              className={`w-2 h-2 rounded-full transition-smooth ${
                index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
              aria-label={`Ir a foto ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PetPhotoCarousel;