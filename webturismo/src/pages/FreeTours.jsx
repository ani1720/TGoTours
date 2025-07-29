import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./FreeTours.css";
import { reservarPlaza } from "../utils/reservarPlaza";
import { cancelarReserva } from "../utils/cancelarReserva";

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
      {usuario && rol === "turista" && (
  <div className="explicacion-guia">
    <h3>🌍 ¿Qué son los Free Tours?</h3>

    <div className="guia-section">
      <h4>🎒 Explora la ciudad con guías locales</h4>
      <p>
        Los Free Tours son recorridos guiados por expertos locales que te muestran lo mejor de la ciudad: historia, cultura, curiosidades y rincones secretos. Son una forma auténtica y enriquecedora de conocer el destino.
      </p>
    </div>

    <div className="guia-section">
      <h4>💸 Tú decides cuánto pagar</h4>
      <p>
        Al finalizar el tour, tú decides cuánto pagar según tu experiencia y presupuesto. Algunos tours también tienen un coste fijo muy accesible. ¡Sin sorpresas ni tarifas ocultas!
      </p>
    </div>

    <div className="guia-section">
      <h4>📍 Tours temáticos y personalizados</h4>
      <p>
        Puedes elegir entre diferentes tipos de tours: históricos, gastronómicos, de arte urbano, leyendas locales, rutas nocturnas y más. ¡Encuentra el que mejor se adapte a tus intereses!
      </p>
    </div>

    <div className="guia-section">
      <h4>📆 Reserva fácil y rápida</h4>
      <p>
        Solo tienes que seleccionar el tour que te interesa, elegir la fecha y confirmar tu reserva. Recibirás todos los detalles por correo electrónico y podrás contactar con el guía si lo necesitas.
      </p>
    </div>

    <div className="guia-section">
      <h4>⭐ Experiencias valoradas por otros viajeros</h4>
      <p>
        Todos los tours tienen reseñas y calificaciones de otros turistas. Así puedes elegir con confianza y asegurarte una experiencia de calidad.
      </p>
    </div>
  </div>
)}

{usuario && rol === "guia" && (
  <div className="explicacion-guia">
    <h3>🗺️ ¿Quieres ofrecer tus propios Free Tours?</h3>

    <div className="guia-section">
      <h4>📌 ¿Cómo funciona?</h4>
      <p>
        Si estás enamorado de tu ciudad, conoces sus rincones y quieres compartir tu conocimiento con turistas mientras ganas dinero extra, ¡crear un tour gratuito o low cost es la opción perfecta!
      </p>
    </div>

    <div className="guia-section">
      <h4>🛠️ Crea tu propio tour</h4>
      <p>
        ¿Conoces lugares únicos, arte callejero, historia local o gastronomía tradicional? Sea cual sea tu especialidad, diseña un recorrido personalizado y compártelo con el mundo.
      </p>
    </div>

    <div className="guia-section">
      <h4>📬 Recibe reservas</h4>
      <p>
        Una vez verificada tu cuenta y aprobado tu tour, empezarás a recibir reservas confirmadas directamente en tu correo. Tendrás acceso a los datos de los participantes y podrás comunicarte con ellos antes del tour.
      </p>
    </div>

    <div className="guia-section">
      <h4>🤝 Reúnete con los visitantes</h4>
      <p>
        Encuéntrate con los viajeros en el punto de encuentro, muéstrales la ciudad, comparte historias y leyendas, y ofrece recomendaciones locales. Las buenas reseñas aumentan tu visibilidad y tus ingresos.
      </p>
    </div>

    <div className="guia-section">
      <h4>💰 Gana dinero</h4>
      <p>
        Cuanto más valor aportes, más reservas recibirás. ¡Convierte tu pasión por tu ciudad en una fuente de ingresos!
      </p>
    </div>
  </div>
)}


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
              <>
                {tour.inscritos?.includes(usuario.uid) ? (
                  <button
                    className="cancelar-btn"
                    onClick={async () => {
                      const confirmar = window.confirm(
                        "¿Seguro que quieres cancelar tu inscripción?"
                      );
                      if (!confirmar) return;

                      const resultado = await cancelarReserva(tour.id);
                      if (resultado === "ok") {
                        setTours((prevTours) =>
                          prevTours.map((t) =>
                            t.id === tour.id
                              ? {
                                  ...t,
                                  cupos: t.cupos + 1,
                                  inscritos: t.inscritos.filter(
                                    (id) => id !== usuario.uid
                                  ),
                                }
                              : t
                          )
                        );
                      }
                    }}
                  >
                    Cancelar inscripción
                  </button>
                ) : (
                  <button
                    className="reservar-btn"
                    onClick={async () => {
                      const resultado = await reservarPlaza(tour.id);
                      if (resultado === "ok") {
                        setTours((prevTours) =>
                          prevTours.map((t) =>
                            t.id === tour.id
                              ? {
                                  ...t,
                                  cupos: t.cupos - 1,
                                  inscritos: [
                                    ...(t.inscritos || []),
                                    usuario.uid,
                                  ],
                                }
                              : t
                          )
                        );
                      }
                    }}
                    disabled={tour.cupos <= 0}
                  >
                    {tour.cupos <= 0 ? "Sin cupos" : "Reservar plaza"}
                  </button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FreeTours;
