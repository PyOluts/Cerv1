import { apiClient } from './axios';
import { 
  Todo, 
  PaginatedResponse, 
  TodoFilters, 
  CreateTodoDTO, 
  UpdateTodoDTO 
} from './types';

// Используем ту же вложенность ответа, что и в бекенде ({ status, data })
interface ApiResponse<T> {
  status: string;
  data: T;
}

export const todoApi = {
  getTodos: async (filters: TodoFilters): Promise<PaginatedResponse<Todo>> => {
    // В findAll GET / мы возвращали напрямую PaginatedResponse (data, meta)
    const { data } = await apiClient.get<PaginatedResponse<Todo>>('/todos', { params: filters });
    return data;
  },

  getTodoById: async (id: string): Promise<Todo> => {
    const { data } = await apiClient.get<ApiResponse<Todo>>(`/todos/${id}`);
    return data.data;
  },

  createTodo: async (dto: CreateTodoDTO): Promise<Todo> => {
    const { data } = await apiClient.post<ApiResponse<Todo>>('/todos', dto);
    return data.data;
  },

  updateTodo: async (id: string, dto: UpdateTodoDTO): Promise<Todo> => {
    const { data } = await apiClient.patch<ApiResponse<Todo>>(`/todos/${id}`, dto);
    return data.data;
  },

  toggleTodoStatus: async (id: string): Promise<Todo> => {
    const { data } = await apiClient.patch<ApiResponse<Todo>>(`/todos/${id}/toggle`);
    return data.data;
  },

  deleteTodo: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`/todos/${id}`);
  },

  bulkDeleteTodos: async (ids: string[]): Promise<string> => {
    // Для метода DELETE тело передается через поле data
    const { data } = await apiClient.delete<{ status: string, message: string }>('/todos/bulk', {
      data: { ids }
    });
    return data.message;
  }
};
