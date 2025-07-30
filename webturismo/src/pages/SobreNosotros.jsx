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
import "../App.css";
import MapView from "../WebView";

const SobreNosotros = () => {
    return (
<div className="about-wrapper">
        <section className="sobre-nosotros-section">
          <div className="sobre-nosotros-header">
            <img
              src={Logo}
              alt="Logo TGO Tours"
              className="sobre-nosotros-logo"
            />
            <h2>Sobre Nosotros</h2>
            <p>
              En <strong>TGoTours</strong> creemos que explorar Tarragona debe
              ser una experiencia enriquecedora, accesible y memorable.
            </p>
          </div>

          <div className="sobre-nosotros-cards">
            <div className="sobre-card">
              <img src={IconMap} alt="Mapa" />
              <h3>Rutas Interactivas</h3>
              <p>
                Explora la ciudad con mapas dinámicos y recorridos optimizados
                para descubrir cada rincón histórico.
              </p>
            </div>

            <div className="sobre-card">
              <img src={IconLugar} alt="Lugar" />
              <h3>Puntos Clave</h3>
              <p>
                Accede a información detallada sobre monumentos, plazas y
                espacios emblemáticos de Tarragona.
              </p>
            </div>

            <div className="sobre-card">
              <img src={eventos} alt="Eventos" />
              <h3>Eventos</h3>
              <p>
                Consulta los eventos más emblemáticos como Tarraco Viva, Santa
                Tecla o el Concurs de Castells, y planifica tu visita en torno a
                ellos.
              </p>
            </div>

            <div className="sobre-card">
              <img src={IconForo} alt="Foro" />
              <h3>Comunidad</h3>
              <p>
                Comparte tus experiencias, consejos y opiniones con otros
                viajeros en nuestro foro interactivo.
              </p>
            </div>
            <div className="sobre-card">
              <img src={freetours} alt="Free Tour" />
              <h3>Free Tours</h3>
              <p>
                Descubre Tarragona con recorridos gratuitos guiados por expertos
                locales. Ideal para quienes quieren explorar sin compromiso.
              </p>
            </div>
          </div>
        </section>

        <section className="quienes-somos-section">
          <div className="quienes-somos-header">
            <h2>¿Quiénes somos?</h2>
            <p>
              Somos un equipo de amantes de la historia, la cultura de Tarragona
              y desarrolladores entusiastas. Hemos creado esta plataforma para
              conectar <strong>tecnología y patrimonio</strong>, facilitando el
              turismo local de forma accesible, auténtica y enriquecedora.
            </p>
          </div>

          <div className="quienes-somos-cards">
            <div className="quienes-card">
              <h3>🌍 Misión</h3>
              <p>
                <strong>Facilitar el turismo local en Tarragona</strong>{" "}
                mediante rutas accesibles y útiles, pensadas para que cualquier
                persona pueda descubrir la ciudad a pie, a su ritmo y sin
                complicaciones.
              </p>
            </div>

            <div className="quienes-card">
              <h3>🔭 Visión</h3>
              <p>
                Ser el{" "}
                <strong>
                  referente digital del turismo cultural en Tarragona
                </strong>
                , conectando tecnología y patrimonio para que cada recorrido sea
                una experiencia significativa.
              </p>
            </div>

            <div className="quienes-card">
              <h3>💛 Valores</h3>
              <ul>
                <li>
                  <strong>Pasión por Tarragona</strong>: historia, cultura y
                  esencia mediterránea.
                </li>
                <li>
                  <strong>Accesibilidad y simplicidad</strong>: rutas pensadas
                  para todos.
                </li>
                <li>
                  <strong>Autenticidad</strong>: cada paso cuenta una historia.
                </li>
                <li>
                  <strong>Innovación con propósito</strong>: tecnología al
                  servicio del patrimonio.
                </li>
                <li>
                  <strong>Comunidad</strong>: turismo que conecta personas,
                  lugares y memorias.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="equipo-recuadro">
          <div className="equipo-funciona">
            <h2>🧭 ¿Cómo funciona?</h2>
            <p>
              Elige una ruta según lo que te apetezca explorar desde nuestro
              menú. Encontrarás opciones divertidas y enriquecedoras, con{" "}
              <strong>puntos destacados</strong>,
              <strong>mapa en tiempo real</strong> y{" "}
              <strong>comentarios de otros visitantes</strong>.
            </p>
          </div>

          <div className="equipo-contacto">
            <h2>💬 ¿Tienes sugerencias?</h2>
            <p>
              Estamos en constante mejora. Si tienes ideas, correcciones o
              quieres colaborar, puedes escribirnos a:{" "}
              <a
                href="mailto:contacto@tarracoexplorer.com"
                className="equipo-mail"
              >
                contacto@tarracoexplorer.com
              </a>
            </p>
            <p className="equipo-final">
              ¡Esperamos que disfrutes tu viaje por Tarragona tanto como
              nosotros disfrutamos construir esta plataforma!
            </p>
          </div>
        </section>

        <div className="equipo-creadores">
          <h2>Sobre los creadores</h2>
          <div className="creadores-grid">
            <div className="creador-card">
              <img src={adria} alt="Foto Adrià" className="creador-img" />
              <h3>Adrià González</h3>
              <span className="creador-rol">Desarrollador Backend</span>
              <p>
                Responsable de la base de datos y la interacción del usuario.
              </p>
            </div>

            <div className="creador-card">
              <img
                src={dani}
                alt="Foto Daniel"
                className="creador-img"
              />
              <h3>Daniel Garcia</h3>
              <span className="creador-rol">Desarrollador Frontend</span>
              <p>
                Responsable del contenido y la experiencia visual del usuario.
              </p>
            </div>

            <div className="creador-card">
              <img
                src={ani}
                alt="Foto Nighjhurey"
                className="creador-img"
              />
              <h3>Nighjhurey Bueno</h3>
              <span className="creador-rol">Desarrolladora FullStack</span>
              <p>
                Responsable de la integración y la interacción completa del
                sistema.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
};

export default SobreNosotros;