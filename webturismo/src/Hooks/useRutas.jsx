// hooks/useRutas.js
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const useRutas = () => {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarRutas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Rutas"));
        const rutasData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRutas(rutasData);
      } catch (error) {
        console.error("Error al cargar rutas desde Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarRutas();
  }, []);

  return { rutas, loading };
};

export default useRutas;
