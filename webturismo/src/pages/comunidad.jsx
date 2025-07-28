// src/pages/Comunidad.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

function Comunidad() {
  const [threads, setThreads] = useState([]);
  const { usuario } = useUser();

  useEffect(() => {
    const cargarThreads = async () => {
      const q = query(collection(db, "threads"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setThreads(lista);
    };
    cargarThreads();
  }, []);

  return (
    <div className="comunidad">
      <h1>Comunidad</h1>
      {usuario && (
        <Link to="/nuevo-hilo">
          <button>🧵 Crear nuevo hilo</button>
        </Link>
      )}

      <ul>
        {threads.map((thread) => (
          <li key={thread.id}>
            <Link to={`/hilo/${thread.id}`}>
              <strong>{thread.title}</strong> — por {thread.authorName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Comunidad;
