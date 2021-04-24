import clsx from 'clsx';

import styles from '~/styles/components/common/Button.module.scss';

const Button = ({ className, children, ...rest }) => (
  <button className={clsx(styles.container, className)} type="button" {...rest}>
    {children}
  </button>
);

export default Button;
