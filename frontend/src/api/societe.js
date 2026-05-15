import api from './axiosInstance';

export async function getMonProfilSociete() {
  const response = await api.get('/api/societe/profile');
  return response.data;
}

export async function mettreAJourProfilSociete(data) {
  const response = await api.put('/api/societe/profile', data);
  return response.data;
}

export async function uploaderLogo(formData) {
  const response = await api.post('/api/societe/profile/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function getMesStats() {
  const response = await api.get('/api/societe/stats');
  return response.data;
}

export async function getCandidaturesRecentes() {
  const response = await api.get('/api/societe/candidatures/recentes');
  return response.data;
}
