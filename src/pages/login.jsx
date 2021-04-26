import Head from 'next/head';

import { AbstractSquares, PersonWithSmartphone } from '~/assets';
import { Input, Button } from '~/components/common';
import styles from '~/styles/pages/LoginPage.module.scss';

const Login = () => (
  <div className={styles.container}>
    <Head>
      <title>Login | Taskboard</title>
    </Head>

    <section className={styles.loginSection}>
      <h1>Login</h1>
      <p>Seja bem vindo de volta!</p>
      <form>
        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="nome@dominio.com"
          required
        />
        <Input
          name="password"
          label="Senha"
          type="password"
          placeholder="********"
          minLength={8}
          required
        />
        <Button type="submit">Login</Button>
        <div className={styles.center}>
          <span>
            Não tem uma conta? <a href="">Registre-se</a>
          </span>
        </div>
      </form>
    </section>
    <section className={styles.decorativeSection}>
      <AbstractSquares className={styles.decorativeAbstractSquares} />
      <AbstractSquares className={styles.decorativeAbstractSquares} />
      <AbstractSquares className={styles.decorativeAbstractSquares} />
      <PersonWithSmartphone className={styles.PersonWithSmartphone} />
    </section>
  </div>
);

export default Login;
