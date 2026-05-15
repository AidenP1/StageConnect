import axios from 'axios';

// configurer l'instance axios avec l'URL de base et les credentials
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:8000'),
  withCredentials: true,
  // requis en Axios 1.x pour envoyer X-XSRF-TOKEN sur les requêtes cross-origin
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// intercepteur de réponse : propager l'erreur sans rediriger
// AuthContext gère déjà le 401 de getMe(), ProtectedRoute gère la redirection
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
