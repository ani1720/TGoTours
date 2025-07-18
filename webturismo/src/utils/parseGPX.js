import { DOMParser } from "xmldom";
import { gpx } from "@tmcw/togeojson";

export const extraerCoordenadasDesdeGPX = async (url) => {
  try {
    const respuesta = await fetch(url);
    const textoGPX = await respuesta.text();

    const xml = new DOMParser().parseFromString(textoGPX, "text/xml");
    const geojson = gpx(xml);

    const coordenadas = [];

    geojson.features.forEach((feature) => {
      if (feature.geometry && feature.geometry.type === "LineString") {
        feature.geometry.coordinates.forEach((coord) => {
          coordenadas.push(coord); // Originalmente incluye [lon, lat, alt]
        });
      }
    });

    // Filtrar a solo [lon, lat]
    const coordenadasFiltradas = coordenadas.map(([lon, lat]) => [lon, lat]);

    return coordenadasFiltradas;
  } catch (error) {
    console.error("Error al leer el archivo GPX:", error);
    return [];
  }
};
