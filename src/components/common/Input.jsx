import clsx from 'clsx';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import styles from '~/styles/components/common/Input.module.scss';

import Alert from './Alert';

const Input = (
  {
    label,
    name,
    validate,
    variant = 'normal',
    className,
    onChange,
    onBlur,
    ...rest
  },
  ref,
) => {
  const [value, setValue] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);

  const executeValidation = useCallback(
    async (valueToValidate) => {
      if (!validate) return true;

      try {
        await validate(valueToValidate);
        setAlertMessage(null);
        return true;
      } catch (validationError) {
        setAlertMessage(validationError.message);
        return false;
      }
    },
    [validate],
  );

  useImperativeHandle(
    ref,
    () => ({
      value,
      isValid: !alertMessage,
      validate: () => executeValidation(value),
      setCustomAlertMessage: (customAlertMessage) =>
        setAlertMessage(customAlertMessage),
      clear: () => setValue(''),
    }),
    [value, alertMessage, executeValidation],
  );

  const handleChange = useCallback(
    (event) => {
      setValue(event.target.value);
      onChange?.(event);
    },
    [onChange],
  );

  const handleBlur = useCallback(
    async (event) => {
      executeValidation(event.target.value);
      onBlur?.(event);
    },
    [onBlur, executeValidation],
  );

  return (
    <div
      className={clsx(
        styles.container,
        styles[variant],
        alertMessage && styles.withAlert,
        className,
      )}
    >
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        value={value}
        onBlur={handleBlur}
        onChange={handleChange}
        {...rest}
      />

      {alertMessage && (
        <Alert className={styles.alertContainer} message={alertMessage} />
      )}
    </div>
  );
};

export default forwardRef(Input);
