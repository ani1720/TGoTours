import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { obtenerRutaORS } from "../utils/ORS";

const ORSMap = ({ coordenadas = [], puntosInteres = [] }) => {
  useEffect(() => {
    const initMap = async () => {
      const map = L.map("ors-map").setView([41.12, 1.26], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      // Mostrar marcadores de interés
      puntosInteres.forEach((punto) => {
        const marker = L.marker([punto.lat, punto.lon]).addTo(map);
        marker.bindPopup(`<b>${punto.nombre}</b><br>${punto.descripcion}`);
      });

      // Obtener y mostrar la ruta realista si hay coordenadas
      if (coordenadas.length >= 2) {
        const rutaGeoJSON = await obtenerRutaORS(coordenadas);

        if (rutaGeoJSON) {
          L.geoJSON(rutaGeoJSON, {
            style: {
              color: "blue",
              weight: 4,
              opacity: 0.7,
            },
          }).addTo(map);
        }
      }
    };

    initMap();
  }, [coordenadas, puntosInteres]);

  return <div id="ors-map" style={{ height: "80vh", width: "100%" }} />;
};

export default ORSMap;
