import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { translations } from '../utils/translations';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [langue, setLangue] = useState(() => {
    return localStorage.getItem('langue') || 'fr';
  });

  // gérer la direction RTL pour l'arabe
  useEffect(() => {
    const root = document.getElementById('root');
    if (langue === 'ar') {
      root.setAttribute('dir', 'rtl');
      root.classList.add('rtl');
    } else {
      root.setAttribute('dir', 'ltr');
      root.classList.remove('rtl');
    }
    localStorage.setItem('langue', langue);
  }, [langue]);

  // ✅ memoïsée — ne se recrée que si `langue` change
  const t = useCallback((cle) => {
    const parties = cle.split('.');
    let valeur = translations[langue];

    for (const partie of parties) {
      if (valeur && valeur[partie] !== undefined) {
        valeur = valeur[partie];
      } else {
        let fallback = translations['fr'];
        for (const p of parties) {
          fallback = fallback?.[p];
        }
        return fallback || cle;
      }
    }

    return valeur || cle;
  }, [langue]);

  // ✅ jamais recréée
  const changerLangue = useCallback((nouvelleLangue) => {
    setLangue(nouvelleLangue);
  }, []);

  // ✅ objet stable — ne change que si langue/t/changerLangue changent
  const value = useMemo(
    () => ({ langue, t, changerLangue }),
    [langue, t, changerLangue]
  );

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}