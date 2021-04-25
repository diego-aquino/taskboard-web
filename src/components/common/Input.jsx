import clsx from 'clsx';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import { AlertIcon } from '~/assets';
import styles from '~/styles/components/common/Input.module.scss';

const Input = (
  { label, name, validate, className, onBlur, onChange, ...rest },
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
        alertMessage && styles.withAlert,
        className,
      )}
    >
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={value}
        onBlur={handleBlur}
        onChange={handleChange}
        {...rest}
      />

      {alertMessage && (
        <span className={styles.alertContainer}>
          <AlertIcon />
          {alertMessage}
        </span>
      )}
    </div>
  );
};

export default forwardRef(Input);
