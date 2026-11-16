export const taskStatuses = ["bekliyor", "devam-ediyor", "tamamlandi"] as const;
export const taskPriorities = ["dusuk", "orta", "yuksek"] as const;

export type TaskStatus = (typeof taskStatuses)[number];
export type TaskPriority = (typeof taskPriorities)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  assignee: string;
  project?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export type TaskInput = Pick<Task, "title" | "description" | "priority" | "assignee"> & {
  project?: string;
  status?: TaskStatus;
};
