// src/pages/NuevoHilo.jsx
import "./NuevoHilo.css";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

function NuevoHilo({ usuario }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    await addDoc(collection(db, "threads"), {
      title,
      content,
      authorId: usuario.uid,
      authorName: usuario.displayName || usuario.email,
      createdAt: serverTimestamp(),
    });
    setMensajeConfirmacion("✅ ¡Tu hilo ha sido publicado con éxito!");
    setTitle("");
    setContent("");

    setTimeout(() => {
      navigate("/comunidad");
    }, 2000);
  };

  return (
    <div className="nuevo-hilo">
      <h2>Crear nuevo hilo</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Contenido"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Publicar hilo</button>
        {mensajeConfirmacion && (
          <p style={{ color: "green", marginTop: "0.5rem" }}>
            {mensajeConfirmacion}
          </p>
        )}
      </form>
    </div>
  );
}

export default NuevoHilo;
