import React from 'react';
import './Eventos.css';
import { Link } from "react-router-dom";


import hoguera from '../assets/hoguera.jpg';
import fuegos from '../assets/fuegos.jpg';
import tarracoViva from '../assets/tarraco-viva.jpg';
import castells from '../assets/castells.jpg';
import campdemart from '../assets/Campdemart.jpg';
import santmagi from '../assets/santmagi.jpg';
import dixieland from '../assets/dixieland.jpg';
import TarraTangueando from '../assets/TarraTangueando.jpg';
import SantaTecla from '../assets/SantaTecla.jpg';
import URSI from '../assets/URSI.jpg';



const eventosMensuales = [
  {
    mes: "Junio",
    eventos: [
      {
        titulo: "Castells semanales",
        descripcion: "Exhibiciones tradicionales de torres humanas.",
        imagen: castells
      },
      {
        titulo: "Nit de Sant Joan",
        descripcion: "Celebración con hogueras, música y fuegos artificiales.",
        imagen: hoguera
      }
    ]
  },
  {
    mes: "Julio",
    eventos: [
      {
        titulo: "Concurso de Fuegos Artificiales",
        descripcion: "Competencia pirotécnica en la playa.",
        imagen: fuegos
      },
      {
        titulo: "Festival Camp de Mart",
        descripcion: "Festival cultural con música y teatro al aire libre.",
        imagen: campdemart
      }
    ]
  },
  {
    mes: "Agosto",
    eventos: [
      {
        titulo: "Sant Magí",
        descripcion: "Fiestas patronales con procesiones y conciertos.",
        imagen: santmagi
      },
      {
        titulo: "Dixieland",
        descripcion: "Festival de jazz tradicional.",
        imagen: dixieland
      },
      {
        titulo: "TarraTangueando",
        descripcion: "Encuentro de tango con talleres y espectáculos.",
        imagen: TarraTangueando
      }
    ]
  },
  {
    mes: "Septiembre",
    eventos: [
      {
        titulo: "Santa Tecla",
        descripcion: "Gran fiesta mayor con actos tradicionales y fuegos.",
        imagen: SantaTecla
      },
      {
        titulo: "URSI",
        descripcion: "Encuentro artístico urbano con intervenciones creativas.",
        imagen: URSI
      },
      {
        titulo: "Espectáculos en el Palau & cultura científica",
        descripcion: "Eventos culturales y divulgación científica.",
        imagen: tarracoViva
      }
    ]
  }
];

function Eventos() {
  return (
    <div className="eventos-container">
      <h1>Eventos mensuales en Tarragona</h1>
      {eventosMensuales.map((grupo, idx) => (
        <div key={idx}>
          <h2>{grupo.mes}</h2>
          <div className="evento-grid">
            {grupo.eventos.map((evento, i) => (
              evento.imagen ? (
                <Link
                  to={`/eventos/${encodeURIComponent(evento.titulo)}`}
                  key={i}
                  className="evento-card"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <img src={evento.imagen} alt={evento.titulo} />
                  <div className="evento-info">
                    <h3>{evento.titulo}</h3>
                    <p>{evento.descripcion}</p>
                  </div>
                </Link>

              ) : (
                <div className="evento-card evento-sin-imagen" key={i}>
                  <div className="evento-info no-img">
                    <h3>{evento.titulo}</h3>
                    <p>{evento.descripcion}</p>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Eventos;