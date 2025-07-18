import rutaTarracoImg from "./assets/ruta-tarraco.png";
import anfiteatroImg from "./assets/anfiteatro.jpg";
import catedralImg from "./assets/catedral.jpg";
import murallasImg from "./assets/murallas.jpg";
import plazaReiImg from "./assets/plaza-rei.jpg";
import balconImg from "./assets/balcon.jpg";
import { useState } from "react";
import "./App.css";
import MapView from "./WebView";

function Home() {
  const lugares = [
    {
      id: 1,
      nombre: "Anfiteatro",
      img: anfiteatroImg,
      descripcion: "Antiguo anfiteatro romano frente al mar.",
    },
    {
      id: 2,
      nombre: "Catedral",
      img: catedralImg,
      descripcion: "Impresionante catedral gótica en el corazón de Tarragona.",
    },
    {
      id: 3,
      nombre: "Murallas",
      img: murallasImg,
      descripcion: "Murallas romanas que protegían la antigua ciudad.",
    },
    {
      id: 4,
      nombre: "Plaça del Rei",
      img: plazaReiImg,
      descripcion: "Plaza central con gran valor histórico.",
    },
    {
      id: 5,
      nombre: "Balcón Mediterráneo",
      img: balconImg,
      descripcion: "Mirador con vistas al mar Mediterráneo.",
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedLugar, setSelectedLugar] = useState(null);

  return (
    <>
      <div className="mapa-info-container">
        <div className="info">
          <h1>Turismo en Tarragona</h1>
          <p>
            Bienvenido a nuestra plataforma de turismo inteligente en Tarragona.
            Aquí descubrirás las rutas culturales más importantes, información
            histórica y servicios útiles como restaurantes, zonas wifi,
            transporte y más.
          </p>
          <p>
            Nuestra misión es ayudarte a explorar los lugares emblemáticos de la
            ciudad con mapas interactivos, curiosidades culturales y
            recomendaciones personalizadas.
          </p>

          <p>
            <strong>Descripción:</strong> Esta aplicación interactiva permite a
            los usuarios explorar el patrimonio histórico y cultural de
            Tarragona a través de una ruta guiada con imágenes, descripciones
            detalladas, mapas y horarios.
          </p>
          <p>
            <strong>Servicios:</strong> Ofrecemos un tour turístico
            personalizado que se adapta al ritmo de cada persona. Disfruta de la
            historia, los secretos y rincones emblemáticos de Tarragona a tu
            manera.
          </p>
        </div>
      </div>

      <div className="mapa">
        <h2>RUTA HISTÓRICA ANTIGUO TARRACO</h2>
        <MapView/>
      </div>

      {/* <div className="App">
        <RouteGenerator />
      </div> */}

      <div className="slider-wrapper">
        {lugares.map((lugar, i) => (
          <img
            key={i}
            src={lugar.img}
            alt={lugar.nombre}
            className={`slider-item ${hoveredIndex === i ? "active" : ""}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setSelectedLugar(lugar)}
          />
        ))}
      </div>

      {selectedLugar && (
        <div className="card-detalle">
          <div className="card-imagen">
            <img src={selectedLugar.img} alt={selectedLugar.nombre} />
          </div>
          <div className="card-info">
            <h2>{selectedLugar.nombre}</h2>
            <p>{selectedLugar.descripcion}</p>
            <p>
              <strong>Detalles:</strong> Este sitio es uno de los puntos más
              destacados de la ruta turística por Tarragona. Ideal para visitas
              culturales, actividades al aire libre y vistas panorámicas.
            </p>
            <p>
              <strong>Horario:</strong> 10:00 - 18:00 (todos los días)
            </p>
            <p>
              <strong>Ubicación:</strong> Tarragona centro histórico
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
