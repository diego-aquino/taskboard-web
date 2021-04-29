import { Modal } from '~/components/common';

import TaskForm from './TaskForm';

const TaskModalForm = ({
  status,
  initialValues = {},
  onCreateTask,
  onEditTask,
  onClose,
}) => {
  const modalIsActive = status !== 'closed';

  return (
    <Modal active={modalIsActive} onClose={onClose}>
      {modalIsActive && (
        <TaskForm
          initialValues={initialValues}
          onValidSubmit={status === 'create' ? onCreateTask : onEditTask}
          submitButtonText={
            status === 'create' ? 'Criar tarefa' : 'Editar tarefa'
          }
        />
      )}
    </Modal>
  );
};

export default TaskModalForm;
