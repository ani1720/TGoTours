import React, { useEffect, useState } from "react";
import { extraerCoordenadasDesdeGPX } from "../utils/parseGPX";

const GPXTest = () => {
  const [coordenadas, setCoordenadas] = useState([]);

  useEffect(() => {
    // Cambia el nombre del archivo si es otro
    extraerCoordenadasDesdeGPX("public/gpx/ruta_tarragona.gpx").then((coords) => {
      console.log("Coordenadas extraídas:", coords);
      setCoordenadas(coords);
    });
  }, []);

  return (
    <div>
      <h2>Coordenadas extraídas del GPX</h2>
      <pre style={{ maxHeight: "300px", overflowY: "scroll", background: "#eee", padding: "1em" }}>
        {JSON.stringify(coordenadas, null, 2)}
      </pre>
    </div>
  );
};

export default GPXTest;
