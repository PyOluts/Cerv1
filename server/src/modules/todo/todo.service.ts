import { Todo, ITodo } from './todo.model';

export class TodoService {
  static async create(userId: string, data: Partial<ITodo>) {
    return Todo.create({ ...data, userId });
  }

  static async findAll(userId: string, query: any) {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 10, 100); // Жесткий лимит 100
    const skip = (page - 1) * limit;

    const filter: any = { userId };

    if (query.completed !== undefined) {
      filter.completed = query.completed;
    }

    if (query.priority) {
      filter.priority = query.priority;
    }

    if (query.search) {
      // Ищем либо через $text (по индексу), либо по regEx (если text index не срабатывает как нужно для частичных совпадений)
      // Мы добавили text index в схему, поэтому используем $text:
      filter.$text = { $search: query.search };
    }

    const sortOptions: any = {};
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
    sortOptions[sortBy] = sortOrder;

    const [data, total] = await Promise.all([
      Todo.find(filter).sort(sortOptions).skip(skip).limit(limit).lean().exec(),
      Todo.countDocuments(filter).exec()
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasMore
      }
    };
  }

  static async findOne(userId: string, id: string) {
    return Todo.findOne({ _id: id, userId }).lean();
  }

  static async update(userId: string, id: string, data: Partial<ITodo>) {
    return Todo.findOneAndUpdate({ _id: id, userId }, data, { new: true });
  }

  static async toggleStatus(userId: string, id: string) {
    const todo = await Todo.findOne({ _id: id, userId });
    if (!todo) return null;
    
    todo.completed = !todo.completed;
    return todo.save();
  }

  static async delete(userId: string, id: string) {
    return Todo.findOneAndDelete({ _id: id, userId });
  }

  static async deleteBulk(userId: string, ids: string[]) {
    return Todo.deleteMany({ _id: { $in: ids }, userId });
  }
}
