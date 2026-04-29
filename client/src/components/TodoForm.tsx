import React, { useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import { CreateTodoDTO } from '../api/types';

export const TodoForm = () => {
  const { create } = useTodos();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const dto: CreateTodoDTO = { title, priority };
    
    // Вызываем мутацию
    create(dto, {
      onSuccess: () => {
        setTitle('');
        setPriority('medium');
      },
      onSettled: () => {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex gap-4 p-4 bg-blue-50 border border-blue-100 rounded shadow-sm">
      <input 
        id="todo-create-input"
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Что нужно сделать? (Нажмите N)"
        className="flex-1 px-4 py-3 border rounded text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        disabled={isSubmitting}
      />
      <select 
        value={priority} 
        onChange={(e) => setPriority(e.target.value as any)}
        className="px-4 py-3 border rounded bg-white w-48"
        disabled={isSubmitting}
      >
        <option value="low">📉 Низкий фокус</option>
        <option value="medium">⏸️ Обычная задача</option>
        <option value="high">🔥 Срочно (High)</option>
      </select>
      <button 
        type="submit" 
        disabled={isSubmitting || !title.trim()}
        className="px-8 py-3 bg-blue-600 font-semibold text-white rounded transition hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Создание...' : 'Добавить'}
      </button>
    </form>
  );
};
