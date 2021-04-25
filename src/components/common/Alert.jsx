import clsx from 'clsx';

import { AlertIcon } from '~/assets';
import styles from '~/styles/components/common/Alert.module.scss';

const Alert = ({ message, className, ...rest }) => (
  <span className={clsx(styles.container, className)} {...rest}>
    <AlertIcon />
    {message}
  </span>
);

export default Alert;
