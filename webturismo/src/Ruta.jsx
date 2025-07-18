import { Routes, Route } from "react-router-dom";
import RutaList from "./pages/RutaList";
import RutaDetalle from "./pages/RutaDetalle";
// import MapView from "./WebView";

function Ruta() {
  return (
    <Routes>
      <Route path="/" element={<RutaList />} />
      {/* <Route path="mapa" element={<MapView />} /> */}
      <Route path=":id" element={<RutaDetalle />} /> {/* <- CORREGIDO AQUÍ */}
    </Routes>
  );
}

export default Ruta;
