const MapaRuta = ({ coordenadas }) => {
  return (
    <div>
      <p>Mapa de coordenadas (simulado):</p>
      <ul>
        {coordenadas.map(([lat, lon], i) => (
          <li key={i}>
            Lat: {lat}, Lon: {lon}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MapaRuta;
