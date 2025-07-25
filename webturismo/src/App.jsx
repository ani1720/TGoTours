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
import { UserContext } from "./context/UserContext"

function App() {
  const [usuario, setUsuario] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [refresh, setRefresh] = useState(false);

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
<UserContext.Provider value={usuario}>
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
      </Routes>
      </UserContext.Provider>
      <Footer />
    </>
  );
}

export default App;