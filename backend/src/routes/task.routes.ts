import { Router } from "express";
import {
  createTaskHandler,
  deleteTaskHandler,
  getTaskByIdHandler,
  getTasksHandler,
  updateTaskHandler,
  updateTaskStatusHandler,
} from "../controllers/task.controller";
import { validate } from "../middleware/validate.middleware";
import {
  createTaskSchema,
  getTasksQuerySchema,
  taskIdSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "../schemas/task.schema";

const router = Router();

router.post("/", validate(createTaskSchema), createTaskHandler);
router.get("/", validate(getTasksQuerySchema), getTasksHandler);
router.get("/:id", validate(taskIdSchema), getTaskByIdHandler);
router.patch("/:id", validate(updateTaskSchema), updateTaskHandler);
router.delete("/:id", validate(taskIdSchema), deleteTaskHandler);
router.patch(
  "/:id/status",
  validate(updateTaskStatusSchema),
  updateTaskStatusHandler,
);

export default router;
