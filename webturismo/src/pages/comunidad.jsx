// src/pages/Comunidad.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./comunidad.css";

function Comunidad() {
  const [threads, setThreads] = useState([]);
  const { usuario } = useUser();
  const [autores, setAutores] = useState({});

  useEffect(() => {
    const cargarThreads = async () => {
      const q = query(collection(db, "threads"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setThreads(lista);

      // Obtener datos de los autores
      const autoresTemp = {};
      for (const thread of lista) {
        const refUsuario = doc(db, "usuarios", thread.authorId);
        const userSnap = await getDocs(query(collection(db, "usuarios")));
        const autorDoc = userSnap.docs.find((d) => d.id === thread.authorId);
        if (autorDoc && autorDoc.exists()) {
          autoresTemp[thread.authorId] = autorDoc.data();
        }
      }
      setAutores(autoresTemp);
    };

    cargarThreads();
  }, []);

  return (
    <div className="comunidad">
      <h1>Comunidad</h1>

      <div className="explicacion-comunidad">
  <h3>¿Qué es la comunidad?</h3>
  <p>
    La comunidad es un espacio abierto para compartir experiencias, resolver dudas y conectar con otros viajeros y guías.
  </p>

  <div className="comunidad-section">
    <h4>🗣️ Participa en los hilos</h4>
    <p>
      Puedes leer, comentar y crear hilos sobre cualquier tema relacionado con los tours, rutas, lugares o consejos de viaje.
    </p>
  </div>

  <div className="comunidad-section">
    <h4>💡 Comparte tu conocimiento</h4>
    <p>
      ¿Conoces una ruta secreta? ¿Tienes recomendaciones locales? ¡Compártelas! Tu experiencia puede ayudar a otros.
    </p>
  </div>

  <div className="comunidad-section">
    <h4>🤝 Conecta con otros usuarios</h4>
    <p>
      Interactúa con guías, viajeros y curiosos. La comunidad es un punto de encuentro para todos los que aman explorar.
    </p>
  </div>
</div>

      {usuario && (
        <Link to="/nuevo-hilo">
          <button className="boton-naranja crear-hilo-btn">Crear hilo</button>{" "}
        </Link>
      )}

      <ul>
        {threads.map((thread) => {
          const autor = autores[thread.authorId];
          const avatarURL = autor?.fotoURL
            ? autor.fotoURL
            : `https://ui-avatars.com/api/?name=${thread.authorName}&background=random&color=fff&size=128`;

          return (
            <li key={thread.id} className="hilo-comunidad">
            <Link to={`/hilo/${thread.id}`} className="link-hilo">
              <img src={avatarURL} alt="Avatar" className="avatar-comentario" />
              <strong className="threadtitle">{thread.title}</strong>
            </Link>
            <span className="autor-hilo">por {thread.authorName}</span>
          </li>
          
          
          );
        })}
      </ul>
    </div>
  );
}

export default Comunidad;
