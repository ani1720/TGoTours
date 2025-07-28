import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faUniversalAccess } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Footer = ({ activarAccesibilidad, modoAccesible, leerTexto }) => {
  return (
    <footer className="footer">
      <div className="footer-contenedor">
        <div className="footer-col">
          <h4>Accesibilidad</h4>
          <button className="btn-accesibilidad" onClick={activarAccesibilidad}>
            <FontAwesomeIcon icon={faUniversalAccess} />{" "}
            {modoAccesible ? "Desactivar modo accesible" : "Modo Accesible"}
          </button>
          <button
            className="btn-accesibilidad"
            onClick={() =>
              leerTexto(
                "Bienvenido a Turismo Tarragona. Explora la historia, cultura y belleza de nuestra ciudad."
              )
            }
          >
            <FontAwesomeIcon icon={faUniversalAccess} /> Escuchar descripción
          </button>
        </div>

        <div className="footer-col">
          <h4>Turismo Tarragona</h4>
          <p>Explora la historia, cultura y belleza de nuestra ciudad.</p>
        </div>

        <div className="footer-col">
          <h4>Enlaces útiles</h4>
          <ul>
            <ul>
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/rutas">Rutas</Link>
              </li>
              <li>
                <Link to="/terminos">Terminos y condiciones</Link>
              </li>
              <li>
                <Link to="/faq">Preguntas Frecuentes</Link>
              </li>
            </ul>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contacto</h4>
          <p>Email: contacto@tgotours.com</p>
          <p>Teléfono: +34 656 280 412</p>
          <ul>
            <li>
              <Link to="/contacto">Formulario de contacto</Link>
            </li>
          </ul>

          <div className="footer-redes">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faXTwitter} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-copy">
        <p>
          © {new Date().getFullYear()} Turismo Tarragona. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
