import { Request, Response } from 'express';
import { TodoService } from './todo.service';

// Функция-помощник: если middleware авторизации нет, используем заглушку ObjectId для тестов
const getUserId = (req: Request) => {
  return (req as any).user?.id || '65e55e55e55e55e55e55e55e'; 
};

export class TodoController {
  static async create(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const todo = await TodoService.create(userId, req.body);
      return res.status(201).json({ status: 'success', data: todo });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const result = await TodoService.findAll(userId, req.query);
      return res.status(200).json(result); // Строго возвращает { data, meta }
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async findOne(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const todo = await TodoService.findOne(userId, req.params.id);
      if (!todo) {
        return res.status(404).json({ status: 'error', message: 'Todo not found' });
      }
      return res.status(200).json({ status: 'success', data: todo });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const todo = await TodoService.update(userId, req.params.id, req.body);
      if (!todo) {
        return res.status(404).json({ status: 'error', message: 'Todo not found' });
      }
      return res.status(200).json({ status: 'success', data: todo });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async toggleStatus(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const todo = await TodoService.toggleStatus(userId, req.params.id);
      if (!todo) {
        return res.status(404).json({ status: 'error', message: 'Todo not found' });
      }
      return res.status(200).json({ status: 'success', data: todo });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const todo = await TodoService.delete(userId, req.params.id);
      if (!todo) {
        return res.status(404).json({ status: 'error', message: 'Todo not found' });
      }
      return res.status(200).json({ status: 'success', data: null });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async deleteBulk(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const { ids } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
         return res.status(400).json({ status: 'error', message: 'Please provide an array of ids in body' });
      }

      const result = await TodoService.deleteBulk(userId, ids);
      return res.status(200).json({ status: 'success', message: `${result.deletedCount} items deleted successfully` });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
