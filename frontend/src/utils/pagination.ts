import { PaginatedResult } from "../types/api";

export const DEFAULT_PAGE_LIMIT = 10;

export const paginateClientSide = <T>(
  items: T[],
  limit: number,
  offset: number,
): PaginatedResult<T> => {
  const safeLimit = Math.max(1, limit);
  const safeOffset = Math.max(0, offset);
  const slice = items.slice(safeOffset, safeOffset + safeLimit);

  return {
    items: slice,
    meta: {
      total: items.length,
      limit: safeLimit,
      offset: safeOffset,
      hasNext: safeOffset + safeLimit < items.length,
    },
  };
};
