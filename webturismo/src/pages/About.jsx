import React from "react";
import Logo from "../assets/Logo2.png";
import IconMap from "../assets/mapa.png";
import IconLugar from "../assets/restos.png";
import IconCamara from "../assets/camara.png";
import IconForo from "../assets/foro.png";
import "./About.css";

const About = () => {
  return (
    <div className="about-wrapper">
      <div className="about-logo-section">
        <img src={Logo} alt="Logo TGO Tours" className="about-logo" />
      </div>

      <div className="about-content">
        <p>
          Bienvenido a <strong>TGoTours</strong>, una plataforma pensada para
          ayudarte a descubrir y disfrutar lo mejor de Tarragona.
        </p>

        <h2>¿Qué encontrarás aquí?</h2>
        <ul>
          <li>
            <img src={IconMap} alt="icono de mapa" /> Mapas interactivos con
            rutas peatonales optimizadas
          </li>
          <li>
            <img src={IconLugar} alt="icono de lugar" /> Puntos de interés
            destacados con información histórica
          </li>
          <li>
            <img src={IconCamara} alt="icono de camara" /> Imágenes y
            recomendaciones de cada lugar
          </li>
          <li>
            <img src={IconForo} alt="icono de foro" /> Foro donde puedes dejar
            tus comentarios o experiencias
          </li>
        </ul>
      </div>

      <div className="content-who">
        <h2>¿Quiénes somos?</h2>
        <p>
          Este proyecto nace con el objetivo de facilitar el turismo local,
          especialmente para quienes visitan Tarragona por primera vez o desean
          conocerla a fondo sin usar múltiples apps.
        </p>

        <p>
          Nuestro equipo está formado por amantes de la historia, la cultura de Tarragona y desarroladores entusiastas.
          Juntos hemos creado esta plataforma con la intención de conectar tecnología y patrimonio,
          permitiendo a cualquier persona descubrir la ciudad a pie, a su ritmo 
          y con información útil.
        </p>

        <p>
          Tarragona no solo es un museo al aire libre del pasado romano, también
          es mar, gastronomía, arte y vida local. Queremos ayudarte a vivir esa
          riqueza con rutas pensadas para que cada paso cuente una historia.
        </p>

        <h2>¿Cómo funciona?</h2>
        <p>
          Elige una ruta dependiendo de lo que desees hacer desde nuestro menú
          de rutas donde tendras divertidas y entretenidas opciones. Podrás ver
          los puntos destacados, un mapa en tiempo real y comentarios de otros
          visitantes.
        </p>

        <h2>¿Tienes sugerencias?</h2>
        <p>
          Estamos en constante mejora. Si tienes ideas, correcciones o quieres
          colaborar, puedes escribirnos a:{" "}
          <a
            href="mailto:contacto@tarracoexplorer.com"
            style={{ color: "#81c7ff", textDecoration: "underline" }}
          >
            contacto@tarracoexplorer.com
          </a>
        </p>

        <p style={{ marginTop: "1.5rem", fontStyle: "italic" }}>
          ¡Esperamos que disfrutes tu viaje por Tarragona tanto como nosotros
          disfrutamos construir esta plataforma!
        </p>
      </div>
      <div className="about-section">
        <h2>Sobre los creadores</h2>

        <div className="creator-container">

          <div className="creator-card">
          <img src="/assets/adria.jpg" alt="Foto Adrià" className="creator.image" />
          <div className="creator-name">Adrià Gonzales </div>
          <div className="creator-role">Desarrolador Backend</div>
          <p className="creator-bio">Responsable de la base de datos y la interaccion del usuario</p>
          </div>

          <div className="creator-card">
          <img src="/assets/dani.jpg" alt="Foto Adrià" className="creator.image" />
          <div className="creator-name">Daniel Garcia</div>
          <div className="creator-role">Desarrolador Frontend</div>
          <p className="creator-bio">Responsable del contenido y la interaccion del usuario</p>
          </div>

          
          <div className="creator-card">
          <img src="/assets/dani.jpg" alt="Foto Adrià" className="creator.image" />
          <div className="creator-name">Nighjhurey Bueno</div>
          <div className="creator-role">Desarroladora FullStack</div>
          <p className="creator-bio">Responsable de la interaccion del usuario</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;
