import Head from 'next/head';
import Link from 'next/link';
import { useRef } from 'react';

import { AbstractSquares, PersonWithSmartphone } from '~/assets';
import { LoginForm } from '~/components/homePage';
import styles from '~/styles/pages/LoginPage.module.scss';

const LoginPage = () => {
  const loginFormRef = useRef(null);

  return (
    <div className={styles.container}>
      <Head>
        <title>Login | Taskboard</title>
      </Head>

      <section className={styles.loginSection}>
        <h1>Login</h1>
        <p>Seja bem vindo de volta!</p>

        <LoginForm ref={loginFormRef} />

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
