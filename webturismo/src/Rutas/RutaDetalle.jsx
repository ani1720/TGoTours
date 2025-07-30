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
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useUser } from "../context/UserContext";

const RutaDetalle = () => {
  const { id } = useParams(); // 🔑 Usamos el ID de la URL
  const mapRef = useRef(null);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  // const userLocation = useUserLocation();
  const { usuario, rol, cargando } = useUser();
  const { location: userLocation, error, reintentarUbicacion } = useUserLocation();


  // Inicializar el mapa una sola vez
  useEffect(() => {
    const mapContainer = document.getElementById("map");
    if (!mapContainer || mapRef.current) return;

    mapRef.current = L.map("map").setView([41.117, 1.25], 14);
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors & CartoDB',
      }
    ).addTo(mapRef.current);
  }, []);

    // Si existe la ubicación del usuario, agregar marcador
    // if (userLocation && userLocation.lat != null && userLocation.lng != null) {
    //   L.marker(userLocation)
    //     .addTo(mapRef.current)
    //     .bindPopup("📍 Tu ubicación")
    //     .openPopup();
    // }
    // console.log("📍 Ubicación detectada:", userLocation || "no disponible");

    // Cargar datos de Rutas.json
    //  const cargarRutas = async () => {
    //     try {
    //       const querySnapshot = await getDocs(collection(db, "Rutas", id));
    //       const rutasData = [];
    //       querySnapshot.forEach((doc) => rutasData.push(doc.data()));
    //       if (rutasData.length > 0) setRutaSeleccionada(rutasData[0]);
    //     } catch (error) {
    //       console.error("Error al cargar rutas desde Firebase:", error);
    //     }
    //   };
    //   cargarRutas();

  // Advertir si la geolocalización no está disponible
  useEffect(() => {
    if (!userLocation) {
      console.warn(
        "⚠️ Ubicación del usuario no disponible. Verifica permisos del navegador."
      );
    }

  }, [userLocation]);

  // Cargar datos de la ruta desde Firestore
  useEffect(() => {
    const cargarRutaPorId = async () => {
      try {
        console.log("🆔 ID recibido:", id);
        const docRef = doc(db, "Rutas", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          if (!window.__documentLoggedOnce) {
  console.log("✅ Documento encontrado:", docSnap.data());
  window.__documentLoggedOnce = true;
}
          setRutaSeleccionada(docSnap.data());
        } else {
          console.warn("⚠️ No se encontró la ruta con el ID:", id);
        }
      } catch (error) {
        console.error("❌ Error al cargar la ruta:", error);
      }
    };

    if (id) cargarRutaPorId();
  }, [id]);

  // Escuchar comentarios en tiempo real
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

  // Función que dibuja ruta + marcador de usuario
  const obtenerRuta = async () => {
    try {
      const data = rutaSeleccionada;
      const coordenadas = data.coordenadas;

      if (!Array.isArray(coordenadas) || coordenadas.length === 0) {
        console.warn("⚠️ No hay coordenadas válidas");
        return;
      }

      // Limpiar capas anteriores
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.GeoJSON) {
          mapRef.current.removeLayer(layer);
        }
      });

      // 📍 Agregar marcador de la ubicación del usuario (punto independiente)
      if (userLocation) {
        L.marker(userLocation)
          .addTo(mapRef.current)
          .bindPopup("📍 Tu ubicación actual")
          .openPopup();
      }

      // 📍 Dibujar marcadores de la ruta
      coordenadas.forEach((coord, i) => {
        const latLng = [coord.latitude, coord.longitude];
        const popupText =
          data.contenido?.[i] || `Punto ${i + 1}`; 
        L.marker(latLng)
          .addTo(mapRef.current)
          .bindPopup(popupText);
      });

      // Preparar coords para ORS (solo ruta)
      const coordenadasORS = coordenadas.map((p) => [
        p.longitude,
        p.latitude,
      ]);

      // Llamada a OpenRouteService
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
          body: JSON.stringify({ coordinates: coordenadasORS }),
        }
      );
      if (!orsResponse.ok) throw new Error("Error al obtener ruta ORS");
      const resultado = await orsResponse.json();

      // Dibujar línea de la ruta
      L.geoJSON(resultado, { style: { color: "blue", weight: 3 } }).addTo(
        mapRef.current
      );

      // Ajustar zoom al recorrido
      const bounds = L.geoJSON(resultado).getBounds();
      mapRef.current.fitBounds(bounds);
    } catch (err) {
      console.error("❌ Error:", err);
    }
  };

  // Cada vez que cambie la ruta o la ubicación del usuario, dibujar todo
  useEffect(() => {
    if (rutaSeleccionada) {
      obtenerRuta();
    }
  }, [rutaSeleccionada, userLocation]);

  // Funciones de comentarios
  const publicarComentario = async () => {
    if (!nuevoComentario.trim() || !usuario?.uid || !id) return;
    const fotoURL = usuario.fotoURL || null;
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
      <div id="map" style={{ height: "70vh", marginBottom: "2rem" }} />

      <h3>Foro de la ruta</h3>
      {usuario?.uid ? (
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
            ? c.authorName[0].toUpperCase() +
              c.authorName.slice(-1).toUpperCase()
            : "U";
          const avatarURL = c.fotoURL
            ? c.fotoURL
            : `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;

          return (
            <li
              key={c.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <img
                src={avatarURL}
                alt="Avatar"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
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
