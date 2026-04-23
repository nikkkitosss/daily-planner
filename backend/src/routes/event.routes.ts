import { Router } from "express";
import {
  createEventHandler,
  deleteEventHandler,
  getEventByIdHandler,
  getEventsHandler,
  updateEventHandler,
} from "../controllers/event.controller";
import { validate } from "../middleware/validate.middleware";
import {
  createEventSchema,
  eventIdSchema,
  getEventsQuerySchema,
  updateEventSchema,
} from "../schemas/event.schema";

const router = Router();

router.post("/", validate(createEventSchema), createEventHandler);
router.get("/", validate(getEventsQuerySchema), getEventsHandler);
router.get("/:id", validate(eventIdSchema), getEventByIdHandler);
router.patch("/:id", validate(updateEventSchema), updateEventHandler);
router.delete("/:id", validate(eventIdSchema), deleteEventHandler);

export default router;
