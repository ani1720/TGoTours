import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

function EventosMes() {
  const { mes } = useParams();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerEventos = async () => {
      setLoading(true);
      try {
        const subcolecciones = ["castells", "santjoan", "fuegos", "bailes"];
        const eventosFinales = [];

        for (const sub of subcolecciones) {
          try {
            const subRef = collection(db, 'eventos', mes.toLowerCase(), sub);
            const subSnap = await getDocs(subRef);
            subSnap.forEach((doc) => eventosFinales.push(doc.data()));
          } catch (e) {
            console.warn(`Subcolección ${sub} no encontrada o vacía`);
          }
        }

        setEventos(eventosFinales);
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerEventos();
  }, [mes]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-4xl font-bold mb-4">Eventos mensuales en Tarragona</h1>
      {loading ? (
        <p>Cargando eventos...</p>
      ) : eventos.length === 0 ? (
        <p>No hay eventos registrados para este mes.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((evento, index) => (
            <div
              key={index}
              className="bg-white text-black p-4 rounded shadow hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={evento.imagenUrl}
                alt={evento.nombre}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <h2 className="text-xl font-semibold mb-1">{evento.nombre}</h2>
              <p className="text-sm text-gray-700 mb-1">{evento.fecha}</p>
              <p className="text-sm text-gray-600">{evento.descripcion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventosMes;
