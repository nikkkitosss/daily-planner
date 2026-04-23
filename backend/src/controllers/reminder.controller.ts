import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createReminder,
  deleteReminder,
  getReminderById,
  getReminders,
  updateReminder,
} from "../services/reminder.service";
import { requireAuthUser } from "../utils/requireAuthUser";
import { getIdParam } from "../utils/getParam";

export const createReminderHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    const reminder = await createReminder(auth.userId, req.body);
    res.status(201).json({ reminder });
  },
);

export const getRemindersHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    const reminders = await getReminders(auth.userId, {
      isSent: req.query.isSent as boolean | undefined,
      from: req.query.from as Date | undefined,
      to: req.query.to as Date | undefined,
    });
    res.status(200).json({ reminders });
  },
);

export const getReminderByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    const reminder = await getReminderById(
      auth.userId,
      getIdParam(req.params.id),
    );
    res.status(200).json({ reminder });
  },
);

export const updateReminderHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    const reminder = await updateReminder(
      auth.userId,
      getIdParam(req.params.id),
      req.body,
    );
    res.status(200).json({ reminder });
  },
);

export const deleteReminderHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    await deleteReminder(auth.userId, getIdParam(req.params.id));
    res.status(204).send();
  },
);
