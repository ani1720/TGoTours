import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // ajusta la ruta si es distinta
import { auth } from "../firebase/firebaseConfig"; // idem

export async function reservarPlaza(idTour) {
    const tourRef = doc(db, "freeTours", idTour);
    const tourSnap = await getDoc(tourRef);
  
    if (!tourSnap.exists()) {
      alert("El tour no existe");
      return;
    }
  
    const tourData = tourSnap.data();
    const uid = auth.currentUser.uid;
  
    if (tourData.inscritos.includes(uid)) {
      alert("Ya estás inscrito en este tour");
      return;
    }
  
    if (tourData.cupos <= 0) {
      alert("No hay cupos disponibles");
      return;
    }
  
    await updateDoc(tourRef, {
      inscritos: arrayUnion(uid),
      cupos: tourData.cupos - 1
    });
  
    alert("¡Reserva realizada con éxito!");
    return "ok";
  }
  