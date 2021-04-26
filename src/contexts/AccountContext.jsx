import { createContext, useContext, useState } from 'react';

const AccountContext = createContext({});

export const AccountContextProvider = ({ children }) => {
  const [accountData, setAccountData] = useState(null);

  return (
    <AccountContext.Provider value={{ accountData, setAccountData }}>
      {children}
    </AccountContext.Provider>
  );
};

export function useAccount() {
  return useContext(AccountContext);
}
