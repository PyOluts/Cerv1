import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoApi } from '../api/todoApi';
import { queryKeys } from '../api/queryKeys';
import { TodoFilters, CreateTodoDTO, UpdateTodoDTO, Todo, PaginatedResponse } from '../api/types';

export const useTodos = (filters: TodoFilters = {}) => {
  const queryClient = useQueryClient();
  const listKey = queryKeys.todos.list(filters);

  // GET LIST
  const todosQuery = useQuery({
    queryKey: listKey,
    queryFn: () => todoApi.getTodos(filters),
  });

  // CREATE (Оптимистичное добавление во все списки)
  const createMutation = useMutation({
    mutationFn: (newTodo: CreateTodoDTO) => todoApi.createTodo(newTodo),
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.todos.lists() });
      const previousQueries = queryClient.getQueriesData({ queryKey: queryKeys.todos.lists() });
      
      const tempId = `temp-${Date.now()}`;
      const optimisticTodo: Todo = {
        _id: tempId,
        userId: 'temp-user',
        title: newTodo.title,
        description: newTodo.description || '',
        completed: newTodo.completed || false,
        priority: newTodo.priority || 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueriesData<PaginatedResponse<Todo>>({ queryKey: queryKeys.todos.lists() }, (old) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: [optimisticTodo, ...old.data], 
        };
      });

      return { previousQueries };
    },
    onError: (_err, _newTodo, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todos.lists() });
    },
  });

  // TOGGLE STATUS
  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => todoApi.toggleTodoStatus(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.todos.lists() });
      const previousQueries = queryClient.getQueriesData({ queryKey: queryKeys.todos.lists() });

      queryClient.setQueriesData<PaginatedResponse<Todo>>({ queryKey: queryKeys.todos.lists() }, (old) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((todo) => 
            todo._id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        };
      });

      return { previousQueries };
    },
    onError: (_err, _id, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todos.lists() });
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string, dto: UpdateTodoDTO }) => todoApi.updateTodo(id, dto),
    onMutate: async ({ id, dto }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.todos.lists() });
      const previousQueries = queryClient.getQueriesData({ queryKey: queryKeys.todos.lists() });

      queryClient.setQueriesData<PaginatedResponse<Todo>>({ queryKey: queryKeys.todos.lists() }, (old) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((todo) => 
            todo._id === id ? { ...todo, ...dto } : todo
          ),
        };
      });

      return { previousQueries };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todos.lists() });
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: (id: string) => todoApi.deleteTodo(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.todos.lists() });
      const previousQueries = queryClient.getQueriesData({ queryKey: queryKeys.todos.lists() });

      queryClient.setQueriesData<PaginatedResponse<Todo>>({ queryKey: queryKeys.todos.lists() }, (old) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.filter((todo) => todo._id !== id),
        };
      });

      return { previousQueries };
    },
    onError: (_err, _id, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todos.lists() });
    },
  });

  return {
    todosQuery,
    create: createMutation.mutate,
    toggleStatus: toggleStatusMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
  };
};
