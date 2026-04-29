import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import todoRoutes from '../todo.routes';
import { Todo } from '../todo.model';

const app = express();
app.use(express.json());
// Заглушка для req.user, так как у нас пока нет реальной авторизации
app.use((req, res, next) => {
  (req as any).user = { id: '65e55e55e55e55e55e55e55e' };
  next();
});
app.use('/api/todos', todoRoutes);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Todo.deleteMany({});
});

describe('Todo API Endpoints', () => {
  describe('GET /api/todos', () => {
    it('Должен возвращать пустой список и мета-поля при пустой БД', async () => {
      const res = await request(app).get('/api/todos');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.meta.total).toBe(0);
      expect(res.body.meta.page).toBe(1);
    });

    it('Должен правильно находить задачи по частичному $text поиску и фильтрам', async () => {
      await Todo.create([
        { userId: '65e55e55e55e55e55e55e55e', title: 'Купить молоко', priority: 'high', completed: false },
        { userId: '65e55e55e55e55e55e55e55e', title: 'Купить хлеб', priority: 'low', completed: true },
        { userId: '65e55e55e55e55e55e55e55e', title: 'Починить кран', priority: 'medium', completed: false }
      ]);
      
      const res = await request(app).get('/api/todos?search=Купить&priority=high&completed=false');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe('Купить молоко');
    });
  });

  describe('Ошибки валидации Zod', () => {
    it('Должен отбрасывать POST без title', async () => {
      const res = await request(app).post('/api/todos').send({ priority: 'medium' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
      expect(res.body.errors[0].path).toContain('title');
    });

    it('Должен отбрасывать некорректную пагинацию (page - не число)', async () => {
      const res = await request(app).get('/api/todos?page=invalid');
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
    });
  });
});
