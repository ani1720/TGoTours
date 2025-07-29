import { useEffect, useState } from "react";

function useUserLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("La geolocalización no está disponible en este navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      (error) => {
        console.error("Error obteniendo ubicación del usuario:", error);
        setLocation(null);
      },
      {
        enableHighAccuracy: true, // 🔍 Usa GPS si está disponible
        maximumAge: 0,            // 🕒 No reutilices ubicaciones antiguas
        timeout: 10000            // ⏱️ Espera hasta 10 segundos
      }
    );
  }, []);

  return location;
}
export default useUserLocation