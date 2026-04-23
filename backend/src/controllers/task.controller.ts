import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasksWithFilters,
  updateTask,
  updateTaskStatus,
} from "../services/task.service";
import { requireAuthUser } from "../utils/requireAuthUser";
import { getIdParam } from "../utils/getParam";

export const createTaskHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    const task = await createTask(auth.userId, req.body);
    res.status(201).json({ task });
  },
);

export const getTasksHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    const tasks = await getTasksWithFilters(auth.userId, {
      status: req.query.status as "TODO" | "IN_PROGRESS" | "DONE" | undefined,
      priority: req.query.priority as "LOW" | "MEDIUM" | "HIGH" | undefined,
      dueFrom: req.query.dueFrom as Date | undefined,
      dueTo: req.query.dueTo as Date | undefined,
      search: req.query.search as string | undefined,
    });
    res.status(200).json({ tasks });
  },
);

export const getTaskByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    const task = await getTaskById(auth.userId, getIdParam(req.params.id));
    res.status(200).json({ task });
  },
);

export const updateTaskHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    const task = await updateTask(
      auth.userId,
      getIdParam(req.params.id),
      req.body,
    );
    res.status(200).json({ task });
  },
);

export const deleteTaskHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    await deleteTask(auth.userId, getIdParam(req.params.id));
    res.status(204).send();
  },
);

export const updateTaskStatusHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    const task = await updateTaskStatus(
      auth.userId,
      getIdParam(req.params.id),
      req.body.status,
    );
    res.status(200).json({ task });
  },
);
