import { Router } from "express";
import { getProfile, patchProfile } from "../controllers/user.controller";
import { validate } from "../middleware/validate.middleware";
import { updateProfileSchema } from "../schemas/user.schema";
import { emptyRequestSchema } from "../schemas/common";

const router = Router();

router.get("/profile", validate(emptyRequestSchema), getProfile);
router.patch("/profile", validate(updateProfileSchema), patchProfile);

export default router;
