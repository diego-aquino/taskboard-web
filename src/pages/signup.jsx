import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import * as yup from 'yup';

import api from '~/api';
import { AbstractSquares, PersonWithPosters } from '~/assets';
import { Alert, Button, Input } from '~/components/common';
import styles from '~/styles/pages/SignUpPage.module.scss';
import * as errors from '~/utils/errors';
import * as validate from '~/utils/validation';

const { ValidationError } = yup;

const SignUpPage = () => {
  const inputRefs = {
    firstName: useRef(null),
    lastName: useRef(null),
    email: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };
  const [emailCustomAlertMessage, setEmailCustomAlertMessage] = useState(null);
  const [globalAlertMessage, setGlobalAlertMessage] = useState(null);

  const validatePassword = useCallback(async (password) => {
    await validate.requiredPasswordField(password, 8);
  }, []);

  const validateConfirmedPassword = useCallback(
    async (confirmedPassword) => {
      await validate.requiredTextField(confirmedPassword);

      const password = inputRefs.password.current?.value;
      const passwordsDidMatch = password === confirmedPassword;

      if (!passwordsDidMatch) {
        throw new ValidationError('As senhas não conferem');
      }
    },
    [inputRefs.password],
  );

  const handleSignUpError = useCallback((error) => {
    const errorType = errors.getNetworkErrorType(error.response);
    const message = errors.generateNetworkErrorMessage(errorType);

    switch (errorType) {
      case errors.types.EMAIL_ALREADY_IN_USE: {
        return setEmailCustomAlertMessage(message);
      }
      default:
        return setGlobalAlertMessage(message);
    }
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const inputElements = Object.values(inputRefs).map((ref) => ref.current);

    const validationResults = await Promise.all(
      inputElements.map((element) => element.validate()),
    );
    const allFieldsAreValid = validationResults.every(
      (result) => result === true,
    );
    if (!allFieldsAreValid) return;

    const [firstName, lastName, email, password] = [
      inputRefs.firstName,
      inputRefs.lastName,
      inputRefs.email,
      inputRefs.password,
    ].map((ref) => ref.current?.value);

    try {
      await api.post('/accounts/signup', {
        firstName,
        lastName,
        email,
        password,
      });
    } catch (error) {
      handleSignUpError(error);
    }
  };

  const preventSubmitByPressingEnter = useCallback((event) => {
    if (event.key !== 'Enter') return;
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

        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <form
          onSubmit={handleFormSubmit}
          onKeyDown={preventSubmitByPressingEnter}
        >
          <div className={styles.twoColumnInputContainer}>
            <Input
              ref={inputRefs.firstName}
              type="text"
              name="firstName"
              label="Nome"
              validate={validate.requiredTextField}
              required
            />
            <Input
              ref={inputRefs.lastName}
              type="text"
              name="lastName"
              label="Sobrenome"
              validate={validate.requiredTextField}
              required
            />
          </div>
          <Input
            ref={inputRefs.email}
            type="email"
            name="email"
            label="Email"
            placeholder="nome@dominio.com"
            validate={validate.requiredEmailField}
            customAlertMessage={emailCustomAlertMessage}
            required
          />
          <div className={styles.twoColumnInputContainer}>
            <Input
              ref={inputRefs.password}
              type="password"
              name="password"
              label="Senha"
              placeholder="********"
              minLength={8}
              validate={validatePassword}
              required
            />
            <Input
              ref={inputRefs.confirmPassword}
              type="password"
              name="confirmPassword"
              label="Confirmar senha"
              placeholder="********"
              minLength={8}
              validate={validateConfirmedPassword}
              required
            />
          </div>

          {globalAlertMessage && (
            <Alert
              className={styles.globalAlertContainer}
              message={globalAlertMessage}
            />
          )}

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
