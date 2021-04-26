import { createContext, useCallback, useContext, useState } from 'react';

import * as accounts from '~/utils/accounts';
import {
  localStorageKeys,
  readFromLocalStorage,
  saveToLocalStorage,
} from '~/utils/local';

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [tokens, setTokens] = useState({
    accessToken: null,
    refreshToken: null,
  });

  const setAccessToken = useCallback((newAccessToken) => {
    setTokens((currentTokens) => ({
      ...currentTokens,
      accessToken: newAccessToken,
    }));
  }, []);

  const setRefreshToken = useCallback((newRefreshToken) => {
    setTokens((currentTokens) => ({
      ...currentTokens,
      refreshToken: newRefreshToken,
    }));
  }, []);

  const authenticateUser = useCallback(async () => {
    if (tokens.accessToken) return true;

    const refreshToken =
      tokens.refreshToken ||
      readFromLocalStorage(localStorageKeys.REFRESH_TOKEN);

    if (!refreshToken) return false;

    let accessToken;
    try {
      accessToken = await accounts.token(refreshToken);
    } catch {
      return false;
    }

    setTokens({ accessToken, refreshToken });
    saveToLocalStorage(localStorageKeys.REFRESH_TOKEN, refreshToken);

    return true;
  }, [tokens.accessToken, tokens.refreshToken, setTokens]);

  return (
    <AuthContext.Provider
      value={{
        tokens,
        setTokens,
        setAccessToken,
        setRefreshToken,
        authenticateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
