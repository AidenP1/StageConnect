import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getMe } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);

  // vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const verifierSession = async () => {
      try {
        const data = await getMe();
        setUtilisateur(data.utilisateur);
      } catch (err) {
        // pas connecté
        setUtilisateur(null);
      } finally {
        setChargement(false);
      }
    };

    verifierSession();
  }, []);

  const connecter = useCallback((user) => {
    setUtilisateur(user);
  }, []);

  const deconnecter = useCallback(() => {
    setUtilisateur(null);
  }, []);

  const value = useMemo(
    () => ({ utilisateur, connecter, deconnecter, chargement }),
    [utilisateur, connecter, deconnecter, chargement]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}