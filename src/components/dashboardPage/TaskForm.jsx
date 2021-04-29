import { useCallback, useRef } from 'react';

import { Button, Input } from '~/components/common';
import styles from '~/styles/components/dashboardPage/TaskForm.module.scss';
import * as validate from '~/utils/validation';

const TaskCreationForm = ({
  onValidSubmit,
  submitButtonText,
  initialValues = {},
}) => {
  const taskNameInputRef = useRef(null);
  const taskPrioritySelectRef = useRef(null);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const taskNameIsValid = await taskNameInputRef.current?.validate();
      if (!taskNameIsValid) return;

      const taskName = taskNameInputRef.current?.value;
      const taskPriority = taskPrioritySelectRef.current?.value;

      onValidSubmit?.({ name: taskName, priority: taskPriority });
    },
    [onValidSubmit],
  );

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <Input
        ref={taskNameInputRef}
        name="taskName"
        validate={validate.requiredTextField}
        variant="outline"
        placeholder="Nome..."
        initialValue={initialValues.name}
      />

      <div className={styles.prioritySelectContainer}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="taskPriority">Prioridade</label>
        <select
          ref={taskPrioritySelectRef}
          id="taskPriority"
          name="taskPriority"
          defaultValue={initialValues.priority}
        >
          <option value="high">Alta</option>
          <option value="low">Baixa</option>
        </select>
      </div>

      <Button type="submit">{submitButtonText}</Button>
    </form>
  );
};

export default TaskCreationForm;
