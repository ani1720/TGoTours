import "./Header.css";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Logo from "./assets/Logo2.png";
import WebName from "./assets/webname.png"
import LogoAll from "./assets/logounion.png"

function Header({ usuario, nombreUsuario, cerrarSesion }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  const triggerRef = useRef();
  const dropdownRef = useRef();

  const [triggerPos, setTriggerPos] = useState({ top: 0, left: 0 });
  const [triggerHeight, setTriggerHeight] = useState(0);
  // Cerrar menú si clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (menuAbierto && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setTriggerPos({ top: rect.top + window.scrollY, left: rect.left });
      setTriggerHeight(rect.height);
    }
  }, [menuAbierto]);

  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={LogoAll} alt="Logo TgoTours" style={{ cursor: "pointer" }} />
          {/* <img src={Logo} alt="Logo TgoTours" style={{ cursor: "pointer" }} />
          <img src={WebName} alt="Nombre web" /> */}
        </Link>
      </div>


      <nav className="nav-links">
        <Link to="/">HOME</Link>
        <Link to="/about">ABOUT</Link>
        <Link to="/eventos">EVENTOS</Link>
        <Link to="/mapa">MAP</Link>
        <Link to="/rutas">RUTAS</Link>
      </nav>

      <div
        className="auth-section"
        ref={dropdownRef}
        style={{ position: "relative" }}
      >
        {usuario ? (
          <div className="usuario-menu">
            <button
              className="usuario-trigger"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              {nombreUsuario} ▼
            </button>

            {menuAbierto && (
              <div className="usuario-dropdown">
                <Link to="/perfil">👤 Mi perfil</Link>
                <Link to="/rutas-guardadas">🗺️ Rutas guardadas</Link>
                <Link to="/restaurantes-guardados">
                  🍽️ Restaurantes guardados
                </Link>
                <button
                  onClick={() => {
                    cerrarSesion();
                    navigate("/login");
                  }}
                >
                  🚪 Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button>Iniciar sesión</button>
          </Link>
        )}
      </div>
    </header>
  );
}
export default Header;
