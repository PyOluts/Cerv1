import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import todoRouter from './modules/todo/todo.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: clientUrl, credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/todos', todoRouter);

// 404 handler for unmatched routes
app.use((_req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ status: 'error', message: err.message || 'Internal Server Error' });
});

// Start server only after successful DB connection
const start = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

start();
