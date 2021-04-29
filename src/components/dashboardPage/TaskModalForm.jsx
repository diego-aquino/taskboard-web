import { Modal } from '~/components/common';

import TaskForm from './TaskForm';

const TaskModalForm = ({
  status,
  initialValues = {},
  onCreateTask,
  onEditTask,
  onRemoveTask,
  onClose,
  loading: isLoading,
}) => {
  const modalIsActive = status !== 'closed';

  return (
    <Modal active={modalIsActive} onClose={onClose}>
      {modalIsActive && (
        <TaskForm
          initialValues={initialValues}
          onValidSubmit={status === 'create' ? onCreateTask : onEditTask}
          showRemoveButton={status === 'edit'}
          onRemoveButtonClick={onRemoveTask}
          submitButtonText={
            status === 'create' ? 'Criar tarefa' : 'Editar tarefa'
          }
          loading={isLoading}
        />
      )}
    </Modal>
  );
};

export default TaskModalForm;
