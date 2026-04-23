import DayColumn from "./DayColumn";
import {
  CalendarItem,
  getStartOfWeek,
  getWeekDates,
} from "../../utils/calendar";

type WeekCalendarProps = {
  items: CalendarItem[];
};

const WeekCalendar = ({ items }: WeekCalendarProps) => {
  const today = new Date();
  const weekDates = getWeekDates(today);
  const startOfWeek = getStartOfWeek(today);
  const weekEnd = new Date(startOfWeek);
  weekEnd.setDate(startOfWeek.getDate() + 6);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white/95 px-5 py-5 shadow-sm shadow-slate-200/40 sm:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            Week view
          </p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">
            {startOfWeek.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}{" "}
            -{" "}
            {weekEnd.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </h3>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">
          Tasks and events grouped by day.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-7 xl:items-stretch">
        {weekDates.map((date) => {
          const isToday = date.toDateString() === today.toDateString();
          return (
            <DayColumn
              key={date.toISOString()}
              date={date}
              items={items}
              isToday={isToday}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WeekCalendar;
