import { useEffect, useState } from 'react';

import { useAuth } from '~/contexts/AuthContext';
import * as tasksServices from '~/services/tasks';

function useTasks() {
  const { isAuthenticated, makeAuthenticatedRequest } = useAuth();

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    (async () => {
      const requestedTasks = await makeAuthenticatedRequest((accessToken) =>
        tasksServices.list(accessToken),
      );
      setTasks(requestedTasks);
    })();
  }, [isAuthenticated, makeAuthenticatedRequest]);

  return { tasks };
}

export default useTasks;
