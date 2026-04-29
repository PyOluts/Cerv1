import { z } from 'zod';

// Схема валидации для создания Todo (title обязателен)
export const createTodoSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }).min(1, "Title cannot be empty"),
    description: z.string().optional(),
    completed: z.boolean().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dueDate: z.string().datetime().optional().or(z.date().optional()),
  })
});

// Схема валидации для обновления Todo
export const updateTodoSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Todo ID format"),
  }),
  body: z.object({
    title: z.string().min(1, "Title cannot be empty").optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dueDate: z.string().datetime().optional().or(z.date().optional()),
  }).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  })
});

// Схема валидации для параметров запроса (Query)
export const queryTodoSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page must be a number").optional().transform(Number),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional().transform(Number),
    search: z.string().optional(),
    completed: z.enum(['true', 'false']).optional().transform((val) => val === 'true'),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
});

// TypeScript типы на основе схем Zod
export type CreateTodoInput = z.infer<typeof createTodoSchema>['body'];
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>['body'];
export type QueryTodoInput = z.infer<typeof queryTodoSchema>['query'];
