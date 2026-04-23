import { api } from "./http";
import { PaginatedResult, Reminder } from "../types/api";
import { DEFAULT_PAGE_LIMIT, paginateClientSide } from "../utils/pagination";

export type ReminderFilters = {
  isSent?: boolean;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
};

export const reminderService = {
  async list(
    filters: ReminderFilters = {},
  ): Promise<PaginatedResult<Reminder>> {
    const { data } = await api.get<{ reminders: Reminder[] }>("/reminders", {
      params: {
        isSent:
          typeof filters.isSent === "boolean"
            ? String(filters.isSent)
            : undefined,
        from: filters.from,
        to: filters.to,
      },
    });

    return paginateClientSide(
      data.reminders,
      filters.limit ?? DEFAULT_PAGE_LIMIT,
      filters.offset ?? 0,
    );
  },

  async create(input: {
    message: string;
    remindAt: string;
    isSent?: boolean;
  }): Promise<Reminder> {
    const { data } = await api.post<{ reminder: Reminder }>(
      "/reminders",
      input,
    );
    return data.reminder;
  },

  async update(
    id: string,
    input: {
      message?: string;
      remindAt?: string;
      isSent?: boolean;
    },
  ): Promise<Reminder> {
    const { data } = await api.patch<{ reminder: Reminder }>(
      `/reminders/${id}`,
      input,
    );
    return data.reminder;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/reminders/${id}`);
  },
};
