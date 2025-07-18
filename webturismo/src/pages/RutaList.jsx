import { Link } from "react-router-dom";
import rutas from "../data/rutas.json";
import "./RutaList.css";

const RutaList = () => {
  return (
    <div className="pantalla-completa">
      <div className="vertical-layout">
        <h1>Explora Rutas en Tarragona</h1>

        <section className="rutas-diagonales">
          {rutas.slice(0, 3).map((ruta) => (
            <Link
              to={`/rutas/${ruta.id}`}
              key={ruta.id}
              className="tarjeta-diagonal"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={ruta.imagen}
                alt={ruta.nombre}
                style={{ cursor: "pointer" }}
              />
              <div className="contenido">
                <h2>{ruta.nombre}</h2>
                {/* <p><strong>Duración:</strong> {ruta.duracion}</p> */}
                <p><strong>Tipo:</strong> {ruta.tipo}</p>
                <p><strong>Incluye:</strong></p>
                <ul>
                  {ruta.contenido?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
};

export default RutaList;
