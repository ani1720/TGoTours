import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "./RutaList.css";

const RutaList = () => {
  const [rutas, setRutas] = useState([]);
  useEffect(() => {
    const cargarRutas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "rutas"));
        const rutasData = [];
        querySnapshot.forEach((doc) => rutasData.push(doc.data()));
        setRutas(rutasData);
        console.log("Rutas cargadas:", rutasData);
      } catch (error) {
        console.error("Error al cargar rutas desde Firebase:", error);
      }
    };
    cargarRutas();
  }, []);
  return (
    <div className="pantalla-completa">
      <div className="vertical-layout">
        <h1>Explora Rutas en Tarragona</h1>

        <section className="rutas-diagonales">
         {rutas
            .filter((ruta) =>
              ["ruta1", "ruta2", "ruta3"].includes(ruta.id)
            )
            .map((ruta) => (
              <Link
                to={`/rutas/${ruta.clave || ruta.id || ruta.nombre}`}
                key={ruta.clave || ruta.id || ruta.nombre}
                className="tarjeta-diagonal"
                style={{ textDecoration: "none", color: "inherit" }}
              >
              <img
                src={ruta.imagen}
                alt={ruta.nombre}
                style={{ cursor: "pointer" }}
              />
              <div className="contenido">
                <h2>{ruta.nombre}</h2>
                {/* <p><strong>Duración:</strong> {ruta.duracion}</p> */}
                <p><strong>Tipo:</strong> {ruta.tipo}</p>
                <p><strong>Incluye:</strong></p>
                <ul>
                  {ruta.contenido?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
};

export default RutaList;
