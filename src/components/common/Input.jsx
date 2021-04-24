import clsx from 'clsx';

import styles from '~/styles/components/common/Input.module.scss';

const Input = ({ label, name, className, ...rest }) => (
  <div className={clsx(styles.container, className)}>
    <label htmlFor={name}>{label}</label>
    <input id={name} name={name} {...rest} />
  </div>
);

export default Input;
