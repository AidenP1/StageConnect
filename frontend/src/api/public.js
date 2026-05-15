import api from './axiosInstance';

// récupérer les stages publics avec filtres
export async function getStagesPublics(params = {}) {
  const response = await api.get('/api/stages', { params });
  return response.data;
}

// récupérer le détail d'un stage
export async function getDetailStage(id) {
  const response = await api.get(`/api/stages/${id}`);
  return response.data;
}

// récupérer le profil public d'une entreprise
export async function getProfilEntreprise(id) {
  const response = await api.get(`/api/entreprises/${id}`);
  return response.data;
}

// statistiques publiques pour la landing page
export async function getStatsPubliques() {
  const response = await api.get('/api/stats/public');
  return response.data;
}

// récupérer les dernières offres
export async function getDernieresOffres() {
  const response = await api.get('/api/stages/recentes');
  return response.data;
}
