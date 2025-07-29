import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // si usas React Router
import './FAQPage.css'; // Asegúrate de tener este archivo CSS para estilos

const faqs = [
  {
    pregunta: "¿Cuál es la mejor época para visitar Tarragona?",
    respuesta:
      "La primavera y el otoño ofrecen temperaturas agradables y menos aglomeraciones. El verano es ideal para disfrutar de las playas.",
  },
  {
    pregunta: "¿Necesito reservar para visitar los monumentos?",
    respuesta:
      "Algunos monumentos requieren reserva previa, especialmente en temporada alta. Recomendamos consultar la web oficial de turismo.",
  },
  {
    pregunta: "¿Hay opciones de turismo accesible?",
    respuesta:
      "Sí, muchos espacios están adaptados para personas con movilidad reducida. Puedes activar el modo accesible en nuestra web para más información.",
  },
  {
    pregunta: "¿Dónde puedo encontrar rutas guiadas?",
    respuesta:
      "Ofrecemos rutas guiadas temáticas de todo tipo que puedes consultar en el apartado 'Rutas'.",
  },
  {
    pregunta: "¿Dónde puedo reservar free tours?",
    respuesta:
      "Ofrecemos free tours de diferentes tipos, temáticas y duraciones. Puedes reservar directamente en nuestra sección 'Free Tours'.",
  },
  {
    pregunta: "¿Puedo tambien trabajar con vosotros como guia de free tours?",
    respuesta:
      "Sí, puedes registrarte como 'guia' para poder realizar free tours con nosotros. Puedes publicar tus tours directamente en nuestra sección 'Free Tours'",
  },
];

const FAQPage  = () => {
  const [activo, setActivo] = useState(null);

  const toggle = (index) => {
    setActivo(activo === index ? null : index);
  };

  return (
    <div className="faq-page">
      <h2>❓ Preguntas Frecuentes</h2>
      <p>Resolvemos tus dudas más comunes sobre turismo en Tarragona.</p>

      <div className="faq-list">
        {faqs.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${activo === index ? "activo" : ""}`}
            onClick={() => toggle(index)}
          >
            <div className="faq-pregunta">{item.pregunta}</div>
            {activo === index && <div className="faq-respuesta">{item.respuesta}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage ;