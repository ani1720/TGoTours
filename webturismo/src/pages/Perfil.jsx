import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile, updatePassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({
    nombreUsuario: "",
    email: "",
    fechaRegistro: "",
    rol: "",
    fotoURL: ""
  });
  const [nuevaFoto, setNuevaFoto] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        setUsuario(user);
        const refDoc = doc(db, "usuarios", user.uid);
        const snap = await getDoc(refDoc);
        if (snap.exists()) {
          const data = snap.data();
          setForm({
            nombreUsuario: data.nombreUsuario || "",
            email: data.email || user.email,
            fechaRegistro: data.fechaRegistro?.toDate().toLocaleDateString() || "",
            rol: data.rol || "turista",
            fotoURL: data.fotoURL || ""
          });
        }
      }
    };
    fetchData();
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
    }

    alert("Perfil actualizado correctamente");
  };

  const handleChangePassword = async () => {
    const nueva = prompt("Nueva contraseña:");
    if (nueva) {
      await updatePassword(usuario, nueva);
      alert("Contraseña actualizada");
    }
  };

  return (
    <div className="perfil-page">
      <h2>👤 Perfil de usuario</h2>
      {form.fotoURL && <img src={form.fotoURL} alt="Foto de perfil" width={100} />}

      <div className="perfil-info">
        <label>Nombre de usuario</label>
        <input
          type="text"
          value={form.nombreUsuario}
          onChange={(e) => setForm({ ...form, nombreUsuario: e.target.value })}
        />

        <label>Correo electrónico</label>
        <input type="email" value={form.email} disabled />

        <label>Fecha de registro</label>
        <input type="text" value={form.fechaRegistro} disabled />

        <label>Rol</label>
        <input type="text" value={form.rol} disabled />

        <label>Foto de perfil</label>
        <input type="file" onChange={(e) => setNuevaFoto(e.target.files[0])} />

        <button onClick={handleUpdate}>💾 Guardar cambios</button>
        <button onClick={handleChangePassword}>🔒 Cambiar contraseña</button>
      </div>
    </div>
  );
}

export default Perfil;
