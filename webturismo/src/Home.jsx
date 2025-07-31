import rutaTarracoImg from "/assets/ruta-tarraco.png";
import anfiteatroImg from "/assets/anfiteatro.jpg";
import catedralImg from "/assets/catedral.jpg";
import murallasImg from "/assets/murallas.jpg";
import plazaReiImg from "/assets/plaza-rei.jpg";
import balconImg from "/assets/balcon.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import Logo from "/assets/Logo2.png";
import IconMap from "/assets/mapa.png";
import IconLugar from "/assets/restos.png";
import IconCamara from "/assets/camara.png";
import IconForo from "/assets/foro.png";
import eventos from "/assets/eventos.png";
import freetours from "/assets/freetours.png";
import dani from "/assets/dani.jpg";
import adria from "/assets/adria.jpg";
import ani from "/assets/ani.jpg";
import "./App.css";
import MapView from "./WebView";
import mapaHome from "/assets/mapahome.png";

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
      nombre: "Passeig Arqueològic",
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
  const navigate = useNavigate();

  return (
    <>
   
      <div className="mapa-info-container">
        <div className="mapa">
          <h2> Mapa de Rutas</h2>
          <p> Rutas planificada para conocer Tarragona</p>
          <img
            src={mapaHome}
            alt="Ruta Romana en Tarragona"
            style={{
              width: "100%",
              maxWidth: "600px",
              margin: "1rem auto",
              display: "block",
              borderRadius: "8px",
            }}
          />
        </div>

        <div className="info">
          <h1>Turismo en Tarragona</h1>
          <p>“Una plataforma de turismo inteligente en Tarragona.”</p>
          <span className="servicios-label">Servicios</span>
          
          <button onClick={() => navigate("/rutas")}>
            Rutas y mapas interactivos
          </button>

          <button
        
            onClick={() => navigate("/eventos")}
          >
            Eventos culturales y puntos de interés
          </button>

          <button
            onClick={() => navigate("/tours")}
          >
            FreeTours
          </button>

          <button
            
            onClick={() => navigate("/comunidad")}
          >
            Comunidad
          </button>
        </div>
      </div>
      <div className="slider-wrapper">
        {lugares.map((lugar, i) => (
          <div key={i} className="slider-item-container">
            <img
              src={lugar.img}
              alt={lugar.nombre}
              className={`slider-item ${hoveredIndex === i ? "active" : ""}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedLugar(lugar)}
            />
          </div>
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
