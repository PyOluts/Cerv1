import mongoose, { Schema } from 'mongoose';

export interface ITodo {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt?: Date; // Optional as it is managed by Mongoose timestamps
  updatedAt?: Date; // Optional as it is managed by Mongoose timestamps
}

const todoSchema = new Schema<ITodo>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
todoSchema.index({ userId: 1, completed: 1 });
todoSchema.index({ userId: 1, priority: 1 });

// Text index on title for fast text search
todoSchema.index({ title: 'text' });

export const Todo = mongoose.model<ITodo>('Todo', todoSchema);
