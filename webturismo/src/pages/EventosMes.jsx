
import React from 'react';
import './Eventos.css';

const eventosMensuales = [
  {
    mes: "Junio",
    eventos: [
      {
        titulo: "Castells semanales",
        descripcion: "Exhibiciones tradicionales de torres humanas."
      },
      {
        titulo: "Nit de Sant Joan",
        descripcion: "Celebración con hogueras, música y fuegos artificiales."
      }
    ]
  },
  {
    mes: "Julio",
    eventos: [
      {
        titulo: "Concurso de Fuegos Artificiales",
        descripcion: "Competencia pirotécnica en la playa."
      },
      {
        titulo: "Festival Camp de Mart",
        descripcion: "Festival cultural con música y teatro al aire libre."
      }
    ]
  },
  {
    mes: "Agosto",
    eventos: [
      {
        titulo: "Sant Magí",
        descripcion: "Fiestas patronales con procesiones y conciertos."
      },
      {
        titulo: "Dixieland",
        descripcion: "Festival de jazz tradicional."
      },
      {
        titulo: "TarraTangueando",
        descripcion: "Encuentro de tango con talleres y espectáculos."
      }
    ]
  },
  {
    mes: "Septiembre",
    eventos: [
      {
        titulo: "Santa Tecla",
        descripcion: "Gran fiesta mayor con actos tradicionales y fuegos."
      },
      {
        titulo: "URSI",
        descripcion: "Encuentro artístico urbano con intervenciones creativas."
      },
      {
        titulo: "Espectáculos en el Palau & cultura científica",
        descripcion: "Eventos culturales y divulgación científica."
      }
    ]
  }
];

function EventosMes() {
  return (
    <div className="eventos-container">
      <h1>Eventos mensuales en Tarragona</h1>
      {eventosMensuales.map((grupo, idx) => (
        <div key={idx}>
          <h2>{grupo.mes}</h2>
          <ul className="evento-lista">
            {grupo.eventos.map((evento, i) => (
              <li key={i}>
                <h3>{evento.titulo}</h3>
                <p>{evento.descripcion}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default EventosMes;
