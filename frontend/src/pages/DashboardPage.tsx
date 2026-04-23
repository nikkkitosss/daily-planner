import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import StatusMessage from "../components/common/StatusMessage";
import Surface from "../components/common/Surface";
import { eventService } from "../services/event.service";
import { EventItem } from "../types/api";
import { formatCalendarTimeRange, toCalendarDateKey } from "../utils/calendar";
import { getErrorMessage } from "../utils/error";

const DashboardPage = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const allEvents = await eventService.all();
        setEvents(allEvents);
      } catch (e) {
        setError(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const todayEvents = useMemo(() => {
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    return events
      .filter((event) => toCalendarDateKey(event.startTime) === todayKey)
      .sort(
        (left, right) =>
          new Date(left.startTime).getTime() -
          new Date(right.startTime).getTime(),
      );
  }, [events]);

  if (loading) {
    return <div className="text-slate-600">Loading dashboard...</div>;
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Today's events"
        description="Only events scheduled for today."
      />

      {error && <StatusMessage kind="error" message={error} />}

      <Surface className="overflow-hidden">
        <div className="border-b border-slate-200/70 px-5 py-4 sm:px-6">
          <h3 className="text-base font-semibold text-slate-900">Today</h3>
          <p className="mt-1 text-sm text-slate-500">
            {todayEvents.length} event{todayEvents.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="space-y-3 p-5 sm:p-6">
          {todayEvents.length === 0 ? (
            <StatusMessage
              kind="empty"
              message="No events scheduled for today"
            />
          ) : (
            todayEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="truncate text-lg font-semibold text-slate-900">
                      {event.title}
                    </h4>
                    {event.description ? (
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {event.description}
                      </p>
                    ) : null}
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-200">
                    {formatCalendarTimeRange(event.startTime, event.endTime)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Surface>
    </section>
  );
};

export default DashboardPage;
