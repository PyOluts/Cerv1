import { TodoFilters } from './types';

// Фабрика ключей для React Query
// Подробнее про паттерн фабрики ключей:
// https://tkdodo.eu/blog/effective-react-query-keys
export const queryKeys = {
  todos: {
    all: ['todos'] as const,
    lists: () => [...queryKeys.todos.all, 'list'] as const,
    list: (filters: TodoFilters) => [...queryKeys.todos.lists(), filters] as const,
    details: () => [...queryKeys.todos.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.todos.details(), id] as const,
  }
};
