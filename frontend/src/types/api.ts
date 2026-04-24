export type ApiErrorResponse = {
  message: string;
  errors?: unknown;
};

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type AuthResponse = {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type Tag = {
  id: string;
  name: string;
  userId: string;
};

export type TaskTag = {
  taskId: string;
  tagId: string;
  tag: Tag;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  userId: string;
  createdAt: string;
  taskTags: TaskTag[];
};

export type EventItem = {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  userId: string;
};

export type Reminder = {
  id: string;
  message: string;
  remindAt: string;
  isSent: boolean;
  userId: string;
};

export type PaginationMeta = {
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
};

export type PaginatedResult<T> = {
  items: T[];
  meta: PaginationMeta;
};
