import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate(); // 👈 Lo defines dentro del componente

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setMensaje(`🎉 Sesión iniciada como: ${userCredential.user.email}`);
      setEmail("");
      setPassword("");

      // 👇 Redirigir al home
      navigate("/");
    } catch (err) {
      setError("❌ Credenciales inválidas o usuario no registrado.");
    }
  };

  return (
    <div className="full-page">
      <div className="form-page">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
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
            type="password"
            placeholder="Contraseña"
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
            Entrar
          </button>
        </form>
        {mensaje && (
          <p style={{ color: "green", marginTop: "1rem" }}>{mensaje}</p>
        )}
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        {/* 👇 Nuevo bloque: enlace a registro */}
        <p style={{ marginTop: "2rem" }}>
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
