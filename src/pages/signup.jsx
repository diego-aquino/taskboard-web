import Head from 'next/head';
import Link from 'next/link';
import { useCallback } from 'react';

import { AbstractSquares, PersonWithPosters } from '~/assets';
import { Button, Input } from '~/components/common';
import styles from '~/styles/pages/SignUpPage.module.scss';

const SignUpPage = () => {
  const handleFormSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Registrar-se | Taskboard</title>
      </Head>

      <div className={styles.decorativeSectionContainer}>
        <AbstractSquares className={styles.decorativeSquares} />
        <AbstractSquares className={styles.decorativeSquares} />
        <AbstractSquares className={styles.decorativeSquares} />
        <PersonWithPosters className={styles.personWithPosters} />
      </div>

      <div className={styles.signUpSection}>
        <h1>Registre-se</h1>
        <p>E gerencie as suas tarefas com eficiência!</p>

        <form onSubmit={handleFormSubmit}>
          <div className={styles.twoColumnInputContainer}>
            <Input type="text" name="firstName" label="Nome" required />
            <Input type="text" name="lastName" label="Sobrenome" required />
          </div>
          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="nome@dominio.com"
            required
          />
          <div className={styles.twoColumnInputContainer}>
            <Input
              type="password"
              name="password"
              label="Senha"
              placeholder="********"
              minLength={8}
              required
            />
            <Input
              type="password"
              name="confirmPassword"
              label="Confirmar senha"
              placeholder="********"
              minLength={8}
              required
            />
          </div>
          <Button type="submit">Registrar</Button>
        </form>

        <div className={styles.alreadyRegisteredContainer}>
          <span>Já tem uma conta?</span>
          <Link href="/login">Faça login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
