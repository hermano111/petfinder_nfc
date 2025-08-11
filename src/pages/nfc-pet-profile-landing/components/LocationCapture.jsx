import React, { useState, useEffect } from 'react';
import { MapPin, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const LocationCapture = ({ onLocationCaptured, petName }) => {
  const [locationStatus, setLocationStatus] = useState('requesting'); // requesting, success, error, denied
  const [error, setError] = useState(null);

  useEffect(() => {
    const captureLocation = () => {
      if (!navigator.geolocation) {
        setLocationStatus('error');
        setError('Geolocation is not supported by this browser');
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // 1 minute
      };

      navigator.geolocation?.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position?.coords?.latitude,
            longitude: position?.coords?.longitude,
            accuracy: position?.coords?.accuracy
          };
          
          setLocationStatus('success');
          onLocationCaptured?.(location);
        },
        (error) => {
          setLocationStatus('error');
          switch(error?.code) {
            case error?.PERMISSION_DENIED:
              setLocationStatus('denied');
              setError('Location access denied. The pet owner can still be contacted through the information below.');
              break;
            case error?.POSITION_UNAVAILABLE:
              setError('Location information unavailable. Please ensure location services are enabled.');
              break;
            case error?.TIMEOUT:
              setError('Location request timed out. Trying to contact owner without location.');
              break;
            default:
              setError('An error occurred while retrieving location.');
              break;
          }
        },
        options
      );
    };

    captureLocation();
  }, [onLocationCaptured]);

  const getStatusIcon = () => {
    switch (locationStatus) {
      case 'requesting':
        return <Loader2 className="w-6 h-6 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'denied':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      default:
        return <MapPin className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (locationStatus) {
      case 'requesting':
        return `Capturing your location to help reunite ${petName || 'this pet'} with their family...`;
      case 'success':
        return `Location captured! The owner of ${petName || 'this pet'} has been notified of your current location.`;
      case 'denied':
        return 'Location access was denied, but you can still contact the owner directly below.';
      case 'error':
        return error || 'Unable to capture location, but you can still help by contacting the owner directly.';
      default:
        return 'Preparing to capture location...';
    }
  };

  const getBackgroundColor = () => {
    switch (locationStatus) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'denied':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`rounded-lg border-2 p-6 mb-6 ${getBackgroundColor()}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {getStatusIcon()}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Locating {petName || 'Pet'}
          </h3>
          <p className="text-gray-700 text-sm mb-4">
            {getStatusMessage()}
          </p>
          
          {locationStatus === 'requesting' && (
            <div className="text-xs text-gray-600">
              <p>• This helps the owner know exactly where their pet was found</p>
              <p>• Your precise location will be shared with the pet owner</p>
              <p>• This information is only used to help reunite the pet with its family</p>
            </div>
          )}
          
          {locationStatus === 'success' && (
            <div className="bg-white rounded-md p-3 border border-green-200">
              <div className="text-sm text-green-800 font-medium mb-1">
                ✅ Owner Notified Successfully
              </div>
              <div className="text-xs text-green-700">
                The pet owner has received an automatic WhatsApp message with your current location and a Google Maps link.
              </div>
            </div>
          )}
          
          {(locationStatus === 'denied' || locationStatus === 'error') && (
            <div className="bg-white rounded-md p-3 border border-gray-200">
              <div className="text-sm text-gray-800 font-medium mb-1">
                📞 Contact Owner Directly
              </div>
              <div className="text-xs text-gray-600">
                You can still help by using the contact information below to reach the pet owner directly.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationCapture;