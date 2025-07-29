// src/pages/ThreadDetail.jsx
import "./ThreadDetail.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { deleteDoc } from "firebase/firestore";

function ThreadDetail({ usuario }) {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [autorThread, setAutorThread] = useState(null);

  useEffect(() => {
    const refDoc = doc(db, "threads", threadId);
    getDoc(refDoc).then((snap) => {
      if (snap.exists()) {
        const threadData = snap.data();
        setThread(threadData);

        // Obtener datos del autor desde la colección usuarios
        const refUsuario = doc(db, "usuarios", threadData.authorId);
        getDoc(refUsuario).then((userSnap) => {
          if (userSnap.exists()) {
            setAutorThread(userSnap.data());
          }
        });
      }
    });

    const q = query(
      collection(db, "threads", threadId, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(lista);
    });

    return () => unsubscribe();
  }, [threadId]);

  const handleEliminarComentario = async (commentId) => {
    try {
      const refDoc = doc(db, "threads", threadId, "comments", commentId);
      await deleteDoc(refDoc);
      console.log("Comentario eliminado");
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
    }
  };

  const handleEnviarComentario = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim() || !usuario?.uid) return;

    const fotoURL = usuario.fotoURL ? usuario.fotoURL : null;

    await addDoc(collection(db, "threads", threadId, "comments"), {
      content: nuevoComentario,
      authorId: usuario.uid,
      authorName: usuario.displayName || usuario.email,
      fotoURL,
      createdAt: serverTimestamp(),
    });

    setNuevoComentario("");
  };

  if (!thread) return <p>Cargando hilo...</p>;

  return (
    <div className="thread-detail">
      <h2>{thread.title}</h2>
      <p>{thread.content}</p>
      <p className="autor-hilo">
        <img
          src={
            autorThread?.fotoURL
              ? autorThread.fotoURL
              : `https://ui-avatars.com/api/?name=${thread.authorName}&background=random&color=fff&size=128`
          }
          alt="Avatar del autor"
          className="avatar-comentario"
        />
        <em>Publicado por {thread.authorName}</em>
      </p>

      <hr />
      <h3>Comentarios</h3>
      <ul>
        {comments.map((c) => {
          const initials = c.authorName
            ? c.authorName[0].toUpperCase() +
              c.authorName.slice(-1).toUpperCase()
            : "U";

          const avatarURL = c.fotoURL
            ? c.fotoURL
            : `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;

          return (
            <li key={c.id} className="comentario">
              <img src={avatarURL} alt="Avatar" className="avatar-comentario" />
              <div>
                <strong>{c.authorName}</strong>
                <p>{c.content}</p>
                {usuario?.uid === c.authorId && (
                  <button onClick={() => handleEliminarComentario(c.id)}>
                    🗑️ Eliminar
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {usuario ? (
        <form onSubmit={handleEnviarComentario}>
          <textarea
            placeholder="Escribe tu comentario..."
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
          />
          <button type="submit">💬 Comentar</button>
        </form>
      ) : (
        <p>Debes iniciar sesión para comentar.</p>
      )}
    </div>
  );
}

export default ThreadDetail;
