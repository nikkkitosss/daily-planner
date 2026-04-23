import { CalendarItem } from "../../utils/calendar";

type EventCardProps = {
  item: CalendarItem;
};

const EventCard = ({ item }: EventCardProps) => {
  const isTask = item.kind === "task";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border px-4 py-4 shadow-sm transition-shadow ${
        isTask
          ? "border-brand-200 bg-brand-50/90 text-brand-950"
          : "border-sky-300 bg-white text-slate-950 shadow-sky-100/60"
      }`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-1.5 rounded-r-full ${
          isTask ? "bg-brand-500" : "bg-sky-500"
        }`}
        aria-hidden="true"
      />

      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold shadow-sm ring-1 ring-inset ${
          isTask
            ? "bg-brand-600 text-white ring-brand-500/20"
            : "bg-sky-600 text-white ring-sky-500/20"
        }`}
        aria-hidden="true"
      >
        {isTask ? "T" : "E"}
      </div>

      <div className="ml-3 min-w-0 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold leading-6 text-slate-950">
              {item.title}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {isTask ? "Task" : "Event"}
            </p>
          </div>
          {item.timeLabel ? (
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold shadow-sm ring-1 ring-inset ${
                isTask
                  ? "bg-white text-slate-700 ring-slate-200"
                  : "bg-sky-100 text-sky-900 ring-sky-200"
              }`}
            >
              {item.timeLabel}
            </span>
          ) : null}
        </div>

        {item.description ? (
          <p className="line-clamp-3 text-sm leading-6 text-slate-700">
            {item.description}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default EventCard;
