import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import * as yup from 'yup';

import { Alert, Button, Input } from '~/components/common';
import styles from '~/styles/components/homePage/SignUpForm.module.scss';
import * as validate from '~/utils/validation';

const { ValidationError } = yup;

const SignUpForm = ({ onValidSubmit }, ref) => {
  const firstNameInputRef = useRef(null);
  const lastNameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  const [globalAlertMessage, setGlobalAlertMessage] = useState(null);

  const setCustomAlertMessage = useCallback(
    ({ global: globalMessage, email: emailMessage }) => {
      if (globalMessage !== undefined) setGlobalAlertMessage(globalMessage);
      if (emailMessage !== undefined)
        emailInputRef.current?.setCustomAlertMessage(emailMessage);
    },
    [],
  );

  useImperativeHandle(ref, () => ({ setCustomAlertMessage }), [
    setCustomAlertMessage,
  ]);

  const validatePassword = useCallback(async (password) => {
    await validate.requiredPasswordField(password, 8);
  }, []);

  const validateConfirmedPassword = useCallback(async (confirmedPassword) => {
    await validate.requiredTextField(confirmedPassword);

    const password = passwordInputRef.current?.value;
    const passwordsDidMatch = password === confirmedPassword;

    if (!passwordsDidMatch) {
      throw new ValidationError('As senhas não conferem');
    }
  }, []);

  const allFieldsAreValid = useCallback(async () => {
    const inputRefs = [
      firstNameInputRef,
      lastNameInputRef,
      emailInputRef,
      passwordInputRef,
      confirmPasswordInputRef,
    ];

    const validationResults = await Promise.all(
      inputRefs.map((inputRef) => inputRef.current?.validate()),
    );

    return validationResults.every((result) => result === true);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!allFieldsAreValid()) return;

      const [firstName, lastName, email, password] = [
        firstNameInputRef,
        lastNameInputRef,
        emailInputRef,
        passwordInputRef,
      ].map((inputRef) => inputRef.current?.value);

      onValidSubmit?.({ firstName, lastName, email, password });
    },
    [allFieldsAreValid, onValidSubmit],
  );

  const preventSubmitByPressingEnter = useCallback((event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
  }, []);

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.twoColumnInputContainer}>
        <Input
          ref={firstNameInputRef}
          type="text"
          name="firstName"
          label="Nome"
          validate={validate.requiredTextField}
          onKeyDown={preventSubmitByPressingEnter}
          required
        />
        <Input
          ref={lastNameInputRef}
          type="text"
          name="lastName"
          label="Sobrenome"
          validate={validate.requiredTextField}
          onKeyDown={preventSubmitByPressingEnter}
          required
        />
      </div>
      <Input
        ref={emailInputRef}
        type="email"
        name="email"
        label="Email"
        placeholder="nome@dominio.com"
        validate={validate.requiredEmailField}
        onKeyDown={preventSubmitByPressingEnter}
        required
      />
      <div className={styles.twoColumnInputContainer}>
        <Input
          ref={passwordInputRef}
          type="password"
          name="password"
          label="Senha"
          placeholder="********"
          minLength={8}
          validate={validatePassword}
          onKeyDown={preventSubmitByPressingEnter}
          required
        />
        <Input
          ref={confirmPasswordInputRef}
          type="password"
          name="confirmPassword"
          label="Confirmar senha"
          placeholder="********"
          minLength={8}
          validate={validateConfirmedPassword}
          onKeyDown={preventSubmitByPressingEnter}
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
  );
};

export default forwardRef(SignUpForm);
