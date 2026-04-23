import { Router } from "express";
import {
  attachTagToTaskHandler,
  createTagHandler,
  deleteTagHandler,
  detachTagFromTaskHandler,
  getTagByIdHandler,
  getTagsHandler,
  updateTagHandler,
} from "../controllers/tag.controller";
import { validate } from "../middleware/validate.middleware";
import {
  createTagSchema,
  tagIdSchema,
  tagTaskParamsSchema,
  updateTagSchema,
} from "../schemas/tag.schema";
import { emptyRequestSchema } from "../schemas/common";

const router = Router();

router.post("/", validate(createTagSchema), createTagHandler);
router.get("/", validate(emptyRequestSchema), getTagsHandler);
router.get("/:id", validate(tagIdSchema), getTagByIdHandler);
router.patch("/:id", validate(updateTagSchema), updateTagHandler);
router.post(
  "/:id/tasks/:taskId",
  validate(tagTaskParamsSchema),
  attachTagToTaskHandler,
);
router.delete(
  "/:id/tasks/:taskId",
  validate(tagTaskParamsSchema),
  detachTagFromTaskHandler,
);
router.delete("/:id", validate(tagIdSchema), deleteTagHandler);

export default router;
