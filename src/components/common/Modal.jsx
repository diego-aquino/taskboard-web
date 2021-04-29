import clsx from 'clsx';
import { useEffect } from 'react';

import styles from '~/styles/components/common/Modal.module.scss';

const Modal = ({
  active: isActive = false,
  onClose,
  className,
  children,
  ...rest
}) => {
  useEffect(() => {
    if (!isActive) return;

    const closeOnEscapeKeyPressed = (event) => {
      if (event.key !== 'Escape') return;
      onClose?.(event);
    };

    window.addEventListener('keydown', closeOnEscapeKeyPressed);

    // eslint-disable-next-line consistent-return
    return () => window.removeEventListener('keydown', closeOnEscapeKeyPressed);
  }, [isActive, onClose]);

  return (
    <div
      className={clsx(styles.container, isActive && styles.active, className)}
      {...rest}
    >
      <div className={styles.innerContainer}>{children}</div>
      <button
        className={styles.clickableBackground}
        type="button"
        onClick={onClose}
      >
        Fechar
      </button>
    </div>
  );
};

export default Modal;
