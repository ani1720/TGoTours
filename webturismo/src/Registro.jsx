import { useState } from "react";
import { auth } from "./firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

function Registro() {
  const [email, setEmail] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [rol, setRol] = useState("turista");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const navigate = useNavigate();
  const [emailConfirmacion, setEmailConfirmacion] = useState("");
  const [passwordConfirmacion, setPasswordConfirmacion] = useState("");

  const handleRegistro = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    // Validación personalizada
    if (!aceptaTerminos) {
      setError("⚠️ Debes aceptar los términos y condiciones para registrarte.");
      return;
    }
    if (!email.includes("@")) {
      setError("❌ El correo electrónico no es válido.");
      return;
    }
    if (password.length < 6) {
      setError("❌ La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (email !== emailConfirmacion) {
      setError("❌ Los correos electrónicos no coinciden.");
      return;
    }
    if (password !== passwordConfirmacion) {
      setError("❌ Las contraseñas no coinciden.");
      return;
    }

    // Validar nombre de usuario duplicado
    try {
      const q = query(
        collection(db, "usuarios"),
        where("nombreUsuario", "==", nombreUsuario)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError("❌ El nombre de usuario ya está en uso.");
        return;
      }
    } catch (queryError) {
      console.error("❌ Error al verificar nombre de usuario:", queryError);
      setError("❌ No se pudo verificar el nombre de usuario.");
      return;
    }

    // Crear usuario
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;
      const user = userCredential.user;

      console.log("✅ Usuario creado:", uid);

      try {
        await setDoc(doc(db, "usuarios", uid), {
          nombreUsuario,
          email,
          fechaRegistro: serverTimestamp(),
          rol,
          fotoPerfil: user.photoURL || "",
          nombreCompleto: user.displayName || "",
        });
        console.log("✅ Documento creado en Firestore");
      } catch (firestoreError) {
        console.error("❌ Error en setDoc:", firestoreError);
        setError(`❌ Error en Firestore: ${firestoreError.message}`);
        return;
      }

      await sendEmailVerification(user);

      setMensaje(
        `✅ Usuario creado: ${user.email}. Revisa tu correo y tu bandeja de spam.`
      );
      setEmail("");
      setPassword("");
      setNombreUsuario("");
      setAceptaTerminos(false);

      // Redirigir después de unos segundos
      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } catch (authError) {
      console.error("❌ Error en createUserWithEmailAndPassword:", authError);
      switch (authError.code) {
        case "auth/email-already-in-use":
          setError("❌ Este correo ya está registrado.");
          break;
        case "auth/invalid-email":
          setError("❌ El correo no es válido.");
          break;
        case "auth/weak-password":
          setError("❌ La contraseña es demasiado débil.");
          break;
        case "auth/password-does-not-meet-requirements":
          setError(
            "❌ La contraseña no cumple los requisitos mínimos: debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y algun numero."
          );
          break;
        default:
          setError("❌ Error al crear la cuenta.");
      }
    }
  };

  return (
    <div className="full-page">
      <div className="form-page">
        <h2>Crear cuenta</h2>
        <form onSubmit={handleRegistro}>
          <div style={{ maxWidth: "300px", margin: "0 auto" }}>
            {/* Correo electrónico */}
            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  marginBottom: "0.3rem",
                  fontWeight: "bold",
                }}
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  padding: "0.5rem",
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>

            {/* Confirmación de correo */}
            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="emailConfirmacion"
                style={{
                  display: "block",
                  marginBottom: "0.3rem",
                  fontWeight: "bold",
                }}
              >
                Repite tu correo electrónico
              </label>
              <input
                id="emailConfirmacion"
                type="email"
                value={emailConfirmacion}
                onChange={(e) => setEmailConfirmacion(e.target.value)}
                required
                style={{
                  padding: "0.5rem",
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>

            {/* Nombre de usuario */}
            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="nombreUsuario"
                style={{
                  display: "block",
                  marginBottom: "0.3rem",
                  fontWeight: "bold",
                }}
              >
                Nombre de usuario
              </label>
              <input
                id="nombreUsuario"
                type="text"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
                style={{
                  padding: "0.5rem",
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>

            {/* Contraseña */}
            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  marginBottom: "0.3rem",
                  fontWeight: "bold",
                }}
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  padding: "0.5rem",
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>

            {/* Confirmación de contraseña */}
            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="passwordConfirmacion"
                style={{
                  display: "block",
                  marginBottom: "0.3rem",
                  fontWeight: "bold",
                }}
              >
                Repite tu contraseña
              </label>
              <input
                id="passwordConfirmacion"
                type="password"
                value={passwordConfirmacion}
                onChange={(e) => setPasswordConfirmacion(e.target.value)}
                required
                style={{
                  padding: "0.5rem",
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>

          <div
            style={{
              margin: "1rem auto",
              fontSize: "0.95rem",
              color: "#666",
              textAlign: "center",
              maxWidth: "260px",
              lineHeight: "1.5",
              backgroundColor: "#f5f5f5",
              padding: "0.75rem",
              borderRadius: "8px",
            }}
          >
            🔐 <strong>Requisitos:</strong>
            <br />- Mínimo <strong>8 caracteres</strong>
            <br />- Al menos <strong>una mayúscula</strong>,{" "}
            <strong>una minúscula</strong>, y <strong>un número</strong>
          </div>
          <label style={{ display: "block", margin: "0.5rem 0 0.2rem 0" }}>
            Selecciona tu rol:
          </label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
            style={{ padding: "0.5rem", margin: "0.5rem", width: "260px" }}
          >
            <option value="turista">Turista</option>
            <option value="guia">Guía</option>
          </select>

          <div
            style={{ marginTop: "1rem", fontSize: "0.95rem", color: "#ccc" }}
          >
            <label>
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                style={{ marginRight: "0.5rem" }}
              />
              Acepto los{" "}
              <Link
                to="/terminos"
                target="_blank"
                style={{ color: "#00CFEA", textDecoration: "underline" }}
              >
                términos y condiciones
              </Link>
            </label>
          </div>

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button type="submit" style={{ padding: "0.5rem 1rem" }}>
              Registrarse
            </button>
          </div>
        </form>

        {mensaje && (
          <p style={{ color: "green", marginTop: "1rem" }}>{mensaje}</p>
        )}
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

        <p style={{ marginTop: "2rem" }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Registro;
