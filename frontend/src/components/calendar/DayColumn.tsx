import EventCard from "./EventCard";
import {
  CalendarItem,
  formatCalendarDayLabel,
  getCalendarDayItems,
} from "../../utils/calendar";

type DayColumnProps = {
  date: Date;
  items: CalendarItem[];
  isToday: boolean;
};

const DayColumn = ({ date, items, isToday }: DayColumnProps) => {
  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const dayItems = getCalendarDayItems(items, dateKey);

  return (
    <div
      className={`flex min-h-80 flex-col rounded-3xl border bg-white/95 p-4 shadow-sm shadow-slate-200/40 ${
        isToday ? "border-brand-500" : "border-slate-200/80"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-200/70 pb-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            {date.toLocaleDateString("en-US", { weekday: "short" })}
          </p>
          <h4 className="mt-1 text-lg font-semibold text-slate-900">
            {formatCalendarDayLabel(date)}
          </h4>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        {dayItems.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
            No items
          </div>
        ) : (
          dayItems.map((item) => (
            <EventCard key={`${item.kind}-${item.id}`} item={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default DayColumn;
