import api from './axiosInstance';

// récupérer les offres de la société connectée
export async function getMesOffres() {
  const response = await api.get('/api/stages/mes-offres');
  return response.data;
}

// créer une nouvelle offre
export async function creerOffre(data) {
  const response = await api.post('/api/stages/mes-offres', data);
  return response.data;
}

// modifier une offre existante
export async function modifierOffre(id, data) {
  const response = await api.put(`/api/stages/${id}`, data);
  return response.data;
}

// supprimer une offre
export async function supprimerOffre(id) {
  const response = await api.delete(`/api/stages/${id}`);
  return response.data;
}

// voir les candidatures pour une offre
export async function getCandidaturesPourOffre(id) {
  const response = await api.get(`/api/stages/${id}/candidatures`);
  return response.data;
}
