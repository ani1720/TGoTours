import { useState } from "react";
import { auth } from "./firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

function Registro() {
  const [email, setEmail] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const handleRegistro = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);
  
    try {
      // 🧠 Validar si el nombre de usuario ya está tomado
      const usuariosRef = collection(db, "usuarios");
      const q = query(usuariosRef, where("nombreUsuario", "==", nombreUsuario));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        setError("⚠️ El nombre de usuario ya está en uso.");
        return; // ⛔ detenemos el registro si ya existe
      }
  
      // ✅ Crear usuario en Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;
  
      // 🗂️ Guardar datos extra en Firestore
      await setDoc(doc(db, "usuarios", uid), {
        nombreUsuario,
        email,
        fechaRegistro: new Date(),
        rol: "turista",
      });
  
      setMensaje(`✅ Usuario creado: ${userCredential.user.email}`);
      setEmail("");
      setPassword("");
      setNombreUsuario("");
    } catch (err) {
      // 🎯 Manejador de errores personalizado
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
          <button
            type="submit"
            style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}
          >
            Registrarse
          </button>
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
