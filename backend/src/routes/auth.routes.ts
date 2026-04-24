import { Router } from "express";
import { login, me, refresh, register } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import {
	loginSchema,
	refreshSchema,
	registerSchema,
} from "../schemas/auth.schema";
import { emptyRequestSchema } from "../schemas/common";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);
router.get("/me", authMiddleware, validate(emptyRequestSchema), me);

export default router;
