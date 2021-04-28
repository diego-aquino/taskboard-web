import { createContext, useContext, useEffect, useRef, useState } from 'react';

import * as accountsServices from '~/services/accounts';

import { useAuth } from './AuthContext';

const AccountContext = createContext({});

export const AccountContextProvider = ({ children }) => {
  const [accountData, setAccountData] = useState(null);

  return (
    <AccountContext.Provider value={{ accountData, setAccountData }}>
      {children}
    </AccountContext.Provider>
  );
};

export function useAccountContext() {
  return useContext(AccountContext);
}

export function useAccount() {
  const { accountData, setAccountData } = useAccountContext();

  const { isAuthenticated, makeAuthenticatedRequest } = useAuth();

  const isRequestingAccountData = useRef(false);

  useEffect(() => {
    if (accountData || !isAuthenticated || isRequestingAccountData.current)
      return;

    isRequestingAccountData.current = true;

    const requestAndApplyAccountData = async () => {
      try {
        const requestedAccountData = await makeAuthenticatedRequest(
          (accessToken) => accountsServices.details(accessToken),
        );
        setAccountData(requestedAccountData);
      } finally {
        isRequestingAccountData.current = false;
      }
    };

    requestAndApplyAccountData();
  }, [accountData, setAccountData, isAuthenticated, makeAuthenticatedRequest]);

  return { accountData, setAccountData };
}
