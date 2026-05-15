import api from './axiosInstance';

export async function getMesNotifications() {
  const response = await api.get('/api/notifications');
  return response.data;
}
