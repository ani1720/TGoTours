import React from "react";

const Terminos = () => {
  return (
    <div style={{
      maxWidth: "800px",
      margin: "3rem auto",
      padding: "2rem",
      backgroundColor: "#1d203e",
      borderRadius: "12px",
      color: "#b0b3c2"
    }}>
      <h2 style={{ color: "#00CFEA", marginBottom: "1rem" }}>📜 Términos y Condiciones</h2>
      <p>Última actualización: Julio 2025</p>

      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ color: "#FDD835" }}>1. Uso de la plataforma</h3>
        <p>
          Al registrarte en Turismo Tarragona, aceptas utilizar la plataforma de forma responsable y respetuosa. No se permite el uso indebido, ofensivo o fraudulento.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ color: "#FDD835" }}>2. Privacidad de datos</h3>
        <p>
          Tu información personal será tratada conforme a nuestra política de privacidad. No compartimos tus datos con terceros sin tu consentimiento.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ color: "#FDD835" }}>3. Contenido generado por usuarios</h3>
        <p>
          Los comentarios, reseñas y aportaciones deben respetar las normas de convivencia. Nos reservamos el derecho de moderar o eliminar contenido inapropiado.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ color: "#FDD835" }}>4. Propiedad intelectual</h3>
        <p>
          Todo el contenido de la web (textos, imágenes, rutas, etc.) está protegido por derechos de autor. No está permitido su uso comercial sin autorización.
        </p>
      </section>

      <section>
        <h3 style={{ color: "#FDD835" }}>5. Modificaciones</h3>
        <p>
          Podemos actualizar estos términos en cualquier momento. Te notificaremos los cambios relevantes a través de la plataforma.
        </p>
      </section>
    </div>
  );
};

export default Terminos;
