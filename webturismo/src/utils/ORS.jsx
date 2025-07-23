const obtenerRutaORS = async (coordenadas) => {
  const apiKey = import.meta.env.VITE_ORS_API_KEY;

  try {
    const response = await fetch("/data/coordenadas.json");
    const data = await response.json();

    const coordenadas = data.ruta.map((punto) => punto.coordenadas);
    setPuntos(data.ruta);
    const respuesta = await fetch(
      "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
      {
        method: "POST",
        headers: {
          Accept: "application/geo+json",
          "Content-Type": "application/json",
          Authorization: apiKey
        },
        body: JSON.stringify({ coordinates: coordenadas }),
      }
    );

    if (!respuesta.ok) throw new Error("Error en la API de ORS");

    const geojson = await respuesta.json();
    const coordenadasRuta = geojson.features[0].geometry.coordinates;
    setRuta(coordenadasRuta);
  } catch (error) {
    console.error("Error:", error);
  }
};
return (
    <div>
      <h1>Ruta Turística con Paradas</h1>
      <button onClick={obtenerRuta}>Cargar Ruta desde JSON</button>

      <MapContainer center={[41.117, 1.256]} zoom={15} scrollWheelZoom={true} style={{ height: '80vh', marginTop: '1rem' }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors & CartoDB' 
        />
        
        {/* Ruta calculada */}
        {ruta.length > 0 && (
          <Polyline positions={ruta.map(c => [c[1], c[0]])} color="blue" />
        )}

        {/* Puntos de interés */}
        {puntos.map((p, idx) => (
          <Marker key={idx} position={[p.coordenadas[1], p.coordenadas[0]]}>
            <Popup>{p.nombre}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );

export default obtenerRutaORS
