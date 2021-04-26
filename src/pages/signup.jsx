import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useRef } from 'react';

import { AbstractSquares, PersonWithPosters } from '~/assets';
import { SignUpForm } from '~/components/homePage';
import { useAccount } from '~/contexts/AccountContext';
import { useAuth } from '~/contexts/AuthContext';
import styles from '~/styles/pages/SignUpPage.module.scss';
import * as accounts from '~/utils/accounts';
import * as errors from '~/utils/errors';
import { localStorageKeys, saveToLocalStorage } from '~/utils/local';

const SignUpPage = () => {
  const { setAccountData } = useAccount();
  const { setTokens } = useAuth();

  const router = useRouter();

  const signUpFormRef = useRef(null);

  const signUpAccount = useCallback(
    async (accountData) => {
      const responseData = await accounts.signup(accountData);
      const { account, accessToken, refreshToken } = responseData;

      setAccountData(account);
      setTokens({ accessToken, refreshToken });

      const stringifiedAccount = JSON.stringify(account);
      saveToLocalStorage(localStorageKeys.ACCOUNT_DATA, stringifiedAccount);
      saveToLocalStorage(localStorageKeys.REFRESH_TOKEN, refreshToken);
    },
    [setAccountData, setTokens],
  );

  const handleSignUpError = useCallback((error) => {
    const errorType = errors.getNetworkErrorType(error.response);
    const message = errors.generateNetworkErrorMessage(errorType);

    const { setCustomAlertMessage } = signUpFormRef.current || {};

    switch (errorType) {
      case errors.types.EMAIL_ALREADY_IN_USE: {
        return setCustomAlertMessage?.({ email: message });
      }
      default:
        return setCustomAlertMessage?.({ global: message });
    }
  }, []);

  const handleValidFormSubmit = useCallback(
    async ({ firstName, lastName, email, password }) => {
      try {
        await signUpAccount({ firstName, lastName, email, password });
        router.push('/dashboard');
      } catch (error) {
        handleSignUpError(error);
      }
    },
    [signUpAccount, handleSignUpError, router],
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Registrar-se | Taskboard</title>
      </Head>

      <section className={styles.decorativeSectionContainer}>
        <AbstractSquares className={styles.decorativeSquares} />
        <AbstractSquares className={styles.decorativeSquares} />
        <AbstractSquares className={styles.decorativeSquares} />
        <PersonWithPosters className={styles.personWithPosters} />
      </section>

      <section className={styles.signUpSection}>
        <h1>Registre-se</h1>
        <p>E gerencie as suas tarefas com eficiência!</p>

        <SignUpForm ref={signUpFormRef} onValidSubmit={handleValidFormSubmit} />

        <div className={styles.alreadyRegisteredContainer}>
          <span>Já tem uma conta?</span>
          <Link href="/login">Faça login</Link>
        </div>
      </section>
    </div>
  );
};

export default SignUpPage;
