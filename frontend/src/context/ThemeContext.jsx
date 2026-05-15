import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // récupérer le thème depuis localStorage au démarrage
  const [modeSombre, setModeSombre] = useState(() => {
    const sauvegarde = localStorage.getItem('theme');
    return sauvegarde === 'dark';
  });

  // appliquer le thème sur <html> pour que body hérite des variables CSS
  useEffect(() => {
    const html = document.documentElement;
    if (modeSombre) {
      html.setAttribute('data-theme', 'dark');
      html.setAttribute('data-bs-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
      html.setAttribute('data-bs-theme', 'light');
    }
    localStorage.setItem('theme', modeSombre ? 'dark' : 'light');
  }, [modeSombre]);

  const basculerTheme = () => {
    setModeSombre((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ modeSombre, basculerTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
