import { useState } from "react";
import { useUser } from "../context/UserContext";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "./CrearTour.css";

const CrearTour = () => {
  const { usuario, rol, cargando } = useUser();

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    duracion: "",
    fecha: "",
    horaInicio: "", // 🕒 nuevo campo
    cupos: "",
    ubicacion: "",
  });
  const [mensaje, setMensaje] = useState("");

  // ⏳ Esperar a que el usuario esté cargado
  if (cargando) return null;

  // 🚫 Bloquear acceso si no es guía
  if (!usuario || rol !== "guia") {
    return (
      <div className="crear-tour">
        <h2>📍 Crear un Free Tour</h2>
        <p style={{ color: "red" }}>
          Solo los guías pueden acceder a esta sección.
        </p>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!usuario || rol !== "guia") {
      setMensaje("Acceso denegado. Solo los guías pueden crear tours.");
      return;
    }
  
    try {
      // 📅 Convertir la fecha seleccionada a Date
      const fechaSeleccionada = new Date(formData.fecha);
      fechaSeleccionada.setHours(0, 0, 0, 0);
      const finDelDia = new Date(formData.fecha);
      finDelDia.setHours(23, 59, 59, 999);
  
      // 🔍 Consultar tours del guía en esa fecha usando 'fecha' como string
      const q = query(
        collection(db, "freeTours"),
        where("guiaID", "==", usuario.uid),
        where("fecha", "==", formData.fecha)
      );
  
      const snapshot = await getDocs(q);
  
      if (snapshot.size >= 3) {
        setMensaje("Ya has creado 3 tours para ese día. No puedes crear más.");
        return;
      }
  
      // ✅ Crear el tour
      await addDoc(collection(db, "freeTours"), {
        ...formData,
        guiaID: usuario.uid,
        guiaNombre: usuario.nombreUsuario,        guiaFoto: usuario.fotoURL || "",
        creadoEn: serverTimestamp(),
        inscritos: [],
        reseñas: [],
      });
  
      setMensaje("¡Tour creado con éxito!");
      setFormData({
        titulo: "",
        descripcion: "",
        duracion: "",
        fecha: "",
        horaInicio: "",
        cupos: "",
        ubicacion: "",
      });
    } catch (error) {
      console.error("Error al crear el tour:", error);
      setMensaje("Hubo un error al crear el tour.");
    }
  };
  

  return (
    <div className="crear-tour">
      <h2>📍 Crear un Free Tour</h2>
      {mensaje && <p>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="titulo"
          placeholder="Título del tour"
          value={formData.titulo}
          onChange={handleChange}
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="duracion"
          placeholder="Duración (ej. 2h)"
          value={formData.duracion}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="horaInicio"
          value={formData.horaInicio}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="cupos"
          placeholder="Cupos disponibles"
          value={formData.cupos}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="ubicacion"
          placeholder="Ubicación"
          value={formData.ubicacion}
          onChange={handleChange}
          required
        />
        <button type="submit">Publicar Tour</button>
      </form>
    </div>
  );
};

export default CrearTour;
