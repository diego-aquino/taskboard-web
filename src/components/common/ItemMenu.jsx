import clsx from 'clsx';

import styles from '~/styles/components/common/ItemMenu.module.scss';

const ItemMenu = ({ className, children, ...rest }) => (
  <div className={clsx(styles.container, className)} {...rest}>
    {children}
  </div>
);

export default ItemMenu;
