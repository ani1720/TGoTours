import { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import "./Contacto.css"; // Asegúrate de tener este archivo CSS para estilos

const Contacto = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "mensajesContacto"), {
        ...form,
        fecha: Timestamp.now(),
      });
      setEnviado(true);
      setForm({
        nombre: "",
        email: "",
        asunto: "",
        mensaje: "",
      });
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("Hubo un error al enviar tu mensaje. Intenta de nuevo.");
    }
  };

  return (
    <div className="contacto-page">
      <h2>📩 Contáctanos</h2>
      <p>¿Tienes dudas, sugerencias o comentarios? ¡Estamos aquí para ayudarte!</p>

      {enviado && <p className="mensaje-exito">✅ Tu mensaje ha sido enviado correctamente.</p>}

      <form className="contacto-form" onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />

        <label>Correo electrónico</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Asunto</label>
        <input type="text" name="asunto" value={form.asunto} onChange={handleChange} required />

        <label>Mensaje</label>
        <textarea name="mensaje" rows="5" value={form.mensaje} onChange={handleChange} required />

        <button type="submit">Enviar mensaje</button>
      </form>
    </div>
  );
};

export default Contacto;
