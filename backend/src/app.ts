import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import taskRoutes from "./routes/task.routes";
import eventRoutes from "./routes/event.routes";
import reminderRoutes from "./routes/reminder.routes";
import tagRoutes from "./routes/tag.routes";
import { authMiddleware } from "./middleware/auth.middleware";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middleware/error.middleware";
import { env } from "./config/env";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRoutes);

app.use(authMiddleware);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/events", eventRoutes);
app.use("/reminders", reminderRoutes);
app.use("/tags", tagRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
