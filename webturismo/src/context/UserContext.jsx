import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const ref = doc(db, "usuarios", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const datos = snap.data();
          setUsuario({ ...user, ...datos });
          setRol(datos.rol);
        } else {
          setUsuario(user);
          setRol(null);
        }
      } else {
        setUsuario(null);
        setRol(null);
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ usuario, rol, cargando }}>
      {children}
    </UserContext.Provider>
  );
};
