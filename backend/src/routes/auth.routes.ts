import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { emptyRequestSchema } from "../schemas/common";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authMiddleware, validate(emptyRequestSchema), me);

export default router;
