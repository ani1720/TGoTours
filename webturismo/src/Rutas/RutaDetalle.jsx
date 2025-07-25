import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import useUserLocation from "../Hooks/useUserLocation";
import { useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useUser } from "../context/UserContext";


const RutaDetalle = () => {
  const { id } = useParams(); // 🔑 Usamos el ID de la URL
  const mapRef = useRef(null);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const userLocation = useUserLocation();
  const usuario = useUser();

  useEffect(() => {
    const mapContainer = document.getElementById("map");
    if (!mapContainer || mapRef.current) return;

    mapRef.current = L.map("map").setView([41.117, 1.25], 14);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors & CartoDB',
    }).addTo(mapRef.current);

    fetch("/data/Rutas.json")
      .then((res) => res.json())
      .then((rutas) => {
        const ruta = rutas.find((r) => String(r.id) === id); // 🔍 Buscar por ID
        setRutaSeleccionada(ruta || rutas[0]); // Fallback si no se encuentra
      })
      .catch((error) => console.error("Error al cargar Rutas.json:", error));
  }, [id]);

  useEffect(() => {
    if (rutaSeleccionada) {
      obtenerRuta(rutaSeleccionada.coordenadasJSON);
    }
  }, [rutaSeleccionada, userLocation]);

  useEffect(() => {
    if (!id) return;
    const q = query(
      collection(db, "rutas", id, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComentarios(lista);
    });
    return () => unsubscribe();
  }, [id]);

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

      coordenadas.forEach((coord, i) => {
        const punto = data.ruta[i - (userLocation ? 1 : 0)];
        let popupContent;

        if (+i === 0 && userLocation) {
          popupContent = "Tu ubicación";
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

  const publicarComentario = async () => {
    if (!nuevoComentario.trim() || !usuario?.uid || !id) return;

    const fotoURL = usuario.fotoURL ? usuario.fotoURL : null;

    await addDoc(collection(db, "rutas", id, "comments"), {
      content: nuevoComentario.trim(),
      authorId: usuario.uid,
      authorName: usuario.displayName || usuario.email,
      fotoURL,
      createdAt: serverTimestamp(),
    });

    setNuevoComentario("");
  };

  const eliminarComentario = async (commentId) => {
    try {
      const refDoc = doc(db, "rutas", id, "comments", commentId);
      await deleteDoc(refDoc);
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
    }
  };

  return (
    <div className="ruta-detalle-container" style={{ padding: "1rem" }}>
      {rutaSeleccionada && (
        <>
          <h2>{rutaSeleccionada.nombre}</h2>
          <span className={`badge ${rutaSeleccionada.tipo}`}>
            {rutaSeleccionada.tipo}
          </span>
          <p><strong>Duración:</strong> {rutaSeleccionada.duracion}</p>
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
      {usuario && usuario.uid ? (
        <>
          <textarea
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            placeholder="Escribe tu comentario..."
            rows={3}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <button onClick={publicarComentario}>💬 Comentar</button>
        </>
      ) : (
        <p>Debes iniciar sesión para comentar.</p>
      )}

      <ul style={{ marginTop: "1rem" }}>
        {comentarios.map((c) => {
          const initials = c.authorName
            ? c.authorName[0].toUpperCase() + c.authorName.slice(-1).toUpperCase()
            : "U";

          const avatarURL = c.fotoURL
            ? c.fotoURL
            : `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;

          return (
            <li key={c.id} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "1rem" }}>
              <img
                src={avatarURL}
                alt="Avatar"
                style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <strong>{c.authorName}</strong>
                <p>{c.content}</p>
                {usuario?.uid === c.authorId && (
                  <button
                    onClick={() => eliminarComentario(c.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#cc0000",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RutaDetalle;