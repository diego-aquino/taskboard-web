import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useRef, useState } from 'react';

import { AbstractSquares, PersonWithPosters } from '~/assets';
import { SignUpForm } from '~/components/homePage';
import { useAccountContext } from '~/contexts/AccountContext';
import { useAuthContext } from '~/contexts/AuthContext';
import * as accountsServices from '~/services/accounts';
import styles from '~/styles/pages/SignUpPage.module.scss';
import { localStorageKeys, saveToLocalStorage } from '~/utils/local';
import * as network from '~/utils/network';

const SignUpPage = () => {
  const router = useRouter();

  const { setAccountData } = useAccountContext();
  const { setTokens } = useAuthContext();

  const signUpFormRef = useRef(null);
  const [isLoadingSignUp, setIsLoadingSignUp] = useState(false);

  const signUpAccount = useCallback(
    async (accountData) => {
      const responseData = await accountsServices.signUp(accountData);
      const { account, accessToken, refreshToken } = responseData;

      setAccountData(account);
      setTokens({ accessToken, refreshToken });

      saveToLocalStorage(localStorageKeys.REFRESH_TOKEN, refreshToken);
    },
    [setAccountData, setTokens],
  );

  const handleSignUpError = useCallback((error) => {
    const errorType = network.getErrorType(error.response);
    const message = network.generateFeedbackMessage(errorType);

    const { setCustomAlertMessage } = signUpFormRef.current || {};

    switch (errorType) {
      case network.errorTypes.EMAIL_ALREADY_IN_USE: {
        return setCustomAlertMessage?.({ email: message });
      }
      default:
        return setCustomAlertMessage?.({ global: message });
    }
  }, []);

  const handleValidFormSubmit = useCallback(
    async ({ firstName, lastName, email, password }) => {
      try {
        setIsLoadingSignUp(true);
        await signUpAccount({ firstName, lastName, email, password });
        router.push('/dashboard');
      } catch (error) {
        handleSignUpError(error);
      } finally {
        setIsLoadingSignUp(false);
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

        <SignUpForm
          ref={signUpFormRef}
          onValidSubmit={handleValidFormSubmit}
          loading={isLoadingSignUp}
        />

        <div className={styles.alreadyRegisteredContainer}>
          <span>Já tem uma conta?</span>
          <Link href="/login">Faça login</Link>
        </div>
      </section>
    </div>
  );
};

export default SignUpPage;
