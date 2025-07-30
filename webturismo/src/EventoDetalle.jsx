import { useState } from "react";
import { useNavigate } from "react-router-dom";
import castells from './assets/castells.jpg';
import collaJove from './assets/colla-jove.jpg';
import xiquetsTgn from './assets/xiquets-tarragona.jpg';
import xiquetsSP from './assets/xiquets-santpere.jpg';
import collaSerrallo from './assets/colla-serrallo.jpg';

const eventoCastells = {
  titulo: "Castells semanales",
  descripcion: "Las collas castelleras son agrupaciones culturales que construyen torres humanas. Cada colla tiene su identidad, colores y tradiciones. Esta tradición nació en Cataluña en el siglo XVIII y simboliza cooperación, esfuerzo colectivo y orgullo local. Tarragona acoge algunas de las colles más destacadas.",
  imagen: castells,
  lugares: [
    {
      nombre: "Colla Jove Xiquets de Tarragona",
      imagen: collaJove,
      resumen: "Una de las colles más importantes y jóvenes.",
      detalles: "Fundada en 1979, destaca por sus castells de gran dificultad y por su camisa color vino.",
      horario: "Ensayos: Martes y Viernes 20:00",
      ubicacion: "Carrer del Cós del Bou, Tarragona"
    },
    {
      nombre: "Xiquets de Tarragona",
      imagen: xiquetsTgn,
      resumen: "La colla más antigua de Tarragona.",
      detalles: "Fundada en 1885. Conocida por su camisa blanca y sus grandes castells en la Plaça de les Cols.",
      horario: "Ensayos: Miércoles y Viernes 20:00",
      ubicacion: "Carrer Santa Anna, Tarragona"
    },
    {
      nombre: "Colla Castellera Sant Pere i Sant Pau",
      imagen: xiquetsSP,
      resumen: "Colla del barrio de Sant Pere i Sant Pau.",
      detalles: "Creada en 1990, destacan por sus castells sólidos y su gran cohesión de grupo.",
      horario: "Ensayos: Martes y Jueves 19:30",
      ubicacion: "Centre cívic de SPiSP, Tarragona"
    },
    {
      nombre: "Colla Castellera del Serrallo",
      imagen: collaSerrallo,
      resumen: "Colla del barrio marinero del Serrallo.",
      detalles: "Fundada en 1988. Conocida por su camisa azul marino y fuerte vinculación con el puerto.",
      horario: "Ensayos: Miércoles y Viernes 20:00",
      ubicacion: "Moll de Costa, Tarragona"
    }
  ]
};

function EventoDetalle() {
  const [selectedLugar, setSelectedLugar] = useState(eventoCastells.lugares[0]);
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "fixed",
          top: "160px",
          left: "80%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          padding: "10px 20px",
          backgroundColor: "#ffffff",
          color: "#000",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          opacity: 0.3,
          transition: "opacity 0.3s ease, transform 0.2s ease"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.3)}
      >
        ← Volver atrás
      </button>

      <h1>{eventoCastells.titulo}</h1>
      <img
        src={eventoCastells.imagen}
        alt={eventoCastells.titulo}
        style={{
          width: "100%",
          maxHeight: "400px",
          objectFit: "cover",
          margin: "1rem 0"
        }}
      />
      <p style={{ fontSize: "1.2rem" }}>{eventoCastells.descripcion}</p>

      <div style={{ marginTop: "3rem" }}>
        <h2>Collas castelleras de Tarragona</h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "2rem"
          }}
        >
          {eventoCastells.lugares.map((lugar, i) => (
            <img
              key={i}
              src={lugar.imagen}
              alt={lugar.nombre}
              onClick={() => setSelectedLugar(lugar)}
              style={{
                width: "120px",
                height: "90px",
                borderRadius: "10px",
                cursor: "pointer",
                border:
                  lugar.nombre === selectedLugar.nombre
                    ? "3px solid #0077cc"
                    : "2px solid transparent",
                objectFit: "cover"
              }}
            />
          ))}
        </div>

        {selectedLugar && (
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              padding: "1.5rem",
              borderRadius: "15px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
              flexWrap: "wrap",
              alignItems: "center",
              color: "#000"
            }}
          >
            <img
              src={selectedLugar.imagen}
              alt={selectedLugar.nombre}
              style={{
                width: "240px",
                borderRadius: "12px",
                objectFit: "cover"
              }}
            />
            <div style={{ maxWidth: "500px" }}>
              <h3 style={{ marginBottom: "0.5rem" }}>{selectedLugar.nombre}</h3>
              <p>{selectedLugar.resumen}</p>
              <p><strong>Detalles:</strong> {selectedLugar.detalles}</p>
              <p><strong>Horario:</strong> {selectedLugar.horario}</p>
              <p><strong>Ubicación:</strong> {selectedLugar.ubicacion}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventoDetalle;
