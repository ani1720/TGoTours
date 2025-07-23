const tipos = ["Todas", "Montaña", "Histórica", "Playa"];

const RutaFiltro = ({ filtroActivo, setFiltroActivo }) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {tipos.map((tipo) => (
        <button
          key={tipo}
          onClick={() => setFiltroActivo(tipo)}
          style={{
            marginRight: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: filtroActivo === tipo ? "#4CAF50" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {tipo.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default RutaFiltro;
