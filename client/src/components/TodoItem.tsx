import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ITodo } from '../../../shared/types';
import { useTodos } from '../hooks/useTodos';

interface TodoItemProps {
  todo: ITodo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { toggleStatus, remove, update } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: todo._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggle = () => toggleStatus(todo._id);
  
  const handleDelete = () => {
    if (window.confirm('Точно удалить эту задачу?')) {
      remove(todo._id);
    }
  };

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      update({ id: todo._id, dto: { title: editTitle } });
    }
    setIsEditing(false);
  };

  const priorityColors = {
    low: 'bg-green-400',
    medium: 'bg-yellow-400',
    high: 'bg-red-400'
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`p-4 mb-3 flex items-center justify-between border rounded shadow-sm bg-white transition ${todo.completed ? 'opacity-60 bg-gray-50' : ''}`}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Специальная рукоятка для Drag&Drop */}
        <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-700 px-1 font-bold">
          ⋮⋮
        </div>

        <input 
          type="checkbox" 
          checked={todo.completed} 
          onChange={handleToggle} 
          className="w-5 h-5 cursor-pointer"
        />
        <span 
          className={`w-3 h-3 rounded-full ${priorityColors[todo.priority]}`} 
          title={`Приоритет: ${todo.priority}`} 
        />
        
        {isEditing ? (
          <input 
            value={editTitle} 
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
            className="flex-1 border-b focus:outline-none px-2 py-1"
          />
        ) : (
          <span 
            className={`flex-1 cursor-text text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
            onDoubleClick={() => setIsEditing(true)}
            title="Двойной клик для редактирования"
          >
            {todo.title}
          </span>
        )}
      </div>
      <div>
         <button 
           onClick={handleDelete} 
           className="text-red-500 hover:bg-red-50 px-3 py-1 rounded transition ml-4"
         >
           Удалить
         </button>
      </div>
    </div>
  );
};
