import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFilters } from './components/TodoFilters';

const App = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Менеджер задач</h1>
      <TodoFilters />
      <TodoForm />
      <TodoList />
    </div>
  );
};

export default App;
