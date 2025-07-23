import { useState } from "react";
// import "./ForoRuta.css";

const ForoRuta = ({ rutaId }) => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");

  const enviarComentario = () => {
    if (nuevoComentario.trim() !== "") {
      setComentarios([...comentarios, nuevoComentario]);
      setNuevoComentario("");
    }
  };

  return (
    <div className="foro-ruta">
      <textarea
        placeholder="Escribe tu comentario..."
        value={nuevoComentario}
        onChange={(e) => setNuevoComentario(e.target.value)}
      />
      <button onClick={enviarComentario}>Publicar</button>
      <ul>
        {comentarios.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </div>
  );
};

export default ForoRuta;
