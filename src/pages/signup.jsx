import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useRef } from 'react';

import api from '~/api';
import { AbstractSquares, PersonWithPosters } from '~/assets';
import { SignUpForm } from '~/components/homePage';
import styles from '~/styles/pages/SignUpPage.module.scss';
import * as errors from '~/utils/errors';

const SignUpPage = () => {
  const signUpFormRef = useRef(null);

  const registerAccount = useCallback(async (accountInfo) => {
    await api.post('/accounts/signup', accountInfo);
  }, []);

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
        await registerAccount({ firstName, lastName, email, password });
      } catch (error) {
        handleSignUpError(error);
      }
    },
    [registerAccount, handleSignUpError],
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
