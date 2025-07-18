import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Icono personalizado
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2651/2651172.png', // cambia por tu URL
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const Mapa = () => {
  const puntosDeInteres = [
  {
    nombre: "Anfiteatro romano de Tarragona",
    descripcion: "Uno de los monumentos romanos más importantes.",
    coordenadas: [41.114376, 1.258664]
  },
  {
    nombre: "Circus romano de Tarragona (Circ Romà)",
    descripcion: "Antiguo recinto romano para carreras de carros, bien conservado.",
    coordenadas: [41.116149, 1.256987]
  },
  {
  nombre: "Teatro romano de Tarraco",
  descripcion: "Ruinas del teatro romano de la antigua Tarraco, construidas a finales del siglo I a. C., aprovechando la pendiente natural.",
  coordenadas: [41.1128, 1.2494]
},
{
  nombre: "Catedral de Santa Tecla (Tarragona)",
  descripcion: "Catedral gótico-románica construida entre los siglos XII y XIV sobre un antiguo templo romano.",
  coordenadas: [41.119167, 1.258056]
},
{
  nombre: "Muralla romana de Tarragona",
  descripcion: "Cerca militar de origen romano que rodea el casco antiguo, conserva tramos, torres y una puerta original.",
  coordenadas: [41.11880167976933, 1.2550116900644226]
},
{
  nombre: "Foro de la Colonia",
  descripcion: "Centro administrativo y religioso de la antigua Tarraco durante la época romana.",
  coordenadas: [41.1162, 1.2564]
},
{
  nombre: "Foro Provincial de Tarraco",
  descripcion: "Gran plaza monumental construida bajo el emperador Vespasiano.",
  coordenadas: [41.1170, 1.2578]
},
{
  nombre: "Torre del Pretorio y Paseo Arqueológico",
  descripcion: "Torre romana que conecta el circo con el foro provincial y permite vistas panorámicas.",
  coordenadas: [41.1167, 1.2572]
},
{
  nombre: "Acueducto de les Ferreres (Puente del Diablo)",
  descripcion: "Majestuoso acueducto romano que transportaba agua desde el río Francolí.",
  coordenadas: [41.1543, 1.2443]
},
{
  nombre: "Necrópolis Paleocristiana",
  descripcion: "Uno de los cementerios cristianos más importantes del mundo romano occidental.",
  coordenadas: [41.1170, 1.2501]
},
{
  nombre: "Museo Nacional Arqueológico de Tarragona",
  descripcion: "Colección de piezas romanas halladas en la ciudad, incluyendo mosaicos y esculturas.",
  coordenadas: [41.1161, 1.2576]
}



]




  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <MapContainer center={[41.1167, 1.2554]} zoom={16} style={{ height: '100%', width: '100%' }}>
        {/* CAPA BASE SIMPLE */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors & CartoDB'
        />

        {/* PUNTOS DE INTERÉS */}
        {puntosDeInteres.map((punto, idx) => (
          <Marker key={idx} position={punto.coordenadas} icon={customIcon}>
            <Popup>
              <strong>{punto.nombre}</strong><br />
              {punto.descripcion}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Mapa;
