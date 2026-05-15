import api from './axiosInstance';

// postuler à un stage avec fichier lettre de motivation
export async function postuler(stageId, coverLetterFile) {
  const formData = new FormData();
  formData.append('stage_id', stageId);
  if (coverLetterFile) {
    formData.append('cover_letter_file', coverLetterFile);
  }
  const response = await api.post('/api/candidatures', formData);
  return response.data;
}

// récupérer mes candidatures (étudiant)
export async function getMesCandidatures() {
  const response = await api.get('/api/candidatures/mes-candidatures');
  return response.data;
}

// changer le statut d'une candidature (société)
export async function changerStatutCandidature(id, statut) {
  const response = await api.put(`/api/candidatures/${id}/statut`, { status: statut });
  return response.data;
}
