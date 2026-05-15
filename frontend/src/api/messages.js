import api from './axiosInstance';

export async function getMesConversations() {
  const response = await api.get('/api/messages/conversations');
  return response.data;
}

export async function getConversation(interlocuteurId) {
  const response = await api.get(`/api/messages/${interlocuteurId}`);
  return response.data;
}

export async function envoyerMessage(receiverId, content, stageId = null) {
  const response = await api.post('/api/messages', {
    receiver_id: receiverId,
    content,
    stage_id: stageId,
  });
  return response.data;
}

export async function getNonLus() {
  const response = await api.get('/api/messages/non-lus');
  return response.data;
}
