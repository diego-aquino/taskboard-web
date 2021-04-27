import clsx from 'clsx';
import { useEffect, useState } from 'react';

import styles from '~/styles/components/common/SwitchButton.module.scss';

const SwitchButton = ({
  leftName,
  leftValue,
  rightName,
  rightValue,
  onChange,
}) => {
  const [activeSideName, setActiveSideName] = useState(leftName);

  useEffect(() => {
    onChange?.(activeSideName);
  }, [onChange, activeSideName]);

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={clsx(activeSideName !== leftName && styles.inactive)}
        onClick={() => setActiveSideName(leftName)}
      >
        <div className={styles.decorativeCircle} />
        {leftValue}
      </button>
      <button
        type="button"
        className={clsx(activeSideName !== rightName && styles.inactive)}
        onClick={() => setActiveSideName(rightName)}
      >
        <div className={styles.decorativeCircle} />
        {rightValue}
      </button>
    </div>
  );
};

export default SwitchButton;
