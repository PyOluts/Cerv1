// Общие типы для фронтенда и бэкенда
// В реальном проекте этот пакет можно настроить через npm workspaces

export interface ITodo {
  _id: string; // Mongo String ID
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface TodoFilters {
  page?: number;
  limit?: number;
  search?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTodoDTO {
  title: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface UpdateTodoDTO extends Partial<CreateTodoDTO> {}

// Alias so that client code can import either `ITodo` or `Todo`
export type Todo = ITodo;
