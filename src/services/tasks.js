import api from '~/api';

export async function create(accessToken, taskData) {
  const creationResponse = await api.post('/tasks', taskData, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const { task } = creationResponse.data;

  return task;
}

export async function list(accessToken) {
  const listResponse = await api.get('/tasks', {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { paginate: false },
  });
  const { tasks } = listResponse.data;

  return tasks;
}

export async function edit(accessToken, taskId, newTaskData) {
  await api.put(`/tasks/${taskId}`, newTaskData, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
