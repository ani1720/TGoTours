export const obtenerRutaORS = async (coordenadas) => {
  const apiKey = import.meta.env.VITE_ORS_API_KEY;

  try {
    const respuesta = await fetch(
      "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
      {
        method: "POST",
        headers: {
          "Authorization": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coordinates: coordenadas }),
      }
    );

    if (!respuesta.ok) throw new Error("Error en la API de ORS");

    return await respuesta.json();
  } catch (error) {
    console.error("Error al obtener ruta de ORS:", error);
    return null;
  }
};
