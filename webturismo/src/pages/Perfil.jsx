import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({
    nombreUsuario: "",
    email: "",
    fechaRegistro: "",
    rol: "",
    fotoURL: "",
  });
  const [nuevaFoto, setNuevaFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [correoVerificado, setCorreoVerificado] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload();
        setUsuario(user);
        setCorreoVerificado(user.emailVerified);

        const refDoc = doc(db, "usuarios", user.uid);
        const snap = await getDoc(refDoc);
        if (snap.exists()) {
          const data = snap.data();
          setForm({
            nombreUsuario: data.nombreUsuario || "",
            email: data.email || user.email,
            fechaRegistro:
              data.fechaRegistro?.toDate().toLocaleDateString() || "",
            rol: data.rol || "turista",
            fotoURL: data.fotoURL || "",
          });
        }
      } else {
        setUsuario(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdate = async () => {
    const refDoc = doc(db, "usuarios", usuario.uid);
    await updateDoc(refDoc, { nombreUsuario: form.nombreUsuario });

    await updateProfile(usuario, { displayName: form.nombreUsuario });

    if (nuevaFoto) {
      const storageRef = ref(storage, `fotosPerfil/${usuario.uid}`);
      const fileSnapshot = await uploadBytes(storageRef, nuevaFoto);
      const url = await getDownloadURL(fileSnapshot.ref);
      await updateDoc(refDoc, { fotoURL: url });
      setForm({ ...form, fotoURL: url });
      setPreviewFoto(null); // Limpiar vista previa tras guardar
    }

    alert("Perfil actualizado correctamente");
  };

  const handleEnviarCorreoRecuperacion = async () => {
    try {
      await sendPasswordResetEmail(auth, usuario.email);
      alert("📩 Se ha enviado un correo para cambiar tu contraseña.");
    } catch (error) {
      console.error(error);
      alert("Error al enviar el correo: " + error.message);
    }
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (!usuario) return <p>No se ha iniciado sesión.</p>;

  return (
    <div className="perfil-page">
      <h2>👤 Perfil de usuario</h2>
      {form.fotoURL && (
        <div className="foto-perfil">
          <img src={form.fotoURL} alt="Foto de perfil" />
        </div>
      )}

      {previewFoto && (
        <div style={{ marginBottom: "1rem" }}>
          <p>📷 Vista previa de la nueva foto:</p>
          <img src={previewFoto} alt="Vista previa" width={100} />
        </div>
      )}

      <div className="perfil-info">
        <label>Nombre de usuario</label>
        <input
          type="text"
          value={form.nombreUsuario}
          disabled
          style={{ backgroundColor: "#eee", cursor: "not-allowed" }}
        />

        <label>Correo electrónico</label>
        <input type="email" value={form.email} disabled />
        <p style={{ marginBottom: "1rem" }}>
          Estado del correo:{" "}
          {correoVerificado ? "✅ Verificado" : "⛔ No verificado"}
        </p>

        <label>Fecha de registro</label>
        <input type="text" value={form.fechaRegistro} disabled />

        <label>Rol</label>
        <input type="text" value={form.rol} disabled />

        <label>Foto de perfil</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const archivo = e.target.files[0];
            if (archivo) {
              setNuevaFoto(archivo);
              setPreviewFoto(URL.createObjectURL(archivo));
            }
          }}
        />

        <button onClick={handleUpdate}>💾 Guardar cambios</button>
        <button onClick={handleEnviarCorreoRecuperacion}>
          📩 Enviar correo para cambiar contraseña
        </button>
      </div>
    </div>
  );
}

export default Perfil;
