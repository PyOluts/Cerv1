import { useEffect } from 'react';

export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea';

      // Закрытие/расфокус
      if (e.key === 'Escape') {
        (document.activeElement as HTMLElement)?.blur();
        return;
      }

      // Не перехватываем горячие клавиши, если пользователь уже печатает
      if (isInput) return;

      // N — создать задачу
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        document.getElementById('todo-create-input')?.focus();
      }

      // / — поиск
      if (e.key === '/') {
        e.preventDefault();
        document.getElementById('todo-search-input')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
