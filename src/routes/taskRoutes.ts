import { Router } from "express";
import { taskController } from "../controllers/taskController";
import { validateTask } from "../middleware/validateTask";

const router = Router();
router.get("/reports/summary", taskController.report);
router.post("/", validateTask(), taskController.create);
router.get("/", taskController.list);
router.get("/:id", taskController.get);
router.put("/:id", validateTask(), taskController.update);
router.patch("/:id", validateTask(true), taskController.update);
router.delete("/:id", taskController.remove);
export default router;
