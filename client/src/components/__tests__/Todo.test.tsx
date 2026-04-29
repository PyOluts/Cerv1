import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { todoApi } from '../../api/todoApi';

jest.mock('../../api/todoApi');

import { TodoList } from '../TodoList';
import { TodoFilters } from '../TodoFilters';
import { TodoForm } from '../TodoForm';
const mockedApi = todoApi as jest.Mocked<typeof todoApi>;

const createTestQueryClient = () => new QueryClient({
  defaultOptions: { queries: { retry: false } }
});

describe('Интеграционные UI тесты Todo', () => {
  let queryClient: QueryClient;
  
  beforeEach(() => {
    queryClient = createTestQueryClient();
    // Mock confirm globally so no real dialog blocks the test runner
    window.confirm = jest.fn(() => true);
    mockedApi.getTodos.mockResolvedValue({ 
      data: [{ _id: '1', title: 'Тестовая задача', completed: false, priority: 'medium', userId: '1', createdAt: '', updatedAt: '' }], 
      meta: { total: 1, limit: 10, page: 1, totalPages: 1, hasMore: false } 
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <TodoFilters />
        <TodoForm />
        <TodoList />
      </MemoryRouter>
    </QueryClientProvider>
  );

  it('Триггеры фильтров (change status) вызывают fetch с правильными queryParams', async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText('Тестовая задача')).toBeInTheDocument());

    const select = screen.getByDisplayValue('Все статусы');
    fireEvent.change(select, { target: { value: 'true' } });

    await waitFor(() => {
      // getTodos должен вызваться с объектом, в котором completed = true
      expect(mockedApi.getTodos).toHaveBeenLastCalledWith(expect.objectContaining({ completed: true }));
    });
  });

  it('Оптимистичные обновления: добавление сразу отображается в UI до ответа сервера', async () => {
    // Делаем искуственную задержку ответа от API на 200мс
    mockedApi.createTodo.mockImplementation(() => 
      new Promise((resolve) => setTimeout(() => resolve({ 
        _id: '2', title: 'Моментальная магия', completed: false, priority: 'medium', userId: '1', createdAt: '', updatedAt: '' 
      }), 200))
    );

    renderComponent();
    await waitFor(() => expect(screen.getByText('Тестовая задача')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText('Что нужно сделать? (Нажмите N)'), { target: { value: 'Моментальная магия' } });
    fireEvent.click(screen.getByText('Добавить'));

    // Проверка ОПТИМИСТИЧНОГО рендеринга
    await waitFor(() => {
      expect(screen.getByText('Моментальная магия')).toBeInTheDocument();
    });
  });

  it('Rollback состояния: UI откатывается при ошибке сервера', async () => {
    // API отклоняет запрос с задержкой, чтобы мы успели увидеть оптимистичное состояние
    mockedApi.deleteTodo.mockImplementation(() => 
      new Promise((_, reject) => setTimeout(() => reject(new Error('Network error')), 100))
    );

    renderComponent();
    await waitFor(() => expect(screen.getByText('Тестовая задача')).toBeInTheDocument());

    const delButton = screen.getByText('Удалить');

    fireEvent.click(delButton);

    // ОПТИМИСТИЧНОЕ удаление — ждём пока React применит optimistic update
    await waitFor(() => {
      expect(screen.queryByText('Тестовая задача')).not.toBeInTheDocument();
    });

    // ПОСЛЕ получения ошибки кэш возвращается назад
    await waitFor(() => {
      expect(screen.getByText('Тестовая задача')).toBeInTheDocument();
    });
  });
});
