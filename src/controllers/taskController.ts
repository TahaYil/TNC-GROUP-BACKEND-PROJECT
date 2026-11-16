import { Request, Response } from "express";
import { taskStore } from "../data/taskStore";
import { TaskPriority, TaskStatus, taskStatuses } from "../types/task";

function positiveInt(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export const taskController = {
  create(req: Request, res: Response): void {
    const task = taskStore.create(req.body);
    res.status(201).json(task);
  },
  list(req: Request, res: Response): void {
    const page = positiveInt(req.query.page, 1);
    const limit = Math.min(positiveInt(req.query.limit, 10), 100);
    const search = String(req.query.search ?? "").trim().toLocaleLowerCase("tr-TR");
    const status = req.query.status ? String(req.query.status) : undefined;
    const priority = req.query.priority ? String(req.query.priority) : undefined;
    const assignee = req.query.assignee ? String(req.query.assignee).toLocaleLowerCase("tr-TR") : undefined;
    const project = req.query.project ? String(req.query.project).toLocaleLowerCase("tr-TR") : undefined;

    const filtered = taskStore.list().filter((task) => {
      const searchable = `${task.title} ${task.description} ${task.assignee} ${task.project ?? ""}`.toLocaleLowerCase("tr-TR");
      return (!search || searchable.includes(search))
        && (!status || task.status === status)
        && (!priority || task.priority === priority)
        && (!assignee || task.assignee.toLocaleLowerCase("tr-TR").includes(assignee))
        && (!project || (task.project ?? "").toLocaleLowerCase("tr-TR").includes(project));
    });
    const start = (page - 1) * limit;
    res.json({ data: filtered.slice(start, start + limit), pagination: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) } });
  },
  get(req: Request, res: Response): void {
    const task = taskStore.get(req.params.id);
    if (!task) { res.status(404).json({ message: "Görev bulunamadı." }); return; }
    res.json(task);
  },
  update(req: Request, res: Response): void {
    const task = taskStore.update(req.params.id, req.body);
    if (!task) { res.status(404).json({ message: "Görev bulunamadı." }); return; }
    res.json(task);
  },
  remove(req: Request, res: Response): void {
    if (!taskStore.delete(req.params.id)) { res.status(404).json({ message: "Görev bulunamadı." }); return; }
    res.status(204).send();
  },
  report(_req: Request, res: Response): void {
    const all = taskStore.list();
    const byStatus = Object.fromEntries(taskStatuses.map((status) => [status, all.filter((task) => task.status === status).length])) as Record<TaskStatus, number>;
    const byPriority: Record<TaskPriority, number> = { dusuk: 0, orta: 0, yuksek: 0 };
    all.forEach((task) => { byPriority[task.priority] += 1; });
    res.json({ total: all.length, completed: byStatus.tamamlandi, pending: byStatus.bekliyor, inProgress: byStatus["devam-ediyor"], byStatus, byPriority });
  }
};
