import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const CastellsDetalle = () => {
  const { mes } = useParams();
  const [collas, setCollas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollas = async () => {
      try {
        const collasRef = collection(db, `eventos/${mes}/castells/collas`);
        const snapshot = await getDocs(collasRef);
        const collasData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCollas(collasData);
      } catch (error) {
        console.error("Error al obtener collas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollas();
  }, [mes]);

  if (loading) return <p>Cargando información de las collas...</p>;
  if (!collas.length) return <p>No se encontró información de las collas.</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Collas participantes</h2>
      {collas.map((colla, index) => (
        <div key={index} style={{ marginBottom: '2rem', background: '#111', padding: '1rem', borderRadius: '10px' }}>
          <h3>{colla.nombre}</h3>
          <img src={colla.imagen} alt={colla.nombre} style={{ width: '100%', maxWidth: '500px' }} />
          <p>{colla.descripcion}</p>
          <h4>Ensayos</h4>
          <ul>
            {colla.ensayos?.map((ensayo, idx) => (
              <li key={idx}>
                📅 {ensayo.fecha} - 🕒 {ensayo.hora} - 📍{ensayo.ubicacion}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CastellsDetalle;
