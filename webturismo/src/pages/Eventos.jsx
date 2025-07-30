import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Link } from "react-router-dom";

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
          const mesRef = collection(db, "eventos", mes, mes);
          const snapshot = await getDocs(mesRef);

          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            nuevosEventos[mes] = { id: doc.id, ...doc.data() };
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
      <div className="flex flex-wrap justify-center gap-10 pb-20">
        {meses.map((mes) => {
          const evento = eventosDestacados[mes];
          return (
            <div key={mes} className="text-center">
              <Link to={`/eventos/${mes}`}>
                {evento?.imagenUrl && (
                  <img
                    src={evento.imagenUrl}
                    alt={evento.nombre}
                    className="w-80 h-52 object-cover rounded-xl"
                  />
                )}
                <h3 className="text-2xl font-bold mt-3 capitalize text-[#4F46E5]">
                  {mes}
                </h3>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Eventos;
