import { NextFunction, Request, Response } from "express";
import { taskPriorities, taskStatuses } from "../types/task";

const requiredFields = ["title", "description", "priority", "assignee"] as const;
const stringFields = ["title", "description", "assignee", "project"] as const;

export function validateTask(isPartial = false) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      res.status(400).json({ message: "İstek gövdesi JSON nesnesi olmalıdır." });
      return;
    }

    const errors: string[] = [];
    if (!isPartial) {
      for (const field of requiredFields) {
        if (body[field] === undefined || body[field] === null || body[field] === "") errors.push(`${field} alanı zorunludur.`);
      }
    } else if (Object.keys(body).length === 0) {
      errors.push("Güncelleme için en az bir alan gönderilmelidir.");
    }

    for (const field of stringFields) {
      if (body[field] !== undefined && (typeof body[field] !== "string" || (field !== "project" && body[field].trim() === ""))) {
        errors.push(`${field} alanı boş olmayan bir metin olmalıdır.`);
      }
    }
    if (body.priority !== undefined && !taskPriorities.includes(body.priority)) {
      errors.push(`priority alanı şu değerlerden biri olmalıdır: ${taskPriorities.join(", ")}.`);
    }
    if (body.status !== undefined && !taskStatuses.includes(body.status)) {
      errors.push(`status alanı şu değerlerden biri olmalıdır: ${taskStatuses.join(", ")}.`);
    }

    if (errors.length) {
      res.status(400).json({ message: "Görev doğrulaması başarısız.", errors });
      return;
    }
    next();
  };
}
