import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import './pages/Eventos.css';

import hoguera from './assets/hoguera.jpg';
import fuegos from './assets/fuegos.jpg';
import tarracoViva from './assets/tarraco-viva.jpg';
import castells from './assets/castells.jpg';
import campdemart from './assets/Campdemart.jpg';
import santmagi from './assets/santmagi.jpg';
import dixieland from './assets/dixieland.jpg';
import TarraTangueando from './assets/TarraTangueando.jpg';
import SantaTecla from './assets/SantaTecla.jpg';
import URSI from './assets/URSI.jpg';
import collaJove from './assets/colla-jove.jpg';
import xiquetsTgn from './assets/xiquets-tarragona.jpg';
import xiquetsSP from './assets/xiquets-santpere.jpg';
import collaSerrallo from './assets/colla-serrallo.jpg';



const eventosMensuales = [
  {
    mes: "Junio",
    eventos: [
      {
        titulo: "Castells semanales",
        descripcion: "Las collas castelleras son agrupaciones culturales que se dedican a construir castells o torres humanas. Cada colla tiene su propia identidad, colores y tradiciones, y está formada por castellers de todas las edades. Esta tradición nació en Cataluña en el siglo XVIII y con el tiempo se ha convertido en un símbolo de cooperación, esfuerzo colectivo y orgullo local. Tarragona acoge algunas de las colles más destacadas, y sus actuaciones son un punto clave de las fiestas populares.",
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
            imagen: collaSerrallo, // ← asegúrate de importar esta imagen
            resumen: "Colla del barrio marinero del Serrallo.",
            detalles: "Fundada en 1988. Conocida por su camisa azul marino y fuerte vinculación con el puerto y la tradición marinera.",
            horario: "Ensayos: Miércoles y Viernes 20:00",
            ubicacion: "Local de la Colla, Moll de Costa, Tarragona"
          },
        ]
      },
      {
        titulo: "Nit de Sant Joan",
        descripcion: "Celebración con hogueras, música y fuegos artificiales.",
        imagen: hoguera,
        lugares: [
          {
            nombre: "Platja del Miracle",
            imagen: fuegos,
            resumen: "Playa central donde se lanzan fuegos.",
            detalles: "Punto clave de la Nit de Sant Joan por sus celebraciones junto al mar.",
            horario: "Noche del 23 de junio",
            ubicacion: "Frente al centro de Tarragona"
          },
          {
            nombre: "Rambla Nova",
            imagen: URSI,
            resumen: "Paseo principal con ambientación festiva.",
            detalles: "Decorada y animada con música durante la verbena.",
            horario: "Todo el día",
            ubicacion: "Centro ciudad"
          }
        ]
      }
    ]
  },
  {
    mes: "Julio",
    eventos: [
      {
        titulo: "Concurso de Fuegos Artificiales",
        descripcion: "Competencia pirotécnica en la playa.",
        imagen: fuegos,
        lugares: [
          {
            nombre: "Balcó del Mediterrani",
            imagen: SantaTecla,
            resumen: "Mirador perfecto para ver los fuegos.",
            detalles: "Punto de observación por excelencia del concurso.",
            horario: "22:00",
            ubicacion: "Final de Rambla Nova"
          },
          {
            nombre: "Passeig Marítim",
            imagen: tarracoViva,
            resumen: "Paseo paralelo a la playa.",
            detalles: "Ideal para caminar y ver el espectáculo pirotécnico desde el nivel del mar.",
            horario: "Toda la tarde-noche",
            ubicacion: "Zona litoral"
          }
        ]
      }
    ]
  }
];

function EventoDetalle() {
  const { titulo } = useParams();
  const tituloDecodificado = decodeURIComponent(titulo);

  const eventoEncontrado = eventosMensuales
    .flatMap((grupo) => grupo.eventos)
    .find((evento) => evento.titulo === tituloDecodificado);

  const [selectedLugar, setSelectedLugar] = useState(eventoEncontrado?.lugares?.[0]);

  if (!eventoEncontrado) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Evento no encontrado</h2>
        <Link to="/eventos">Volver</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <Link to="/eventos" style={{ textDecoration: "none" }}>&larr; Volver</Link>
      <h1>{eventoEncontrado.titulo}</h1>
      <img
        src={eventoEncontrado.imagen}
        alt={eventoEncontrado.titulo}
        style={{ width: "100%", maxHeight: "400px", objectFit: "cover", margin: "1rem 0" }}
      />
      <p style={{ fontSize: "1.2rem" }}>{eventoEncontrado.descripcion}</p>

      {/* Lugares relacionados solo si existen */}
      {eventoEncontrado.lugares?.length > 0 && (
        <div style={{ marginTop: "3rem" }}>
          <h2>Lugares relacionados</h2>

          {/* Galería de miniaturas */}
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            {eventoEncontrado.lugares.map((lugar, i) => (
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
                  border: lugar.nombre === selectedLugar?.nombre ? "3px solid #0077cc" : "2px solid transparent",
                  objectFit: "cover"
                }}
              />
            ))}
          </div>

          {/* Info del lugar seleccionado */}
          {selectedLugar && (
            <div style={{
              display: "flex",
              gap: "1.5rem",
              padding: "1.5rem",
              borderRadius: "15px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
              flexWrap: "wrap",
              alignItems: "center",
              color: "#000"
            }}>
              <img
                src={selectedLugar.imagen}
                alt={selectedLugar.nombre}
                style={{ width: "240px", borderRadius: "12px", objectFit: "cover" }}
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
      )}
    </div>
  );
}

export default EventoDetalle;
