import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

import {
  InfoIcon,
  LogoutIcon,
  UserProfile,
  PlusIcon,
  LoadingIcon,
} from '~/assets';
import { SwitchButton } from '~/components/common';
import { Task } from '~/components/dashboardPage';
import { useAccount } from '~/contexts/AccountContext';
import { useAuth } from '~/contexts/AuthContext';
import useTasks from '~/hooks/useTasks';
import styles from '~/styles/pages/DashboardPage.module.scss';

const DashboardPage = () => {
  const router = useRouter();

  const { isAuthenticated, isLoading: isLoadingAuth } = useAuth();
  const { accountData } = useAccount();
  const { tasks } = useTasks();

  const userFullName = useMemo(() => {
    if (!accountData) return '';
    return `${accountData.firstName} ${accountData.lastName}`;
  }, [accountData]);

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

      <aside>
        <div className={styles.userInfo}>
          <div className={styles.userImageContainer}>
            <div className={styles.userImage} />
          </div>
          <h1>{userFullName}</h1>
        </div>
        <div className={styles.sidebarMenu}>
          <button type="button">
            <PlusIcon /> Nova Tarefa
          </button>
          <button type="button">
            <UserProfile /> Perfil
          </button>
          <button type="button">
            <InfoIcon /> Sobre
          </button>
          <button type="button">
            <LogoutIcon /> Logout
          </button>
        </div>
      </aside>

      <main>
        <div className={styles.topContents}>
          <div className={styles.titleAndDescription}>
            <h1>Tarefas</h1>
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
                onChange={() => {}}
              />
            </div>
            <div className={styles.sortingOrder}>
              <select name="sortingOrder">
                <option value="high">Alta</option>
                <option value="low">Baixa</option>
              </select>
            </div>
          </div>
        </div>
        <div className={styles.taskList}>
          {tasks.map((task) => (
            <Task
              key={task.id}
              name={task.name}
              priority={task.priority}
              completed={task.isCompleted}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
