import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import StatusMessage from "../components/common/StatusMessage";
import Surface from "../components/common/Surface";
import WeekCalendar from "../components/calendar/WeekCalendar";
import { eventService } from "../services/event.service";
import { taskService } from "../services/task.service";
import { Task, EventItem } from "../types/api";
import {
  buildCalendarItems,
  getWeekDates,
  toCalendarDateKey,
} from "../utils/calendar";
import { getErrorMessage } from "../utils/error";

type ViewMode = "list" | "week";

const CalendarPage = () => {
  const [mode, setMode] = useState<ViewMode>("week");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const [taskItems, eventItems] = await Promise.all([
          taskService.all(),
          eventService.all(),
        ]);
        setTasks(taskItems);
        setEvents(eventItems);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const calendarItems = useMemo(() => {
    const allItems = buildCalendarItems(tasks, events);
    const weekKeys = new Set(
      getWeekDates(new Date()).map((date) =>
        toCalendarDateKey(date.toISOString()),
      ),
    );

    return allItems.filter((item) => weekKeys.has(item.date));
  }, [events, tasks]);

  const sortedItems = useMemo(() => {
    return [...calendarItems].sort((left, right) => {
      if (left.date !== right.date) {
        return left.date.localeCompare(right.date);
      }

      const leftTime = left.timeLabel || "99:99";
      const rightTime = right.timeLabel || "99:99";
      return leftTime.localeCompare(rightTime);
    });
  }, [calendarItems]);

  const weekDates = useMemo(() => getWeekDates(new Date()), []);
  const unscheduledTaskCount = tasks.filter((task) => !task.dueDate).length;

  return (
    <section className="space-y-6">
      <PageHeader
        title="Weekly calendar"
        description="A simple seven-day view for the current week, grouped by day and kept intentionally lightweight."
        action={
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm shadow-slate-200/30">
            <button
              type="button"
              onClick={() => setMode("list")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "list"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => setMode("week")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "week"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Week
            </button>
          </div>
        }
      />

      {error && <StatusMessage kind="error" message={error} />}

      {loading ? (
        <Surface>
          <div className="p-6 text-slate-600">Loading calendar...</div>
        </Surface>
      ) : mode === "week" ? (
        <WeekCalendar items={calendarItems} />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
          <Surface className="overflow-hidden">
            <div className="border-b border-slate-200/70 px-5 py-4 sm:px-6">
              <h3 className="text-base font-semibold text-slate-900">
                Current week agenda
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Everything scheduled for the current seven-day window.
              </p>
            </div>

            <div className="space-y-3 p-5 sm:p-6">
              {sortedItems.length === 0 ? (
                <StatusMessage
                  kind="empty"
                  message="No tasks or events are scheduled this week"
                />
              ) : (
                sortedItems.map((item) => {
                  const label = item.kind === "task" ? "Task" : "Event";

                  return (
                    <div
                      key={`${item.kind}-${item.id}`}
                      className={`rounded-2xl border p-4 ${
                        item.kind === "task"
                          ? "border-brand-200 bg-brand-50/50"
                          : "border-sky-200 bg-sky-50/50"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {label}
                          </p>
                          <h4 className="mt-1 text-base font-semibold text-slate-900">
                            {item.title}
                          </h4>
                          {item.description ? (
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {item.description}
                            </p>
                          ) : null}
                        </div>
                        {item.timeLabel ? (
                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-inset ring-slate-200">
                            {item.timeLabel}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Surface>

          <Surface>
            <div className="border-b border-slate-200/70 px-5 py-4 sm:px-6">
              <h3 className="text-base font-semibold text-slate-900">
                Week range
              </h3>
              <p className="mt-1 text-sm text-slate-500">Mon through Sun</p>
            </div>
            <div className="space-y-3 p-5 sm:p-6">
              {weekDates.map((date) => (
                <div
                  key={date.toISOString()}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3"
                >
                  <p className="text-sm font-medium text-slate-900">
                    {date.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}

              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                {unscheduledTaskCount} unscheduled task
                {unscheduledTaskCount === 1 ? "" : "s"} are kept out of the
                calendar view.
              </div>
            </div>
          </Surface>
        </div>
      )}
    </section>
  );
};

export default CalendarPage;
