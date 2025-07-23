// guardarRuta.js
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase-config.js";

// Datos de prueba
const rutaDePrueba = {
  nombreRuta: "Ruta de prueba por Tarragona",
  nombres: ["Inicio", "Anfiteatro", "Catedral", "Foro"],
  coordenadas: [
    { lat: 41.1162, lng: 1.2474 },
    { lat: 41.1168, lng: 1.2490 },
    { lat: 41.1175, lng: 1.2512 },
    { lat: 41.1181, lng: 1.2535 }
  ]
};

// Función para guardar la ruta
async function guardarRuta() {
  try {
    const docRef = await addDoc(collection(db, "rutas"), rutaDePrueba);
    console.log("Ruta guardada con ID:", docRef.id);
  } catch (error) {
    console.error("Error al guardar la ruta:", error);
  }
}

// Ejecutar la función
guardarRuta();
