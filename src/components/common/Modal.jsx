import clsx from 'clsx';

import styles from '~/styles/components/common/Modal.module.scss';

const Modal = ({
  active: isActive = false,
  onClose,
  className,
  children,
  ...rest
}) => (
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

export default Modal;
