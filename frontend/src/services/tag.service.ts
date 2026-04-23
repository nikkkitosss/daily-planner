import { api } from "./http";
import { PaginatedResult, Tag } from "../types/api";
import { DEFAULT_PAGE_LIMIT, paginateClientSide } from "../utils/pagination";

export const tagService = {
  async list(input?: {
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResult<Tag>> {
    const { data } = await api.get<{ tags: Tag[] }>("/tags");
    return paginateClientSide(
      data.tags,
      input?.limit ?? DEFAULT_PAGE_LIMIT,
      input?.offset ?? 0,
    );
  },

  async create(input: { name: string }): Promise<Tag> {
    const { data } = await api.post<{ tag: Tag }>("/tags", input);
    return data.tag;
  },

  async update(id: string, input: { name: string }): Promise<Tag> {
    const { data } = await api.patch<{ tag: Tag }>(`/tags/${id}`, input);
    return data.tag;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/tags/${id}`);
  },

  async attachToTask(tagId: string, taskId: string): Promise<void> {
    await api.post(`/tags/${tagId}/tasks/${taskId}`);
  },

  async detachFromTask(tagId: string, taskId: string): Promise<void> {
    await api.delete(`/tags/${tagId}/tasks/${taskId}`);
  },
};
