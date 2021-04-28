import api from '../api';

export async function list(accessToken) {
  const listResponse = await api.get('/tasks', {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { paginate: false },
  });
  const { tasks } = listResponse.data;

  return tasks;
}
