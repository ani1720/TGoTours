import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useUser } from "../context/UserContext";

const ReseñasTour = ({ tourId }) => {
  const { usuario } = useUser();
  const [reseñas, setReseñas] = useState([]);
  const [nuevaReseña, setNuevaReseña] = useState("");
  const [estrellas, setEstrellas] = useState(5);
  const [puedeReseñar, setPuedeReseñar] = useState(false);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");

  useEffect(() => {
    const cargarReseñas = async () => {
      const snapshot = await getDocs(
        collection(db, "freeTours", tourId, "reseñas")
      );
      const lista = snapshot.docs.map((doc) => doc.data());
      setReseñas(lista);
    };

    const verificarReserva = async () => {
      const tourRef = doc(db, "freeTours", tourId);
      const tourSnap = await getDoc(tourRef);
      if (tourSnap.exists()) {
        const inscritos = tourSnap.data().inscritos || [];
        setPuedeReseñar(inscritos.includes(usuario.uid));
      }
    };

    if (usuario) {
      verificarReserva();
    }

    cargarReseñas();
  }, [tourId, usuario]);

  const enviarReseña = async () => {
    if (!nuevaReseña.trim()) return;

    await addDoc(collection(db, "freeTours", tourId, "reseñas"), {
      autor: usuario.displayName || usuario.email,
      estrellas,
      comentario: nuevaReseña.trim(),
      createdAt: serverTimestamp(),
    });

    setNuevaReseña("");
    setEstrellas(5);
    setMensajeConfirmacion("✅ ¡Gracias por tu reseña!");

    setTimeout(() => setMensajeConfirmacion(""), 3000);
  };

  return (
    <div className="reseñas-tour">
      <h5>Reseñas:</h5>
      {reseñas.length === 0 ? (
        <p>No hay reseñas aún.</p>
      ) : (
        reseñas.map((r, i) => (
          <div key={i} style={{ marginBottom: "1rem" }}>
            <strong>{r.autor}</strong> – ⭐ {r.estrellas}
            <p>{r.comentario}</p>
          </div>
        ))
      )}

      {usuario && puedeReseñar && (
        <div style={{ marginTop: "1rem" }}>
          <label>
            Estrellas:
            <select
              value={estrellas}
              onChange={(e) => setEstrellas(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <textarea
            value={nuevaReseña}
            onChange={(e) => setNuevaReseña(e.target.value)}
            placeholder="Escribe tu reseña..."
            rows={2}
            style={{ width: "100%", marginTop: "0.5rem" }}
          />
          <button onClick={enviarReseña}>Enviar reseña</button>
        </div>
      )}
      
      {mensajeConfirmacion && (
        <p style={{ color: "green", marginTop: "0.5rem" }}>
          {mensajeConfirmacion}
        </p>
      )}

      {usuario && !puedeReseñar && (
        <p style={{ marginTop: "1rem", color: "gray" }}>
          Solo puedes dejar una reseña si reservaste este tour.
        </p>
      )}
    </div>
  );
};

export default ReseñasTour;
