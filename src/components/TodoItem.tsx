import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface TodoItemProps {
  todo: Todo;
  handleDeleteTodo: (id: number) => void;
  isDeleting: boolean;
  isUpdating: boolean;
  status: boolean;
  isToggleAll: boolean;
  loading?: boolean;
  handleStatusTodo: (todo: Todo) => void;
  handleUpdateTodo: (todo: Todo, newTitle: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  handleDeleteTodo,
  isDeleting,
  loading,
  handleStatusTodo,
  handleUpdateTodo,
  setError,
  isUpdating,
  status,
  isToggleAll,
}) => {
  const { completed, title, id } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setNewTitle(title);
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    setIsSubmitting(true);

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === title) {
      setIsEditing(false);
      setIsSubmitting(false);

      return;
    }

    if (!trimmedTitle) {
      handleDeleteTodo(id);
      setIsSubmitting(false);

      return;
    }

    try {
      await handleUpdateTodo(todo, trimmedTitle);
      setIsEditing(false);
    } catch (e) {
      setIsEditing(true);
      setError('Unable to update a todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlur = () => {
    if (!isSubmitting) {
      handleSubmit();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(title);
    }
  };

  return (
    <div>
      <div
        key={todo.id}
        data-cy="Todo"
        className={`todo ${completed ? 'completed' : ''}`}
        onDoubleClick={handleDoubleClick}
      >
        <label className="todo__status-label" aria-label="status">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onClick={() => handleStatusTodo(todo)}
          />
        </label>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onBlur={handleBlur}
              ref={inputRef}
              onKeyUp={handleKeyUp}
              onKeyDown={handleKeyDown}
            />
          </form>
        ) : (
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
        )}
        {isEditing ? (
          ''
        ) : (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
            style={{ display: isEditing ? 'none' : 'block' }}
            disabled={isDeleting}
          >
            {isDeleting ? '' : '×'}
          </button>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active':
              loading || isDeleting || isUpdating || status || isToggleAll,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </div>
  );
};
