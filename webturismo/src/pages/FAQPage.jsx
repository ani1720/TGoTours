import React from 'react';
import { Link } from 'react-router-dom'; // si usas React Router

const FAQPage = () => {
  return (
    <div className="faq-container">
      <h1>Preguntas Frecuentes</h1>
      <p>¿Tienes dudas? Aquí respondemos las más comunes sobre nuestra plataforma.</p>

      <div className="faq-list">
        <div className="faq-item">
          <h3>¿Qué tipo de contenido ofrece esta web?</h3>
          <p>Ofrecemos recursos educativos, herramientas interactivas y artículos especializados para ayudarte a aprender y explorar.</p>
        </div>

        <div className="faq-item">
          <h3>¿Necesito crear una cuenta para acceder?</h3>
          <p>Algunos contenidos están disponibles sin registro, pero para acceder a funciones avanzadas y guardar tu progreso, es necesario crear una cuenta gratuita.</p>
        </div>

        <div className="faq-item">
          <h3>¿Cómo puedo recuperar mi contraseña?</h3>
          <p>En la página de inicio de sesión, haz clic en “¿Olvidaste tu contraseña?” y sigue los pasos para restablecerla.</p>
        </div>

        <div className="faq-item">
          <h3>¿Puedo colaborar con contenido o sugerencias?</h3>
          <p>¡Sí! Nos encanta recibir ideas. Puedes enviarlas a través del formulario de contacto.</p>
        </div>

        <div className="faq-item">
          <h3>¿Dónde puedo ver las novedades o actualizaciones?</h3>
          <p>Publicamos noticias y actualizaciones en nuestra sección de blog y redes sociales.</p>
        </div>
      </div>

      <div className="faq-contact">
        <h2>¿No encontraste lo que buscabas?</h2>
        <p>Si tu pregunta no está aquí, puedes contactarnos directamente.</p>
        <Link to="/contacto" className="contact-button">Ir al formulario de contacto</Link>
      </div>
    </div>
  );
};

export default FAQPage;
