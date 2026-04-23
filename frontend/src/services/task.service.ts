import { api } from "./http";
import { PaginatedResult, Task, TaskPriority, TaskStatus } from "../types/api";
import { DEFAULT_PAGE_LIMIT, paginateClientSide } from "../utils/pagination";

export type TaskFilters = {
  status?: TaskStatus;
  priority?: TaskPriority;
  dueFrom?: string;
  dueTo?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

export const taskService = {
  async all(): Promise<Task[]> {
    const { data } = await api.get<{ tasks: Task[] }>("/tasks");
    return data.tasks;
  },

  async list(filters: TaskFilters = {}): Promise<PaginatedResult<Task>> {
    const params = {
      status: filters.status,
      priority: filters.priority,
      dueFrom: filters.dueFrom,
      dueTo: filters.dueTo,
      search: filters.search,
    };

    const { data } = await api.get<{ tasks: Task[] }>("/tasks", { params });
    return paginateClientSide(
      data.tasks,
      filters.limit ?? DEFAULT_PAGE_LIMIT,
      filters.offset ?? 0,
    );
  },

  async create(input: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    tagIds?: string[];
  }): Promise<Task> {
    const { data } = await api.post<{ task: Task }>("/tasks", input);
    return data.task;
  },

  async update(
    id: string,
    input: {
      title?: string;
      description?: string | null;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: string | null;
      tagIds?: string[];
    },
  ): Promise<Task> {
    const { data } = await api.patch<{ task: Task }>(`/tasks/${id}`, input);
    return data.task;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const { data } = await api.patch<{ task: Task }>(`/tasks/${id}/status`, {
      status,
    });
    return data.task;
  },
};
