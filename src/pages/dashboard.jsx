import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { InfoIcon, LogoutIcon, UserProfile, PlusIcon } from '~/assets';
import { ItemMenu } from '~/components/common';
import { useAccount } from '~/contexts/AccountContext';
import { useAuth } from '~/contexts/AuthContext';
import styles from '~/styles/pages/DashboardPage.module.scss';
import * as accounts from '~/utils/accounts';
import { localStorageKeys, saveToLocalStorage } from '~/utils/local';

const DashboardPage = () => {
  const { accountData, setAccountData } = useAccount();
  const { tokens, authenticateUser, setAccessToken } = useAuth();

  const router = useRouter();

  useEffect(() => {
    const redirectIfUserIsNotAuthenticated = async () => {
      const isAuthenticated = await authenticateUser();
      if (!isAuthenticated) router.replace('/login');
    };

    redirectIfUserIsNotAuthenticated();
  }, [router, authenticateUser]);

  useEffect(() => {
    if (accountData || !tokens.accessToken) return;

    const requestAndUpdateAccountData = async () => {
      const requestedAccountData = await accounts.details(
        tokens.accessToken,
        tokens.refreshToken,
        { applyAccessToken: setAccessToken },
      );
      setAccountData(requestedAccountData);
      saveToLocalStorage(localStorageKeys.ACCOUNT_DATA, requestedAccountData);
    };

    requestAndUpdateAccountData();
  }, [
    accountData,
    setAccountData,
    tokens.accessToken,
    tokens.refreshToken,
    setAccessToken,
  ]);

  if (!tokens.accessToken) {
    return <div>Loading...</div>; // temporary
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Dashboard | Tarefas</title>
      </Head>

      <section className={styles.sidebarSection}>
        <div className={styles.userInfo}>
          <div className={styles.photo}>
            <div className={styles.img} />
          </div>
          <strong>Vinícius</strong>
          <strong>Lins</strong>
        </div>
        <div className={styles.menu}>
          <ItemMenu>
            {' '}
            <PlusIcon /> Nova Tarefa{' '}
          </ItemMenu>
          <ItemMenu>
            {' '}
            <UserProfile /> Perfil{' '}
          </ItemMenu>
          <ItemMenu>
            {' '}
            <InfoIcon /> Sobre{' '}
          </ItemMenu>
          <ItemMenu>
            {' '}
            <LogoutIcon /> Logout{' '}
          </ItemMenu>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
