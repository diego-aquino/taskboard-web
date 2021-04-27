import { createContext, useCallback, useContext, useState } from 'react';

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

  return (
    <AuthContext.Provider
      value={{ tokens, setTokens, setAccessToken, setRefreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
