import api from './axiosInstance';

// postuler à un stage
export async function postuler(stageId, coverLetter) {
  const response = await api.post('/api/candidatures', {
    stage_id: stageId,
    cover_letter: coverLetter,
  });
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
