import { useParams } from "react-router-dom";
import rutas from "../data/rutas.json";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-gpx";

const RutaDetalle = () => {
  const { id } = useParams();
  const ruta = rutas.find((r) => r.id === parseInt(id));
  const mapRef = useRef(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");

  useEffect(() => {
    if (!ruta || mapRef.current) return;

    mapRef.current = L.map("map").setView([41.12, 1.26], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapRef.current);

    new L.GPX(ruta.archivo_gpx, {
      async: true,
      polyline_options: {
        color: "blue",
        weight: 4,
        opacity: 0.8,
      },
      marker_options: {
        startIconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        endIconUrl: "https://cdn-icons-png.flaticon.com/512/892/892285.png",
        shadowUrl: "",
      },
    })
      .on("loaded", function (e) {
        mapRef.current.fitBounds(e.target.getBounds());
      })
      .addTo(mapRef.current);
  }, [ruta]);

  if (!ruta) return <p>Ruta no encontrada</p>;

  const publicarComentario = () => {
    if (nuevoComentario.trim() === "") return;
    setComentarios([...comentarios, nuevoComentario.trim()]);
    setNuevoComentario("");
  };

  return (
    <div className="ruta-detalle-container" style={{ padding: "1rem" }}>
      <h2>{ruta.nombre}</h2>
      <span className={`badge ${ruta.tipo}`}>{ruta.tipo}</span>
      <p><strong>Duración:</strong> {ruta.duracion}</p>
      <p>{ruta.descripcion}</p>

      <h3>Puntos de interés:</h3>
      <ul>
        {ruta.contenido.map((punto, idx) => (
          <li key={idx}>{punto}</li>
        ))}
      </ul>

      <h3>Mapa de la ruta</h3>
      <div id="map" style={{ height: "70vh", marginBottom: "2rem" }}></div>

      <h3>Foro de la ruta</h3>
      <textarea
        value={nuevoComentario}
        onChange={(e) => setNuevoComentario(e.target.value)}
        placeholder="Escribe tu comentario..."
        rows={3}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      <button onClick={publicarComentario}>Publicar</button>
      <ul style={{ marginTop: "1rem" }}>
        {comentarios.map((comentario, idx) => (
          <li key={idx} style={{ marginBottom: "0.3rem" }}>🗨 {comentario}</li>
        ))}
      </ul>
    </div>
  );
};

export default RutaDetalle;
