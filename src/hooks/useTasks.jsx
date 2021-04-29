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
    const taskName = task.name.toLowerCase();
    const taskToCompareName = taskToCompare.name.toLowerCase();

    if (taskName > taskToCompareName) return 1 * sortingFactor;
    if (taskName < taskToCompareName) return -1 * sortingFactor;
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

  const sortTasks = useCallback(
    (criteria, order) => {
      const ascending = order === 'asc';

      if (criteria === 'priority') {
        sortByPriority(ascending);
      } else {
        sortByName(ascending);
      }
    },
    [sortByName, sortByPriority],
  );

  const insertTaskSortedByPriority = useCallback(
    (newTask, ascending = true) => {
      setTasks((currentTasks) =>
        sortTasksByPriority([...currentTasks, newTask], ascending),
      );
    },
    [],
  );

  const insertTaskSortedByName = useCallback((newTask, ascending = true) => {
    setTasks((currentTasks) =>
      sortTasksByName([...currentTasks, newTask], ascending),
    );
  }, []);

  const insertSortedTask = useCallback(
    (newTask, criteria, order) => {
      const ascending = order === 'asc';

      if (criteria === 'priority') {
        insertTaskSortedByPriority(newTask, ascending);
      } else {
        insertTaskSortedByName(newTask, ascending);
      }
    },
    [insertTaskSortedByName, insertTaskSortedByPriority],
  );

  const createTask = useCallback(
    ({ name, priority }, { sortingCriteria, sortingOrder }) => {
      if (!isAuthenticated) return;

      (async () => {
        const createdTask = await makeAuthenticatedRequest((accessToken) =>
          tasksServices.create(accessToken, { name, priority }),
        );
        insertSortedTask(createdTask, sortingCriteria, sortingOrder);
      })();
    },
    [isAuthenticated, makeAuthenticatedRequest, insertSortedTask],
  );

  return { tasks, sortTasks, createTask };
}

export default useTasks;
