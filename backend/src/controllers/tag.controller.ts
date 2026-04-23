import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  attachTagToTask,
  createTag,
  deleteTag,
  detachTagFromTask,
  getTagById,
  getTags,
  updateTag,
} from "../services/tag.service";
import { requireAuthUser } from "../utils/requireAuthUser";
import { getIdParam } from "../utils/getParam";

export const createTagHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    const tag = await createTag(auth.userId, req.body);
    res.status(201).json({ tag });
  },
);

export const getTagsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    const tags = await getTags(auth.userId);
    res.status(200).json({ tags });
  },
);

export const getTagByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    const tag = await getTagById(auth.userId, getIdParam(req.params.id));
    res.status(200).json({ tag });
  },
);

export const updateTagHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    const tag = await updateTag(
      auth.userId,
      getIdParam(req.params.id),
      req.body,
    );
    res.status(200).json({ tag });
  },
);

export const attachTagToTaskHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    await attachTagToTask(
      auth.userId,
      getIdParam(req.params.id),
      getIdParam(req.params.taskId),
    );
    res.status(204).send();
  },
);

export const detachTagFromTaskHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    await detachTagFromTask(
      auth.userId,
      getIdParam(req.params.id),
      getIdParam(req.params.taskId),
    );
    res.status(204).send();
  },
);

export const deleteTagHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const auth = requireAuthUser(req);
    await deleteTag(auth.userId, getIdParam(req.params.id));
    res.status(204).send();
  },
);
