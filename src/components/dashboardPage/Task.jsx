import clsx from 'clsx';
import { useCallback, useState } from 'react';

import { CheckMarkIcon } from '~/assets';
import styles from '~/styles/components/dashboardPage/Task.module.scss';

const Task = ({ name, priority, completed: isCompleted = false }) => {
  const [isChecked, setIsChecked] = useState(isCompleted);

  const toggleCheckedState = useCallback(() => {
    setIsChecked((currentCheckedState) => !currentCheckedState);
  }, []);

  return (
    <div className={clsx(styles.container, isChecked && styles.checked)}>
      <button type="button" onClick={toggleCheckedState}>
        <div
          className={clsx(
            styles.checkMark,
            styles[`${priority}Priority`],
            isChecked && styles.checked,
          )}
        >
          {isChecked && <CheckMarkIcon />}
        </div>
        {isChecked ? 'Marcar como não completa' : 'Marcar como completa'}
      </button>
      <span className={styles.name}>{name}</span>
    </div>
  );
};

export default Task;
