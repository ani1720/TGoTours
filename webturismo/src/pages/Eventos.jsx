import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Link } from "react-router-dom";
import styles from "./Eventos.module.css"; // ✅ Importación del CSS Module

const meses = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

const Eventos = () => {
  const [eventosDestacados, setEventosDestacados] = useState({});

  useEffect(() => {
    const obtenerEventos = async () => {
      try {
        const nuevosEventos = {};

        for (const mes of meses) {
          const docRef = doc(db, "eventos", mes);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            nuevosEventos[mes] = { id: docSnap.id, ...docSnap.data() };
          }
        }

        setEventosDestacados(nuevosEventos);
      } catch (error) {
        console.error("Error al cargar eventos destacados:", error);
      }
    };

    obtenerEventos();
  }, []);

  return (
    <div className="bg-[#0B0C2A] min-h-screen text-white">
      <h2 className="text-5xl font-bold text-center pt-10 pb-10">Eventos por mes</h2>
      <div className={styles.gridContainer}>
        {meses.map((mes) => {
          const evento = eventosDestacados[mes];
          return (
            <Link to={`/eventos/${mes}`} key={mes} className={styles.card}>
              {evento?.imagenUrl && (
                <>
                  <span className={styles.tituloMes}>{mes}</span> {/* 🔽 Nombre visible */}
                  <img
                    src={evento.imagenUrl}
                    alt={evento.nombre || mes}
                    className={styles.image}
                  />
                  <div className={styles.contenido}>
                    {/* puedes añadir más info si quieres */}
                  </div>
                </>
              )}
            </Link>
          );
        })}
      </div>


    </div>
  );
};

export default Eventos;
