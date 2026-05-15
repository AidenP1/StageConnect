import api from './axiosInstance';

export async function getStatsAdmin() {
  const response = await api.get('/api/admin/stats');
  return response.data;
}

export async function getUtilisateursAdmin(page = 1) {
  const response = await api.get('/api/admin/users', { params: { page } });
  return response.data;
}

export async function modifierUtilisateurAdmin(id, data) {
  const response = await api.put(`/api/admin/users/${id}`, data);
  return response.data;
}

export async function supprimerUtilisateurAdmin(id) {
  const response = await api.delete(`/api/admin/users/${id}`);
  return response.data;
}

export async function approuverUtilisateurAdmin(id, isApproved) {
  const response = await api.put(`/api/admin/users/${id}/approve`, { is_approved: isApproved });
  return response.data;
}

export async function getStagesAdmin(page = 1) {
  const response = await api.get('/api/admin/stages', { params: { page } });
  return response.data;
}

export async function modifierStageAdmin(id, data) {
  const response = await api.put(`/api/admin/stages/${id}`, data);
  return response.data;
}

export async function supprimerStageAdmin(id) {
  const response = await api.delete(`/api/admin/stages/${id}`);
  return response.data;
}
