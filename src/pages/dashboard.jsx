import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  InfoIcon,
  LogoutIcon,
  UserProfile,
  PlusIcon,
  LoadingIcon,
  MenuIcon,
  ArrowBack,
} from '~/assets';
import { SwitchButton } from '~/components/common';
import { Task, TaskModalForm } from '~/components/dashboardPage';
import { useAccount } from '~/contexts/AccountContext';
import { useAuth } from '~/contexts/AuthContext';
import useTasks from '~/hooks/useTasks';
import styles from '~/styles/pages/DashboardPage.module.scss';
import { localStorageKeys, removeTokenFromLocalStorage } from '~/utils/local';

const DashboardPage = () => {
  const router = useRouter();

  const { isAuthenticated, isLoading: isLoadingAuth, logoutUser } = useAuth();
  const { accountData } = useAccount();
  const { tasks, sortTasks, createTask, editTask, removeTask } = useTasks();

  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const [sortingCriteria, setSortingCriteria] = useState('priority');
  const [sortingOrder, setSortingOrder] = useState('desc');

  const [tasksAreSorted, setTasksAreSorted] = useState(false);

  const [taskModalFormStatus, setTaskModalFormStatus] = useState('closed');
  const [initialTaskFormValues, setInitialTaskFormValues] = useState({
    name: '',
    priority: 'high',
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const idOfTaskBeingEditedRef = useRef(null);

  const userFullName = useMemo(() => {
    if (!accountData) return '';
    return `${accountData.firstName} ${accountData.lastName}`;
  }, [accountData]);

  useEffect(() => {
    if (tasks.length === 0 || tasksAreSorted) return;

    sortTasks(sortingCriteria, sortingOrder);
    setTasksAreSorted(true);
  }, [tasks, tasksAreSorted, sortingCriteria, sortingOrder, sortTasks]);

  const updateSortingCriteria = useCallback(
    (newSortingCriteria) => {
      if (newSortingCriteria === sortingCriteria) return;
      setSortingCriteria(newSortingCriteria);
      sortTasks(newSortingCriteria, sortingOrder);
    },
    [sortTasks, sortingCriteria, sortingOrder],
  );

  const updateSortingOrder = useCallback(
    (newSortingOrder) => {
      if (newSortingOrder === sortingOrder) return;
      setSortingOrder(newSortingOrder);
      sortTasks(sortingCriteria, newSortingOrder);
    },
    [sortTasks, sortingCriteria, sortingOrder],
  );

  const openTaskCreationForm = useCallback(() => {
    setTaskModalFormStatus('create');
    setInitialTaskFormValues({ name: '', priority: 'high' });
  }, []);

  const openTaskEditingForm = useCallback((taskData) => {
    setTaskModalFormStatus('edit');
    idOfTaskBeingEditedRef.current = taskData.id;

    const { name, priority } = taskData;
    setInitialTaskFormValues({ name, priority });
  }, []);

  const handleTaskCreate = useCallback(
    async (taskData) => {
      setIsCreatingTask(true);

      await createTask(taskData, { sortingCriteria, sortingOrder });

      setIsCreatingTask(false);
      setTaskModalFormStatus('closed');
    },
    [createTask, sortingCriteria, sortingOrder],
  );

  const logoutAccount = async () => {
    await logoutUser();

    removeTokenFromLocalStorage(localStorageKeys.REFRESH_TOKEN);
    router.push('/login');
  };

  const handleTaskEdit = useCallback(
    ({ name, priority }) => {
      setTaskModalFormStatus('closed');

      const taskId = idOfTaskBeingEditedRef.current;
      editTask(taskId, { name, priority }, { sortingCriteria, sortingOrder });
    },
    [editTask, sortingCriteria, sortingOrder],
  );

  const handleTaskRemove = useCallback(() => {
    setTaskModalFormStatus('closed');

    const taskId = idOfTaskBeingEditedRef.current;
    removeTask(taskId);
  }, [removeTask]);

  const updateTaskCheckedState = useCallback(
    ({ id: taskId, isChecked }) => {
      editTask(
        taskId,
        { isCompleted: isChecked },
        { sortingCriteria, sortingOrder },
      );
    },
    [editTask, sortingCriteria, sortingOrder],
  );

  useEffect(() => {
    const shouldRedirect = !isLoadingAuth && !isAuthenticated;
    if (shouldRedirect) {
      router.replace('/login');
    }
  }, [isLoadingAuth, isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingIcon />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Dashboard | Tarefas</title>
      </Head>

      <TaskModalForm
        status={taskModalFormStatus}
        initialValues={initialTaskFormValues}
        onCreateTask={handleTaskCreate}
        onEditTask={handleTaskEdit}
        onRemoveTask={handleTaskRemove}
        onClose={() => setTaskModalFormStatus('closed')}
        loading={isCreatingTask}
      />

      <aside className={clsx(isSidebarOpen && styles.active)}>
        <div className={styles.userInfo}>
          <div className={styles.firstLine}>
            <div className={styles.userImageContainer}>
              <div className={styles.userImage} />
            </div>
            <button
              type="button"
              className={styles.closeSidebarButton}
              onClick={() => setIsSidebarOpen(false)}
            >
              <ArrowBack />
            </button>
          </div>
          <h1>{userFullName}</h1>
        </div>
        <div className={styles.sidebarMenu}>
          <button type="button" onClick={openTaskCreationForm}>
            <PlusIcon /> Nova Tarefa
          </button>
          <button type="button">
            <UserProfile /> Perfil
          </button>
          <button type="button">
            <InfoIcon /> Sobre
          </button>
          <button type="button" onClick={logoutAccount}>
            <LogoutIcon /> Logout
          </button>
        </div>
      </aside>

      <main>
        <div className={styles.topContents}>
          <div className={styles.titleAndDescription}>
            <div className={styles.firstLine}>
              <button
                type="button"
                className={styles.openSidebarButton}
                onClick={() => setIsSidebarOpen(true)}
              >
                <MenuIcon />
              </button>
              <h1>Tarefas</h1>
            </div>
            <p>
              Marque suas tarefas como concluídas, adicione novas tarefas ou
              edite as já existentes.
            </p>
          </div>
          <div className={styles.preferences}>
            <div className={styles.sortingCriteria}>
              <span>Ordenar</span>
              <SwitchButton
                leftName="priority"
                leftValue="Prioridade"
                rightName="name"
                rightValue="Nome"
                onChange={updateSortingCriteria}
              />
            </div>
            <div className={styles.sortingOrder}>
              <select
                name="sortingOrder"
                onChange={(event) => updateSortingOrder(event.target.value)}
              >
                <option value="desc">
                  {sortingCriteria === 'priority' ? 'Alta' : 'Alfabética ↓'}
                </option>
                <option value="asc">
                  {sortingCriteria === 'priority' ? 'Baixa' : 'Alfabética ↑'}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div className={styles.taskList}>
          {tasksAreSorted &&
            tasks.map((task) => (
              <Task
                key={task.id}
                id={task.id}
                name={task.name}
                priority={task.priority}
                checked={task.isCompleted}
                onTaskClick={openTaskEditingForm}
                onCheck={updateTaskCheckedState}
              />
            ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
