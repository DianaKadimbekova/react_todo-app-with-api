import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoSectionProps {
  todos: Todo[];
  handleDeleteTodo: (id: number) => void;
  deletingTodoId: number | null;
  tempTodo: Todo | null;
  handleStatusTodo: (todo: Todo) => void;
  loading: boolean;
  handleUpdateTodo: (todo: Todo, newTitle: string) => Promise<Todo | null>;
  setError: (error: string | null) => void;
  isUpdating: number[];
  status: number[];
  isToggleAll: boolean;
}

export const TodoSection: React.FC<TodoSectionProps> = ({
  todos,
  handleDeleteTodo,
  deletingTodoId,
  tempTodo,
  handleStatusTodo,
  loading,
  handleUpdateTodo,
  setError,
  isUpdating,
  status,
  isToggleAll,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleDeleteTodo={handleDeleteTodo}
          isDeleting={deletingTodoId === todo.id}
          handleStatusTodo={handleStatusTodo}
          loading={loading}
          handleUpdateTodo={handleUpdateTodo}
          setError={setError}
          isUpdating={isUpdating}
          status={status}
          isToggleAll={isToggleAll}
        />
      ))}
      {tempTodo && (
        <TodoItem
          handleUpdateTodo={handleUpdateTodo}
          handleStatusTodo={handleStatusTodo}
          todo={tempTodo}
          key={tempTodo.id}
          handleDeleteTodo={handleDeleteTodo}
          isDeleting={false}
          loading
          setError={setError}
          isUpdating={isUpdating}
          status={status}
          isToggleAll={isToggleAll}
        />
      )}
    </section>
  );
};
