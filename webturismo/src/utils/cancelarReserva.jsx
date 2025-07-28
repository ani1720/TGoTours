// utils/cancelarReserva.js
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";

export async function cancelarReserva(tourId) {
  try {
    const auth = getAuth();
    const usuario = auth.currentUser;
    const tourRef = doc(db, "freeTours", tourId);
    const tourSnap = await getDoc(tourRef);
    const tourData = tourSnap.data();

    const nuevosInscritos = tourData.inscritos.filter((id) => id !== usuario.uid);

    await updateDoc(tourRef, {
      inscritos: nuevosInscritos,
      cupos: tourData.cupos + 1,
    });

    return "ok";
  } catch (error) {
    console.error("Error al cancelar reserva:", error);
    return "error";
  }
}
