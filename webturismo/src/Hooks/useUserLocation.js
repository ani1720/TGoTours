import { useEffect, useState } from "react";

function useUserLocation() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

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
      { enableHighAccuracy: true }
    );
  }, []);

  return location;
}
export default useUserLocation