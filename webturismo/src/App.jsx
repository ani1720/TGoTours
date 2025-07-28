import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom"; // Link no se usa aquí directamente, pero está bien
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";
import Ruta from "./Ruta";
import Header from "./Header";
import Login from "./Login";
import Registro from "./Registro";
import Home from "./Home";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import Mapa from "./pages/Mapa";
import Eventos from "./pages/Eventos";
import Footer from "./components/Footer";
import EventoDetalle from "./EventoDetalle";
import EventosMes from "./pages/EventosMes";
import About from "./pages/About";
import Perfil from "./pages/Perfil";
import Comunidad from "./pages/comunidad";
import NuevoHilo from "./pages/NuevoHilo";
import ThreadDetail from "./pages/ThreadDetail";
import RutaDetalle from "./Rutas/RutaDetalle";
import { UserContext } from "./context/UserContext";
import { UserProvider } from "./context/UserContext";
import FAQPage from "./pages/FAQPage";
import Contacto from "./pages/Contacto";
import Terminos from "./pages/Terminos";
import CrearTour from "./pages/CrearTour";
import FreeTours from "./pages/FreeTours";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [modoAccesible, setModoAccesible] = useState(false);

  const activarAccesibilidad = () => {
    setModoAccesible((prev) => {
      const nuevoEstado = !prev;
      if (nuevoEstado) {
        document.body.classList.add("modo-accesible");
      } else {
        document.body.classList.remove("modo-accesible");
      }
      return nuevoEstado;
    });
  };

   const leerTexto = (textoManual = null) => {
    const speech = new SpeechSynthesisUtterance();
    speech.lang = "es-ES";

    if (textoManual) {
      speech.text = textoManual;
    } else {
      const contenido = document.getElementById("main-content")?.innerText;
      speech.text = contenido || "No se encontró contenido para leer.";
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };
  useEffect(() => {
    const guardado = localStorage.getItem("modoAccesible");
    if (guardado === "true") {
      document.body.classList.add("modo-accesible");
      setModoAccesible(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("modoAccesible", modoAccesible);
  }, [modoAccesible]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);
        console.log("Sesión activa:", user.email);
      } else {
        setUsuario(null);
        console.log("No hay sesión iniciada");
      }
    });
    return () => unsubscribe();
  }, []);



  useEffect(() => {
    const obtenerNombreUsuario = async () => {
      if (usuario) {
        const ref = doc(db, "usuarios", usuario.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setNombreUsuario(snap.data().nombreUsuario);
        }
      }
    };
    obtenerNombreUsuario();
  }, [usuario]);

  useEffect(() => {
    const cargarPerfil = async () => {
      if (usuario?.uid) {
        const refDoc = doc(db, "usuarios", usuario.uid);
        const snap = await getDoc(refDoc);
        if (snap.exists()) {
          const datos = snap.data();
          setUsuario((prev) => ({ ...prev, ...datos }));
        }
      }
    };
    cargarPerfil();
  }, [usuario]);

  return (
    <>
      <Header
        usuario={usuario}
        nombreUsuario={nombreUsuario}
        cerrarSesion={async () => {
          const { signOut } = await import("firebase/auth");
          try {
            await signOut(auth);
            // Espera a que Firebase actualice el estado
            setUsuario(null);
            setNombreUsuario("");
            setRefresh((prev) => !prev);
            // Opcional: redirige al home
            window.location.href = "/";
          } catch (error) {
            console.error("Error al cerrar sesión:", error);
          }
        }}
      />
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/rutas/*" element={<Ruta />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/eventos/:mes" element={<EventosMes />} />
          <Route path="/about" element={<About />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/comunidad" element={<Comunidad />} />
          <Route path="/nuevo-hilo" element={<NuevoHilo usuario={usuario} />} />
          <Route
            path="/hilo/:threadId"
            element={<ThreadDetail usuario={usuario} />}
          />
          <Route path="/ruta/:id" element={<RutaDetalle usuario={usuario} />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/crear-tour" element={<CrearTour user={usuario} />} />
          <Route path="/tours" element={<FreeTours user={usuario} />} />
        </Routes>
      </UserProvider>
      <Footer activarAccesibilidad={activarAccesibilidad}
        modoAccesible={modoAccesible} leerTexto={leerTexto} />
    </>
  );
}

export default App;
