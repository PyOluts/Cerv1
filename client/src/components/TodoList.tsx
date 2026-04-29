import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTodos } from '../hooks/useTodos';
import { TodoItem } from './TodoItem';
import { todoApi } from '../api/todoApi';
import { queryKeys } from '../api/queryKeys';
import { TodoFilters, ITodo } from '../../../shared/types';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export const TodoList = () => {
  useKeyboardShortcuts();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Извлекаем фильтры из URL для передачи в useQuery
  const filters = useMemo<TodoFilters>(() => {
    const page = Number(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || undefined;
    const completedVal = searchParams.get('status');
    const completed = completedVal === 'true' ? true : completedVal === 'false' ? false : undefined;
    const priority = (searchParams.get('priority') as 'low'|'medium'|'high') || undefined;

    return { page, limit: 10, search, completed, priority };
  }, [searchParams]);

  const { todosQuery } = useTodos(filters);
  const { data, isLoading, isError, error, refetch } = todosQuery;

  // DND setup
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Имитируем ручную сортировку локально через кэш (mocking)
      queryClient.setQueryData(queryKeys.todos.list(filters), (oldData: any) => {
        if (!oldData) return oldData;
        const oldIndex = oldData.data.findIndex((x: ITodo) => x._id === active.id);
        const newIndex = oldData.data.findIndex((x: ITodo) => x._id === over.id);
        return {
          ...oldData,
          data: arrayMove(oldData.data, oldIndex, newIndex),
        };
      });
    }
  };

  const handleBulkDelete = async () => {
    const tempTodos = data?.data || [];
    const completedIds = tempTodos.filter((t: ITodo) => t.completed).map((t: ITodo) => t._id);
    if (!completedIds.length) return;
    if (window.confirm(`Вы уверены, что хотите массаво удалить завершенные задачи (${completedIds.length} шт.)?`)) {
       await todoApi.bulkDeleteTodos(completedIds);
       queryClient.invalidateQueries({ queryKey: queryKeys.todos.lists() });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Загрузка задач...</div>;
  if (isError) return (
    <div className="p-8 text-center bg-red-50 border border-red-200 text-red-600 rounded">
      <p>Произошла ошибка: {(error as Error).message}</p>
      <button onClick={() => refetch()} className="px-4 py-2 mt-4 bg-red-100 rounded hover:bg-red-200">
        Повторить попытку
      </button>
    </div>
  );

  const todos = data?.data || [];
  const meta = data?.meta;

  return (
    <div>
      <div className="flex justify-end mb-4">
        {todos.some((t: ITodo) => t.completed) && (
          <button 
            onClick={handleBulkDelete}
            className="text-red-500 hover:bg-red-50 px-3 py-1 rounded transition border border-red-100 text-sm font-medium"
          >
            Удалить завершенные
          </button>
        )}
      </div>

      {!todos.length ? (
        <div className="p-8 text-center text-gray-400">Список задач пуст или нет совпадений.</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={todos.map((t: ITodo) => t._id)} strategy={verticalListSortingStrategy}>
            {todos.map((todo: ITodo) => (
              <TodoItem key={todo._id} todo={todo} />
            ))}
          </SortableContext>
        </DndContext>
      )}
      
      {/* Пагинация */}
      {meta && meta.totalPages > 1 && (
        <div className="flex gap-2 mt-6 justify-center items-center">
          <button 
            disabled={meta.page <= 1}
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set('page', String(meta.page - 1));
              setSearchParams(newParams);
            }}
            className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50 transition"
          >
            Назад
          </button>
          <span className="px-4 font-medium text-gray-600">
            Страница {meta.page} из {meta.totalPages}
          </span>
          <button 
            disabled={!meta.hasMore}
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set('page', String(meta.page + 1));
              setSearchParams(newParams);
            }}
            className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50 transition"
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
};
