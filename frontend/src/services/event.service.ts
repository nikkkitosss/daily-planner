import { api } from "./http";
import { EventItem, PaginatedResult } from "../types/api";
import { DEFAULT_PAGE_LIMIT, paginateClientSide } from "../utils/pagination";

export type EventFilters = {
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
};

export const eventService = {
  async all(): Promise<EventItem[]> {
    const { data } = await api.get<{ events: EventItem[] }>("/events");
    return data.events;
  },

  async list(filters: EventFilters = {}): Promise<PaginatedResult<EventItem>> {
    const { data } = await api.get<{ events: EventItem[] }>("/events", {
      params: {
        from: filters.from,
        to: filters.to,
      },
    });

    return paginateClientSide(
      data.events,
      filters.limit ?? DEFAULT_PAGE_LIMIT,
      filters.offset ?? 0,
    );
  },

  async create(input: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
  }): Promise<EventItem> {
    const { data } = await api.post<{ event: EventItem }>("/events", input);
    return data.event;
  },

  async update(
    id: string,
    input: {
      title?: string;
      description?: string | null;
      startTime?: string;
      endTime?: string;
    },
  ): Promise<EventItem> {
    const { data } = await api.patch<{ event: EventItem }>(
      `/events/${id}`,
      input,
    );
    return data.event;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },
};
