import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '~/contexts/AuthContext';
import * as tasksServices from '~/services/tasks';

function sortTasksByPriority(tasks, ascending) {
  const sortingFactor = ascending ? 1 : -1;
  const comparedTo = {
    high: { high: 0, low: 1 * sortingFactor },
    low: { high: -1 * sortingFactor, low: 0 },
  };

  return tasks.sort(
    (task, taskToCompare) => comparedTo[task.priority][taskToCompare.priority],
  );
}

function sortTasksByName(tasks, ascending) {
  const sortingFactor = ascending ? 1 : -1;

  return tasks.sort((task, taskToCompare) => {
    if (task.name > taskToCompare.name) return 1 * sortingFactor;
    if (task.name < taskToCompare.name) return -1 * sortingFactor;
    return 0;
  });
}

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

  const sortByPriority = useCallback((ascending = true) => {
    setTasks((currentTasks) => sortTasksByPriority(currentTasks, ascending));
  }, []);

  const sortByName = useCallback((ascending = true) => {
    setTasks((currentTasks) => sortTasksByName(currentTasks, ascending));
  }, []);

  return { tasks, sortByPriority, sortByName };
}

export default useTasks;
