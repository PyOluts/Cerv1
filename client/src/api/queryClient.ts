import { QueryClient } from '@tanstack/react-query';

// Создаем и настраиваем инстанс QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 минут (данные считаются свежими, автоматический refetch не будет триггериться)
      // В React Query v5 'cacheTime' был переименован в 'gcTime' (Garbage Collection Time)
      gcTime: 1000 * 60 * 15, // 15 минут (время удержания неактивных данных в кэше)
      refetchOnWindowFocus: false, // Не перезапрашивать данные при смене вкладок браузера
      retry: 1, // Количество дополнительных попыток при сбое запроса
    },
  },
});
