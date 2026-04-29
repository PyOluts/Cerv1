import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateRequest = (schema: AnyZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      // Update request properties with successfully parsed and transformed values
      if (parsedData.body) req.body = parsedData.body;
      if (parsedData.query) req.query = parsedData.query;
      if (parsedData.params) req.params = parsedData.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
         return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.errors
        });
      }
      return res.status(400).json({ status: 'error', message: 'Unknown validation error' });
    }
  };
