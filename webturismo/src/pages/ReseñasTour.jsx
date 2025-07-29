import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useUser } from "../context/UserContext";

const ReseñasTour = ({ tourId }) => {
  const { usuario } = useUser();
  const [reseñas, setReseñas] = useState([]);
  const [nuevaReseña, setNuevaReseña] = useState("");
  const [estrellas, setEstrellas] = useState(5);

  useEffect(() => {
    const cargarReseñas = async () => {
      const snapshot = await getDocs(
        collection(db, "freeTours", tourId, "reseñas")
      );
      const lista = snapshot.docs.map((doc) => doc.data());
      setReseñas(lista);
    };
    cargarReseñas();
  }, [tourId]);

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

      {usuario && (
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
    </div>
  );
};

export default ReseñasTour;
