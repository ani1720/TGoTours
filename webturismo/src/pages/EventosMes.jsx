import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import styles from "./EventosMes.module.css";

const subcolecciones = ["castells", "santjoan", "fuegos", "bailes", "cavalcada", "carnaval", "temporada", "semana", "tarraco", "santmagi", "santatecla", "octubre", "noviembre"];

const EventosMes = () => {
  const { mes } = useParams();
  const [eventos, setEventos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerEventos = async () => {
      try {
        const eventosMes = [];

        for (const subcoleccion of subcolecciones) {
          const ref = collection(db, `eventos/${mes}/${subcoleccion}`);
          const snap = await getDocs(ref);

          snap.forEach((doc) => {
            eventosMes.push(doc.data());
          });
        }

        setEventos(eventosMes);
      } catch (error) {
        console.error("Error obteniendo eventos:", error);
      }
    };

    obtenerEventos();
  }, [mes]);

  return (
    <div className={styles.contenedor}>
      <div className={styles.header}>
        <button className={styles.botonVolverFijo} onClick={() => navigate(-1)}>
          ← Volver atrás
        </button>
      </div>

      {eventos.length === 0 ? (
        <p className={styles.mensajeVacio}>No hay eventos registrados para este mes.</p>
      ) : (
        eventos.map((evento, index) => (
          <div key={index} className={styles.card}>
            <img
              src={evento.imagenUrl}
              alt={evento.nombre}
              className={styles.imagen}
              onClick={() => {
                if (evento.nombre.toLowerCase().includes("castells")) {
                  navigate("/evento/castells");
                }
              }}
              style={{ cursor: "pointer" }}
            />
            <h3 className={styles.nombre}>{evento.nombre}</h3>
            <p className={styles.fecha}>{evento.fecha}</p>
            <p className={styles.descripcion}>{evento.descripcion}</p>
            {evento.enlace && (
              <a
                href={evento.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.enlace}
              >
                Más información →
              </a>
            )}

          </div>
        ))
      )}
    </div>
  );
};

export default EventosMes;
