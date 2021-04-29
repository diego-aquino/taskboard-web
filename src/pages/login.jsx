import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useRef, useState } from 'react';

import { AbstractSquares, PersonWithSmartphone } from '~/assets';
import { LoginForm } from '~/components/homePage';
import { useAuthContext } from '~/contexts/AuthContext';
import * as accountsServices from '~/services/accounts';
import styles from '~/styles/pages/LoginPage.module.scss';
import { localStorageKeys, saveToLocalStorage } from '~/utils/local';
import * as network from '~/utils/network';

const LoginPage = () => {
  const router = useRouter();

  const { setTokens } = useAuthContext();

  const loginFormRef = useRef(null);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  const loginAccount = useCallback(
    async (accountData) => {
      const responseData = await accountsServices.login(accountData);
      const { accessToken, refreshToken } = responseData;
      setTokens({ accessToken, refreshToken });

      saveToLocalStorage(localStorageKeys.REFRESH_TOKEN, refreshToken);
    },
    [setTokens],
  );

  const handleLoginError = useCallback((error) => {
    const errorType = network.getErrorType(error.response);
    const message = network.generateFeedbackMessage(errorType);

    const { setCustomAlertMessage } = loginFormRef.current || {};

    return setCustomAlertMessage?.({ global: message });
  }, []);

  const handleValidFormSubmit = useCallback(
    async ({ email, password }) => {
      try {
        setIsLoadingLogin(true);
        await loginAccount({ email, password });
        router.push('/dashboard');
      } catch (error) {
        handleLoginError(error);
      } finally {
        setIsLoadingLogin(false);
      }
    },
    [loginAccount, handleLoginError, router],
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Login | Taskboard</title>
      </Head>

      <section className={styles.loginSection}>
        <h1>Login</h1>
        <p>Seja bem vindo de volta!</p>

        <LoginForm
          ref={loginFormRef}
          onValidSubmit={handleValidFormSubmit}
          loading={isLoadingLogin}
        />

        <div className={styles.center}>
          <span>Não tem uma conta?</span>
          <Link href="/signup">Registre-se</Link>
        </div>
      </section>

      <section className={styles.decorativeSection}>
        <AbstractSquares className={styles.decorativeAbstractSquares} />
        <AbstractSquares className={styles.decorativeAbstractSquares} />
        <AbstractSquares className={styles.decorativeAbstractSquares} />
        <PersonWithSmartphone className={styles.PersonWithSmartphone} />
      </section>
    </div>
  );
};

export default LoginPage;
