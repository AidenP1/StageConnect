import api from './axiosInstance';

// récupérer le cookie CSRF avant les requêtes d'auth
const getCsrf = async () => {
  await api.get('/sanctum/csrf-cookie');
};

export async function login(email, password) {
  await getCsrf();
  const response = await api.post('/api/login', { email, password });
  return response.data;
}

export async function register(nom, email, password, passwordConfirm, role) {
  await getCsrf();
  const response = await api.post('/api/register', {
    name: nom,
    email,
    password,
    password_confirmation: passwordConfirm,
    role,
  });
  return response.data;
}

export async function logout() {
  const response = await api.post('/api/logout');
  return response.data;
}

export async function getMe() {
  const response = await api.get('/api/me');
  return response.data;
}
