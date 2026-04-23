import { Router } from "express";
import {
  createReminderHandler,
  deleteReminderHandler,
  getReminderByIdHandler,
  getRemindersHandler,
  updateReminderHandler,
} from "../controllers/reminder.controller";
import { validate } from "../middleware/validate.middleware";
import {
  createReminderSchema,
  getRemindersQuerySchema,
  reminderIdSchema,
  updateReminderSchema,
} from "../schemas/reminder.schema";

const router = Router();

router.post("/", validate(createReminderSchema), createReminderHandler);
router.get("/", validate(getRemindersQuerySchema), getRemindersHandler);
router.get("/:id", validate(reminderIdSchema), getReminderByIdHandler);
router.patch("/:id", validate(updateReminderSchema), updateReminderHandler);
router.delete("/:id", validate(reminderIdSchema), deleteReminderHandler);

export default router;
