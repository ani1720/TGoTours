const ORSMap = ({ puntosInteres = [] }) => {
  useEffect(() => {
    const initMap = async () => {
      const map = L.map("ors-map").setView([41.12, 1.26], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      // Mostrar marcadores de interés
      puntosInteres.forEach((punto) => {
        const marker = L.marker([punto.coordenadas[1], punto.coordenadas[0]]).addTo(map);
        marker.bindPopup(`<b>${punto.nombre}</b><br>${punto.descripcion}`);
      });

      // Ruta desde puntos de interés
      const coordenadasRuta = puntosInteres.map((p) => p.coordenadas);
      const rutaGeoJSON = await obtenerRutaORS(coordenadasRuta);

      if (rutaGeoJSON) {
        L.geoJSON(rutaGeoJSON, {
          style: {
            color: "blue",
            weight: 4,
            opacity: 0.7,
          },
        }).addTo(map);
      }
    };

    initMap();
  }, [puntosInteres]);

  return <div id="ors-map" style={{ height: "80vh", width: "100%" }} />;
};

export default ORSMap;
