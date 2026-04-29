import { Router } from 'express';
import { TodoController } from './todo.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { createTodoSchema, updateTodoSchema, queryTodoSchema } from './todo.schema';

const router = Router();

// GET
router.get('/', validateRequest(queryTodoSchema), TodoController.findAll);
router.get('/:id', TodoController.findOne);

// POST
router.post('/', validateRequest(createTodoSchema), TodoController.create);

// PATCH
router.patch('/:id/toggle', TodoController.toggleStatus); // Тоггл статуса
router.patch('/:id', validateRequest(updateTodoSchema), TodoController.update); // Обновление

// DELETE
router.delete('/bulk', TodoController.deleteBulk); // Bulk delete (ОБЯЗАТЕЛЬНО перед /:id)
router.delete('/:id', TodoController.delete); // Одиночное удаление

export default router;
