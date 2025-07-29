import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "./RutaList.css";

const RutaList = () => {
  const [rutas, setRutas] = useState([]);
  const tipos = ["Montaña", "Histórica", "Playa"];
  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Rutas"));
        const rutasFirebase = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRutas(rutasFirebase);
      } catch (error) {
        console.error("❌ Error al cargar rutas desde Firebase:", error);
      }
    };

    fetchRutas();
  }, []);

  return (
  <div className="pantalla-completa">
    <div className="vertical-layout">
      <h1>Explora Rutas en Tarragona</h1>

      {tipos.map((tipo) => {
        const rutasPorTipo = rutas.filter((ruta) => ruta.tipo === tipo).slice(0, 3);

        if (rutasPorTipo.length === 0) return null;

        return (
          <section key={tipo}>
            <h2>{tipo}</h2>
            <div className="rutas-diagonales">
              {rutasPorTipo.map((ruta) => (
                <Link
                  to={`/rutas/${ruta.id}`}
                  key={ruta.id}
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
            </div>
          </section>
        );
      })}
    </div>
  </div>
);
};

export default RutaList;
