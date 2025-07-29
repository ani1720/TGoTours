import { useState, useEffect } from 'react';

const useUserLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const solicitarUbicacion = () => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta la geolocalización.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setError(null);
        console.log('📍 Ubicación detectada:', position.coords);
      },
      (error) => {
        console.error('Error obteniendo ubicación del usuario:', error);
        if (error.code === 1) {
          setError('Has denegado el permiso de ubicación. Actívalo para usar el mapa.');
        } else {
          setError('No se pudo obtener tu ubicación.');
        }
      }
    );
  };

  useEffect(() => {
    solicitarUbicacion();
  }, []);

  return { location, error, solicitarUbicacion };
};

export default useUserLocation;
