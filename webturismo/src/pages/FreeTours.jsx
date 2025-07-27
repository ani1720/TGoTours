import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./FreeTours.css";

const FreeTours = () => {
  const { usuario, rol, cargando } = useUser();
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      const snapshot = await getDocs(collection(db, "freeTours"));

      const toursData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const tour = { id: docSnap.id, ...docSnap.data() };

          // 🔍 Obtener foto del guía desde la colección 'usuarios'
          let guiaFoto = "";
          if (tour.guiaID) {
            const guiaRef = doc(db, "usuarios", tour.guiaID);
            const guiaSnap = await getDoc(guiaRef);
            if (guiaSnap.exists()) {
              guiaFoto = guiaSnap.data().fotoURL || "";
            }
          }

          return {
            ...tour,
            guiaFoto,
          };
        })
      );

      setTours(toursData);
    };

    fetchTours();
  }, []);

  if (cargando) return null;

  return (
    <div className="free-tours">
      <h2>🌍 Free Tours disponibles</h2>

      {usuario && rol === "guia" && (
        <Link to="/crear-tour">
          <button className="crear-tour-btn">+ Crear nuevo tour</button>
        </Link>
      )}

      <ul>
        {tours.map((tour) => (
          <li key={tour.id} className="tour-card">
            <h3>{tour.titulo}</h3>
            <p>{tour.descripcion}</p>
            <p>
              <strong>Duración:</strong> {tour.duracion}
            </p>
            <p>
              <strong>Fecha:</strong> {tour.fecha}
            </p>
            <p>
                <strong>Hora de inicio:</strong> {tour.horaInicio}
            </p>
            <p>
              <strong>Ubicación:</strong> {tour.ubicacion}
            </p>
            <p>
              <strong>Cupos disponibles:</strong> {tour.cupos}
            </p>
            <p>
              <strong>Inscritos:</strong> {tour.inscritos?.length || 0}
            </p>

            {/* 🧑‍💼 Info del guía */}
            <div
              className="guia-info"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              {tour.guiaFoto && (
                <img
                  src={tour.guiaFoto}
                  alt={`Foto de ${tour.guiaNombre}`}
                  className="guia-foto"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
              <span className="guia-nombre">{tour.guiaNombre}</span>{" "}
            </div>

            {usuario && rol === "turista" && (
              <Link to={`/reservar/${tour.id}`}>
                <button className="reservar-btn">Reservar plaza</button>{" "}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FreeTours;
