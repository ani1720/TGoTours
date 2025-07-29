import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-gpx";


const MapView = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Prevenir doble inicialización
    if (mapRef.current !== null) return;

    // Crear mapa una sola vez
    mapRef.current = L.map("map").setView([41.12, 1.26], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapRef.current);

    new L.GPX("/gpx/murallas_romanas.gpx", {
      async: true,
      polyline_options: {
        color: "blue",
        weight: 4,
        opacity: 0.8,
      },
      marker_options: {
        startIconUrl: "https://cdn-icons-png.flaticon.com/128/149/149059.png",
        endIconUrl: "https://cdn-icons-png.flaticon.com/128/149/149983.png",
        shadowUrl: "",
      },
    })
      .on("loaded", function (e) {
        mapRef.current.fitBounds(e.target.getBounds());
      })
      .addTo(mapRef.current);
  }, []);

 return <div id="map" className="mapa-principal" />;


};

export default MapView;