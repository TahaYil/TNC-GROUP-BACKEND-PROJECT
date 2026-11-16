import { randomUUID } from "node:crypto";
import { Task, TaskInput } from "../types/task";


const tasks = new Map<string, Task>();

export const taskStore = {
  list(): Task[] {
    return [...tasks.values()];
  },
  get(id: string): Task | undefined {
    return tasks.get(id);
  },
  create(input: TaskInput): Task {
    const now = new Date().toISOString();
    const task: Task = { ...input, status: input.status ?? "bekliyor", id: randomUUID(), createdAt: now, updatedAt: now };
    tasks.set(task.id, task);
    return task;
  },
  update(id: string, input: Partial<TaskInput>): Task | undefined {
    const current = tasks.get(id);
    if (!current) return undefined;
    const updated: Task = { ...current, ...input, updatedAt: new Date().toISOString() };
    tasks.set(id, updated);
    return updated;
  },
  delete(id: string): boolean {
    return tasks.delete(id);
  }
};
