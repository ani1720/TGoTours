import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./mapa.css";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

// Íconos personalizados
const iconos = {
  cafeterias: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/922/922699.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  hoteles: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/139/139899.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  // bares: new L.Icon({
  //   iconUrl:
  //     "https://images.icon-icons.com/3015/PNG/512/beer_drink_glass_jar_icon_188550.png",
  //   iconSize: [32, 32],
  //   iconAnchor: [16, 32],
  //   popupAnchor: [0, -32],
  // }),
  puntosDeInteres: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2651/2651172.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  Casino: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/5971/5971903.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  restauranteOSM: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  barOSM: new L.Icon({
    iconUrl:
      "https://images.icon-icons.com/3015/PNG/512/beer_drink_glass_jar_icon_188550.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
};
const Mapa = () => {
  const [puntos, setPuntos] = useState([]);
  const [filtros, setFiltros] = useState({
    // cafeterias: true,
    hoteles: true,
    // bares: true,
    puntosDeInteres: true,
    Casino: true,
    restauranteOSM: true,
    barOSM: true,
  });

  const fetchOverpass = async () => {
    const query = `
    [out:json][timeout:25];
    (
      node["amenity"="restaurant"](around:1000,41.1167,1.2554);
      node["amenity"="bar"](around:1000,41.1167,1.2554);
    );
    out body;
  `;

    const url = "https://overpass-api.de/api/interpreter";
    const response = await fetch(url, {
      method: "POST",
      body: query,
    });

    const data = await response.json();

    const puntosOSM = data.elements
      .filter((el) => el.tags && el.tags.name) // <- Filtrado corregido
      .map((el) => ({
        tipo: el.tags.amenity === "restaurant" ? "restauranteOSM" : "barOSM",
        nombre: el.tags.name,
        descripcion:
          el.tags.description ||
          (el.tags.cuisine && `Tipo: ${el.tags.cuisine}`) ||
          (el.tags["contact:phone"] && `Tel: ${el.tags["contact:phone"]}`) ||
          (el.tags.website && `Web: ${el.tags.website}`) ||
          "Información no disponible",
        coordenadas: [el.lat, el.lon],
      }));

    return puntosOSM;
  };

  useEffect(() => {
    const fetchTodo = async () => {
      const colecciones = [
        "cafeterias",
        "hoteles",
        "bares",
        "puntosDeInteres",
        "Casino",
      ];
      const nuevosPuntos = [];

      for (const tipo of colecciones) {
        const snapshot = await getDocs(collection(db, tipo));
        snapshot.forEach((doc) => {
          const data = doc.data();
          nuevosPuntos.push({
            tipo,
            nombre: data.nombre,
            descripcion: data.descripcion,
            coordenadas: [
              data.coordenadas.latitude,
              data.coordenadas.longitude,
            ],
            link: data.link, // ← esta línea agrega el link
          });

        });
      }
      const puntosOSM = await fetchOverpass();
      setPuntos([...nuevosPuntos, ...puntosOSM]);
    };

    fetchTodo();
  }, []);

  return (
    <div className="mapa-contenedor">
      <p className="mapa-parrafo">
        {" "}
        Puedes mostrar u ocultar los distintos tipos de lugares en el mapa
        utilizando los siguientes filtros:
      </p>
      {/* Filtros */}
      <div className="mapa-filtro">
        {/* <label> */}
        {/* <input
            type="checkbox"
            checked={filtros.cafeterias}
            onChange={() =>
              setFiltros((prev) => ({ ...prev, cafeterias: !prev.cafeterias }))
            }
          />
          Cafeterías */}
        {/* </label>{" "} */}
        <label>
          <input
            type="checkbox"
            checked={filtros.hoteles}
            onChange={() =>
              setFiltros((prev) => ({ ...prev, hoteles: !prev.hoteles }))
            }
          />
          Hoteles
        </label>{" "}
        {/* <label>
          <input
            type="checkbox"
            checked={filtros.bares}
            onChange={() =>
              setFiltros((prev) => ({ ...prev, bares: !prev.bares }))
            }
          />
          Bares
        </label>{" "} */}
        <label>
          <input
            type="checkbox"
            checked={filtros.puntosDeInteres}
            onChange={() =>
              setFiltros((prev) => ({
                ...prev,
                puntosDeInteres: !prev.puntosDeInteres,
              }))
            }
          />
          Puntos de Interés
        </label>{" "}
        <label>
          <input
            type="checkbox"
            checked={filtros.Casino}
            onChange={() =>
              setFiltros((prev) => ({ ...prev, Casino: !prev.Casino }))
            }
          />
          Casino
        </label>
        <label>
          <input
            type="checkbox"
            checked={filtros.restauranteOSM}
            onChange={() =>
              setFiltros((prev) => ({
                ...prev,
                restauranteOSM: !prev.restauranteOSM,
              }))
            }
          />
          Restaurantes
        </label>{" "}
        <label>
          <input
            type="checkbox"
            checked={filtros.barOSM}
            onChange={() =>
              setFiltros((prev) => ({
                ...prev,
                barOSM: !prev.barOSM,
              }))
            }
          />
          Bares
        </label>
      </div>
      {/* Leyenda de íconos */}
      <div className="mapa-leyenda">
        <strong>🗺️ Leyenda de íconos:</strong>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          <li>
            <img
              src="https://cdn-icons-png.flaticon.com/512/139/139899.png"
              width="30"
            />{" "}
            Hotel
          </li>
          <li>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2651/2651172.png"
              width="30"
            />{" "}
            Punto de interés
          </li>
          <li>
            <img
              src="https://cdn-icons-png.flaticon.com/512/5971/5971903.png"
              width="30"
            />{" "}
            Casino
          </li>
          <li>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
              width="30"
            />{" "}
            Restaurante
          </li>
          <li>
            <img
              src="https://images.icon-icons.com/3015/PNG/512/beer_drink_glass_jar_icon_188550.png"
              width="20"
            />{" "}
            Bar
          </li>
        </ul>
      </div>
      <div
        style={{
          height: "90vh",
          width: "90%",
          maxWidth: "800px",
          margin: "0 auto",
          padding: "10px",
          boxSizing: "border-box",
        }}
      >
        <div className="mapa-wrapper">
          <MapContainer
            center={[41.1167, 1.2554]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors & CartoDB'
            />

            <MarkerClusterGroup
              maxClusterRadius={20}
              disableClusteringAtZoom={20}
            >
              {puntos
                .filter((p) => filtros[p.tipo])
                .map((punto, idx) => (
                  <Marker
                    key={idx}
                    position={punto.coordenadas}
                    icon={iconos[punto.tipo]}
                  >
                    <Popup>
                      <strong>{punto.nombre}</strong>
                      {punto.descripcion !== "Información no disponible" &&
                        punto.descripcion !== "Descripción no disponible" && (
                          <>
                            <br />
                            {punto.descripcion}
                          </>
                        )}
                      {punto.link && (
                        <>
                          <br />
                          <a href={punto.link} target="_blank" rel="noopener noreferrer">
                            Visitar sitio web
                          </a>
                        </>
                      )}
                    </Popup>

                  </Marker>
                ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Mapa;
