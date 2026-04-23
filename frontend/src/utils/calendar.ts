import { EventItem, Task } from "../types/api";

export type CalendarItem =
  | {
      kind: "task";
      id: string;
      title: string;
      description: string | null;
      date: string;
      timeLabel: string | null;
    }
  | {
      kind: "event";
      id: string;
      title: string;
      description: string | null;
      date: string;
      timeLabel: string | null;
    };

export const getStartOfWeek = (referenceDate: Date): Date => {
  const date = new Date(referenceDate);
  date.setHours(0, 0, 0, 0);

  const day = date.getDay();
  const distanceToMonday = (day + 6) % 7;
  date.setDate(date.getDate() - distanceToMonday);

  return date;
};

export const getWeekDates = (referenceDate: Date): Date[] => {
  const start = getStartOfWeek(referenceDate);
  return Array.from({ length: 7 }, (_, index) => {
    const nextDate = new Date(start);
    nextDate.setDate(start.getDate() + index);
    return nextDate;
  });
};

export const toCalendarDateKey = (value: string): string => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatCalendarDayLabel = (date: Date): string =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export const formatCalendarTime = (value: string): string =>
  new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

export const formatCalendarTimeRange = (
  startValue: string,
  endValue: string,
): string => {
  const startDate = new Date(startValue);
  const endDate = new Date(endValue);

  if (Number.isNaN(startDate.getTime())) {
    return "";
  }

  const startLabel = formatCalendarTime(startValue);

  if (
    Number.isNaN(endDate.getTime()) ||
    startDate.getTime() === endDate.getTime()
  ) {
    return startLabel;
  }

  return `${startLabel} - ${formatCalendarTime(endValue)}`;
};

export const buildCalendarItems = (
  tasks: Task[],
  events: EventItem[],
): CalendarItem[] => {
  const taskItems: CalendarItem[] = tasks
    .filter((task) => task.dueDate)
    .map((task) => ({
      kind: "task" as const,
      id: task.id,
      title: task.title,
      description: task.description,
      date: toCalendarDateKey(task.dueDate as string),
      timeLabel: task.dueDate ? formatCalendarTime(task.dueDate) : null,
    }));

  const eventItems: CalendarItem[] = events.map((event) => ({
    kind: "event" as const,
    id: event.id,
    title: event.title,
    description: event.description,
    date: toCalendarDateKey(event.startTime),
    timeLabel: event.startTime
      ? formatCalendarTimeRange(event.startTime, event.endTime)
      : null,
  }));

  return [...taskItems, ...eventItems];
};

export const getCalendarDayItems = (
  items: CalendarItem[],
  dateKey: string,
): CalendarItem[] => items.filter((item) => item.date === dateKey);
