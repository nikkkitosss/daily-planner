import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
} from "../services/event.service";
import { requireAuthUser } from "../utils/requireAuthUser";
import { getIdParam } from "../utils/getParam";

export const createEventHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    const event = await createEvent(auth.userId, req.body);
    res.status(201).json({ event });
  },
);

export const getEventsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    const events = await getEvents(auth.userId, {
      from: req.query.from as Date | undefined,
      to: req.query.to as Date | undefined,
    });
    res.status(200).json({ events });
  },
);

export const getEventByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    const event = await getEventById(auth.userId, getIdParam(req.params.id));
    res.status(200).json({ event });
  },
);

export const deleteEventHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    await deleteEvent(auth.userId, getIdParam(req.params.id));
    res.status(204).send();
  },
);

export const updateEventHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    const event = await updateEvent(
      auth.userId,
      getIdParam(req.params.id),
      req.body,
    );
    res.status(200).json({ event });
  },
);
