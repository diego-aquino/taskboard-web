import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import * as accountsServices from '~/services/accounts';
import {
  localStorageKeys,
  readFromLocalStorage,
  saveToLocalStorage,
} from '~/utils/local';
import * as network from '~/utils/network';

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [tokens, setTokens] = useState({
    accessToken: null,
    refreshToken: null,
  });

  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!tokens.accessToken;

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
    if (isAuthenticated) return;

    setIsLoading(true);

    const refreshToken =
      tokens.refreshToken ||
      readFromLocalStorage(localStorageKeys.REFRESH_TOKEN);

    if (!refreshToken) {
      setIsLoading(false);
    }

    let accessToken;
    try {
      accessToken = await accountsServices.token(refreshToken);
    } catch {
      setIsLoading(false);
    }

    setTokens({ accessToken, refreshToken });
    saveToLocalStorage(localStorageKeys.REFRESH_TOKEN, refreshToken);
    setIsLoading(false);
  }, [tokens.refreshToken, isAuthenticated]);

  const requestAndApplyNewAccessToken = useCallback(
    async (refreshToken) => {
      const newAccessToken = await accountsServices.token(refreshToken);
      setAccessToken(newAccessToken);
      return newAccessToken;
    },
    [setAccessToken],
  );

  return (
    <AuthContext.Provider
      value={{
        tokens,
        isLoading,
        isAuthenticated,
        setTokens,
        setAccessToken,
        setRefreshToken,
        authenticateUser,
        requestAndApplyNewAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const {
    tokens,
    isLoading,
    isAuthenticated,
    setTokens,
    authenticateUser,
    requestAndApplyNewAccessToken,
  } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoading) return;
    authenticateUser();
  }, [isLoading, isAuthenticated, authenticateUser]);

  const makeAuthenticatedRequest = useCallback(
    async (fetcher) => {
      const { accessToken, refreshToken } = tokens;

      if (!isAuthenticated) {
        return Promise.reject();
      }

      try {
        const response = await fetcher(accessToken);
        return response;
      } catch (error) {
        const errorType = network.getErrorType(error.response);

        if (errorType !== network.errorTypes.ACCESS_TOKEN_EXPIRED) {
          throw error;
        }

        const newAccessToken = await requestAndApplyNewAccessToken(
          refreshToken,
        );

        return fetcher(newAccessToken);
      }
    },
    [tokens, isAuthenticated, requestAndApplyNewAccessToken],
  );

  return {
    tokens,
    isLoading,
    isAuthenticated,
    setTokens,
    makeAuthenticatedRequest,
  };
}
