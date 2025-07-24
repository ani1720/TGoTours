import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import useUserLocation from "../Hooks/useUserLocation";
import { useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const RutaDetalle = () => {
  const mapRef = useRef(null);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const userLocation = useUserLocation();

  useEffect(() => {
    const mapContainer = document.getElementById("map");
    if (!mapContainer || mapRef.current) return;

    // Crear mapa solo una vez
    mapRef.current = L.map("map").setView([41.117, 1.25], 14);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors & CartoDB',
    }).addTo(mapRef.current);

    // Si existe la ubicación del usuario, agregar marcador
    if (userLocation) {
      L.marker(userLocation)
        .addTo(mapRef.current)
        .bindPopup("📍 Tu ubicación")
        .openPopup();
    }
    console.log("📍 Ubicación detectada:", userLocation);


    // Cargar datos de Rutas.json
   const cargarRutas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "rutas"));
        const rutasData = [];
        querySnapshot.forEach((doc) => rutasData.push(doc.data()));
        if (rutasData.length > 0) setRutaSeleccionada(rutasData[0]);
      } catch (error) {
        console.error("Error al cargar rutas desde Firebase:", error);
      }
    };
    cargarRutas();
    }, [userLocation]);

  //cuando se cargue una ruta
  useEffect(() => {
    if (rutaSeleccionada) {
      obtenerRuta(rutaSeleccionada.coordenadasJSON);
    }
  }, [rutaSeleccionada, userLocation]);

  const obtenerRuta = async (coordenadasURL) => {
    try {
      const response = await fetch(coordenadasURL);
      const data = await response.json();

      let coordenadas = data.ruta.map((p) => p.coordenadas);

      if (userLocation && mapRef.current) {
        L.marker(userLocation).addTo(mapRef.current).bindPopup("Tu ubicación");
      }
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.GeoJSON) {
          mapRef.current.removeLayer(layer);
        }
      });
      //Insertar ubicacion del Usuario como primer punto si existe
      // Si hay userLocation, agrégalo al inicio (también en [lng, lat])

      //Dibuja los marcadores
      // coordenadas.forEach((coord, i) => {
      //   L.marker(coord.slice().reverse())
      //     .addTo(mapRef.current)
      //     .bindPopup(
      //       +i === 0 && userLocation
      //         ? "Tu ubicacion"
      //         : data.ruta[i - (userLocation ? 1 : 0)].nombre
      //     );
      //   // coord.reverse(); // Regresamos a [lng, lat] para ORS
      // });

      coordenadas.forEach((coord, i) => {
        const punto = data.ruta[i - (userLocation ? 1 : 0)];
        let popupContent;

        if (+i === 0 && userLocation) {
          popupContent = "Tu ubicacion";
        } else if (punto) {
          popupContent = `
      <strong>${punto.nombre}</strong><br>
      <img src="${punto.imagen}" alt="${punto.nombre}" style="max-width:150px;max-height:100px;" />
    `;
        } else {
          popupContent = "";
        }

        L.marker(coord.slice().reverse())
          .addTo(mapRef.current)
          .bindPopup(popupContent);
      });

      //solicita ruta a ors
      const orsResponse = await fetch(
        "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
        {
          method: "POST",
          headers: {
            Accept: "application/json, application/geo+json",
            "Content-Type": "application/json",
            Authorization:
              "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjcwNGMxOTg0NGQ1MjQ5YjliOWJhMjE0NjE0MzUyNjlmIiwiaCI6Im11cm11cjY0In0=",
          },
          body: JSON.stringify({ coordinates: coordenadas }),
        }
      );

      if (!orsResponse.ok) throw new Error("Error al obtener ruta de ORS");

      const resultado = await orsResponse.json();

      L.geoJSON(resultado, { style: { color: "blue", weight: 3 } }).addTo(
        mapRef.current
      );

      const bounds = L.geoJSON(resultado).getBounds();
      mapRef.current.fitBounds(bounds);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const publicarComentario = () => {
    if (nuevoComentario.trim() === "") return;
    setComentarios([...comentarios, nuevoComentario.trim()]);
    setNuevoComentario("");
  };

  return (
    <div className="ruta-detalle-container" style={{ padding: "1rem" }}>
      {rutaSeleccionada && (
        <>
          <h2>{rutaSeleccionada.nombre}</h2>
          <span className={`badge ${rutaSeleccionada.tipo}`}>
            {rutaSeleccionada.tipo}
          </span>
          <p>
            <strong>Duración:</strong> {rutaSeleccionada.duracion}
          </p>
          <p>{rutaSeleccionada.descripcion}</p>

          <h3>Puntos de interés:</h3>
          <ul>
            {rutaSeleccionada.contenido.map((punto, idx) => (
              <li key={idx}>{punto}</li>
            ))}
          </ul>
        </>
      )}

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
          <li key={idx} style={{ marginBottom: "0.3rem" }}>
            💬 {comentario}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RutaDetalle;
