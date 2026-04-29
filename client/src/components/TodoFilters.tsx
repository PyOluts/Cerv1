import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';

export const TodoFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Читаем начальное состояние URL
  const initialSearch = searchParams.get('search') || '';
  const [searchValue, setSearchValue] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchValue, 300); // 300ms defer

  useEffect(() => {
    // Синхронизация debounce поиска с URL
    if (debouncedSearch !== (searchParams.get('search') || '')) {
      const newParams = new URLSearchParams(searchParams);
      if (debouncedSearch) newParams.set('search', debouncedSearch);
      else newParams.delete('search');
      
      // При новом поиске разумно скидывать пагинацию на первую страницу
      newParams.set('page', '1');
      setSearchParams(newParams);
    }
  }, [debouncedSearch, searchParams, setSearchParams]);

  // Универсальный обработчик для селектов
  const handleChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded shadow-sm">
      <input 
        id="todo-search-input"
        type="text" 
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Поиск... (Нажмите /)"
        className="flex-1 px-4 py-2 border rounded focus:ring-2"
      />
      
      <select 
        value={searchParams.get('status') || ''} 
        onChange={(e) => handleChange('status', e.target.value)}
        className="px-4 py-2 border rounded"
      >
        <option value="">Все статусы</option>
        <option value="true">Выполненные</option>
        <option value="false">Активные</option>
      </select>

      <select 
        value={searchParams.get('priority') || ''} 
        onChange={(e) => handleChange('priority', e.target.value)}
        className="px-4 py-2 border rounded"
      >
        <option value="">Все приоритеты</option>
        <option value="low">Низкий (Low)</option>
        <option value="medium">Средний (Medium)</option>
        <option value="high">Высокий (High)</option>
      </select>
    </div>
  );
};
