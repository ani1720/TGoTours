import { useEffect, useState } from "react";

const useUserLocation = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation([pos.coords.latitude, pos.coords.longitude]),
      (err) => {
        console.error("No se pudo obtener la ubicación:", err);
        setLocation(null);
      }
    );
  }, []);

  return location;
};

export default useUserLocation;