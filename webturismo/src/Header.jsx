import "./Header.css";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Logo from "./assets/Logo2.png";
import nameWeb from "./assets/webname.png";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";

function Header({ usuario, nombreUsuario, cerrarSesion }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef();
  const dropdownRef = useRef();

  const [triggerPos, setTriggerPos] = useState({ top: 0, left: 0 });
  const [triggerHeight, setTriggerHeight] = useState(0);

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

  useEffect(() => {
    const obtenerFoto = async () => {
      if (usuario?.uid) {
        const refDoc = doc(db, "usuarios", usuario.uid);
        const snap = await getDoc(refDoc);
        if (snap.exists()) {
          const datos = snap.data();
          setFotoPerfil(datos.fotoURL || null);
        }
      }
    };
    obtenerFoto();
  }, [usuario]);

  return (
    <header className="site.header">
      <div className="brand">
        <Link to="/" className="logo-container">
          <img src={Logo} alt="Logo TgoTours" className="logo-img" />
          <div className="name-web">
            <img src={nameWeb} alt="Nombre Web" />
          </div>
        </Link>
      </div>

      {/* Botón hamburguesa visible solo en móvil */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      {/* <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/">HOME</Link>
        <Link to="/about">ABOUT</Link>
        <Link to="/eventos">EVENTOS</Link>
        <Link to="/mapa">MAP</Link>
        <Link to="/rutas">RUTAS</Link>
        <Link to="/comunidad">COMUNIDAD</Link>
        <Link to="/tours">FREE TOURS</Link>
        <Link to="/" onClick={() => setMenuAbierto(false)}>HOME</Link>

      </nav> */}
      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          HOME
        </Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>
          ABOUT
        </Link>
        <Link to="/eventos" onClick={() => setMenuOpen(false)}>
          EVENTOS
        </Link>
        <Link to="/mapa" onClick={() => setMenuOpen(false)}>
          MAP
        </Link>
        <Link to="/rutas" onClick={() => setMenuOpen(false)}>
          RUTAS
        </Link>
        <Link to="/comunidad" onClick={() => setMenuOpen(false)}>
          COMUNIDAD
        </Link>
        <Link to="/free-tours" onClick={() => setMenuOpen(false)}>
          FREE TOURS
        </Link>
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
              ref={triggerRef}
            >
              <img
                src={
                  fotoPerfil ||
                  `https://ui-avatars.com/api/?name=${nombreUsuario}&background=random&color=fff&size=128`
                }
                alt="Avatar"
                className="avatar-header"
              />
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
