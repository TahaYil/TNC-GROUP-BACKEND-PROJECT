import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes";
import { requestLogger } from "./middleware/logger";

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.get("/", (_req, res) => res.json({ name: "Task Management API", health: "ok" }));
app.use("/api/tasks", taskRoutes);
app.use((_req, res) => res.status(404).json({ message: "Endpoint bulunamadı." }));
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof SyntaxError) { res.status(400).json({ message: "Geçersiz JSON formatı." }); return; }
  console.error(err);
  res.status(500).json({ message: "Sunucu hatası oluştu." });
});
export default app;
