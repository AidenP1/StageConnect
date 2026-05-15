import api from './axiosInstance';

export async function getMesFavoris() {
  const response = await api.get('/api/favoris');
  return response.data;
}

export async function ajouterFavori(stageId) {
  const response = await api.post(`/api/favoris/${stageId}`);
  return response.data;
}

export async function supprimerFavori(stageId) {
  const response = await api.delete(`/api/favoris/${stageId}`);
  return response.data;
}
