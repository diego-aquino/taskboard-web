import clsx from 'clsx';

import { LoadingIcon } from '~/assets';
import styles from '~/styles/components/common/Button.module.scss';

const Button = ({ loading: isLoading, className, children, ...rest }) => (
  <button
    className={clsx(styles.container, isLoading && styles.loading, className)}
    type="button"
    disabled={isLoading}
    {...rest}
  >
    <div className={styles.childrenContainer}>{children}</div>
    {isLoading && <LoadingIcon />}
  </button>
);

export default Button;
