import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';

const PetContextBar = ({ 
  pets = [], 
  selectedPetId = null, 
  onPetSelect = () => {},
  className = "" 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  // Only show on pet-specific pages
  const petSpecificPages = ['/pet-profile-management', '/medical-records-center', '/scan-history-analytics'];
  const shouldShow = petSpecificPages?.includes(location?.pathname) && pets?.length > 0;

  if (!shouldShow) {
    return null;
  }

  const selectedPet = pets?.find(pet => pet?.id === selectedPetId) || pets?.[0];

  const handlePetSelect = (pet) => {
    onPetSelect(pet?.id);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 mb-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src={selectedPet?.photo || '/assets/images/no_image.png'}
              alt={selectedPet?.name || 'Pet'}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary"
            />
            {selectedPet?.status === 'lost' && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full border-2 border-card">
                <Icon name="AlertTriangle" size={10} color="white" className="absolute top-0.5 left-0.5" />
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground">{selectedPet?.name || 'Select Pet'}</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{selectedPet?.breed}</span>
              {selectedPet?.age && (
                <>
                  <span>•</span>
                  <span>{selectedPet?.age} years old</span>
                </>
              )}
            </div>
          </div>
        </div>

        {pets?.length > 1 && (
          <div className="relative">
            {/* Desktop: Tabs */}
            <div className="hidden md:flex items-center space-x-1">
              {pets?.slice(0, 4)?.map((pet) => (
                <button
                  key={pet?.id}
                  onClick={() => handlePetSelect(pet)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                    pet?.id === selectedPetId
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Image
                    src={pet?.photo || '/assets/images/no_image.png'}
                    alt={pet?.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="max-w-20 truncate">{pet?.name}</span>
                </button>
              ))}
              
              {pets?.length > 4 && (
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                >
                  <span>+{pets?.length - 4}</span>
                  <Icon name="ChevronDown" size={16} />
                </button>
              )}
            </div>

            {/* Mobile: Dropdown */}
            <div className="md:hidden">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              >
                <span>Switch Pet</span>
                <Icon name={isDropdownOpen ? "ChevronUp" : "ChevronDown"} size={16} />
              </button>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-elevated z-100">
                <div className="p-2 space-y-1">
                  {pets?.map((pet) => (
                    <button
                      key={pet?.id}
                      onClick={() => handlePetSelect(pet)}
                      className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-sm transition-smooth ${
                        pet?.id === selectedPetId
                          ? 'bg-primary text-primary-foreground'
                          : 'text-popover-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="relative">
                        <Image
                          src={pet?.photo || '/assets/images/no_image.png'}
                          alt={pet?.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        {pet?.status === 'lost' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full">
                            <Icon name="AlertTriangle" size={8} color="white" className="absolute top-0.5 left-0.5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{pet?.name}</div>
                        <div className="text-xs text-muted-foreground">{pet?.breed}</div>
                      </div>
                      {pet?.id === selectedPetId && (
                        <Icon name="Check" size={16} className="text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Pet Status Indicators */}
      {selectedPet && (
        <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              selectedPet?.status === 'safe' ? 'bg-success' :
              selectedPet?.status === 'lost'? 'bg-error' : 'bg-warning'
            }`} />
            <span className="text-sm text-muted-foreground capitalize">
              {selectedPet?.status || 'Unknown'}
            </span>
          </div>
          
          {selectedPet?.lastScan && (
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={14} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Last scan: {new Date(selectedPet.lastScan)?.toLocaleDateString()}
              </span>
            </div>
          )}
          
          {selectedPet?.microchipId && (
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={14} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-mono">
                {selectedPet?.microchipId}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PetContextBar;