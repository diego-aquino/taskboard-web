import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useAccount } from '~/contexts/AccountContext';
import { useAuth } from '~/contexts/AuthContext';
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

  return <div>Dashboard</div>;
};

export default DashboardPage;
