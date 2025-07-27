import { useState } from "react";
import { auth } from "./firebase/firebaseConfig";
import { Link } from "react-router-dom";
import { doc, setDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
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
  const [aceptaTerminos, setAceptaTerminos] = useState(false); // 🆕 nuevo estado

  const handleRegistro = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    if (!aceptaTerminos) {
      setError("⚠️ Debes aceptar los términos y condiciones para registrarte.");
      return;
    }

    try {
      const usuariosRef = collection(db, "usuarios");
      const q = query(usuariosRef, where("nombreUsuario", "==", nombreUsuario));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("⚠️ El nombre de usuario ya está en uso.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", uid), {
        nombreUsuario,
        email,
        fechaRegistro: serverTimestamp(),
        rol,
      });

      await sendEmailVerification(user);

      setMensaje(
        `✅ Usuario creado: ${user.email}.
📩 Revisa tu bandeja de entrada y de spam para confirmar tu correo antes de iniciar sesión.`
      );

      setEmail("");
      setPassword("");
      setNombreUsuario("");
      setAceptaTerminos(false); // 🧼 limpiar casilla
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("⚠️ Este correo ya está registrado.");
      } else if (err.code === "auth/invalid-email") {
        setError("⚠️ Formato de correo inválido.");
      } else if (err.code === "auth/weak-password") {
        setError("⚠️ La contraseña debe tener al menos 6 caracteres.");
      } else {
        setError("❌ Error al registrar el usuario.");
      }
    }
  };

  return (
    <div className="full-page">
      <div className="form-page">
        <h2>Crear cuenta</h2>
        <form onSubmit={handleRegistro}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "0.5rem", margin: "0.5rem", width: "250px" }}
          />
          <br />
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            required
            style={{ padding: "0.5rem", margin: "0.5rem", width: "250px" }}
          />
          <br />
          <input
            type="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "0.5rem", margin: "0.5rem", width: "250px" }}
          />
          <br />
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

          {/* 🆕 Casilla de términos */}
          <div style={{ marginTop: "1rem", fontSize: "0.95rem", color: "#ccc" }}>
            <label>
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                style={{ marginRight: "0.5rem" }}
              />
              Acepto los{" "}
              <Link to="/terminos" target="_blank" style={{ color: "#00CFEA", textDecoration: "underline" }}>
                términos y condiciones
              </Link>
            </label>
          </div>

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
              }}
            >
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
