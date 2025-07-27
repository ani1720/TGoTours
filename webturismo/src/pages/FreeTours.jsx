import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const FreeTours = () => {
  const usuario = useContext(UserContext);
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const obtenerTours = async () => {
      const querySnapshot = await getDocs(collection(db, 'tours'));
      const toursData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTours(toursData);
    };

    obtenerTours();
  }, []);

  return (
    <div className="free-tours">
      <h2>🌍 Free Tours disponibles</h2>

      {/* ✅ Mostrar botón solo si el usuario es guía */}
      {usuario && usuario.role === 'guia' && (
        <Link to="/crear-tour">
          <button className="crear-tour-btn">+ Crear nuevo tour</button>
        </Link>
      )}

<ul>
  {tours.map(tour => (
    <li key={tour.id} className="tour-card">
      <h3>{tour.titulo}</h3>
      <p>{tour.descripcion}</p>
      <p><strong>Duración:</strong> {tour.duracion}</p>
      <p><strong>Fecha:</strong> {tour.fecha}</p>
      <p><strong>Ubicación:</strong> {tour.ubicacion}</p>

      {/* 🧑‍💼 Info del guía */}
      <div className="guia-info">
        {tour.guiaFoto && (
          <img
            src={tour.guiaFoto}
            alt={`Foto de ${tour.guiaNombre}`}
            className="guia-foto"
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
        )}
        <span>{tour.guiaNombre}</span>
      </div>

      <Link to={`/reservar/${tour.id}`}>
        <button>Reservar plaza</button>
      </Link>
    </li>
  ))}
</ul>

    </div>
  );
};

export default FreeTours;
