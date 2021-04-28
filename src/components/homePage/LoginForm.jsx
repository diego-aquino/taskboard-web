import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { Input, Button, Alert } from '~/components/common';
import styles from '~/styles/components/homePage/LoginForm.module.scss';
import * as validate from '~/utils/validation';

const LoginForm = ({ onValidSubmit }, ref) => {
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const [globalAlertMessage, setGlobalAlertMessage] = useState(null);

  const setCustomAlertMessage = useCallback(({ global: globalMessage }) => {
    if (globalMessage !== undefined) setGlobalAlertMessage(globalMessage);
  }, []);

  useImperativeHandle(ref, () => ({ setCustomAlertMessage }), [
    setCustomAlertMessage,
  ]);

  const fieldsAreValid = useCallback(async () => {
    const inputRefs = [emailInputRef, passwordInputRef];

    const validationResults = await Promise.all(
      inputRefs.map((inputRef) => inputRef.current?.validate()),
    );

    return validationResults.every((result) => result === true);
  }, []);

  const validatePassword = useCallback(async (password) => {
    await validate.requiredPasswordField(password, 8);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!fieldsAreValid()) return;

      const [email, password] = [emailInputRef, passwordInputRef].map(
        (inputRef) => inputRef.current?.value,
      );

      onValidSubmit?.({ email, password });
    },
    [fieldsAreValid, onValidSubmit],
  );

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <Input
        ref={emailInputRef}
        name="email"
        type="email"
        label="Email"
        validate={validate.requiredEmailField}
        placeholder="nome@dominio.com"
        required
      />
      <Input
        ref={passwordInputRef}
        name="password"
        type="password"
        label="Senha"
        placeholder="********"
        minLength={8}
        validate={validatePassword}
        required
      />

      {globalAlertMessage && (
        <Alert
          className={styles.globalAlertContainer}
          message={globalAlertMessage}
        />
      )}

      <Button type="submit">Login</Button>
    </form>
  );
};

export default forwardRef(LoginForm);
