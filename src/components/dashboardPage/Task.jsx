import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';

import { CheckMarkIcon } from '~/assets';
import styles from '~/styles/components/dashboardPage/Task.module.scss';

const Task = ({
  id,
  name,
  priority,
  checked = false,
  onTaskClick,
  onCheck,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const taskData = useMemo(
    () => ({
      id,
      name,
      priority,
      isChecked,
    }),
    [id, name, isChecked, priority],
  );

  const toggleCheckedState = useCallback(() => {
    setIsChecked((currentCheckedState) => {
      const newCheckedState = !currentCheckedState;
      onCheck?.({ ...taskData, isChecked: newCheckedState });
      return newCheckedState;
    });
  }, [onCheck, taskData]);

  const handleTaskClick = useCallback(() => {
    onTaskClick?.(taskData);
  }, [onTaskClick, taskData]);

  return (
    <div className={clsx(styles.container, isChecked && styles.checked)}>
      <button
        className={styles.checkMarkButton}
        type="button"
        onClick={toggleCheckedState}
      >
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
      <button
        className={styles.taskClickableArea}
        type="button"
        onClick={handleTaskClick}
      >
        Abrir tarefa
      </button>
    </div>
  );
};

export default Task;
