import { FormEvent, useEffect, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import StatusMessage from "../components/common/StatusMessage";
import Surface from "../components/common/Surface";
import { eventService } from "../services/event.service";
import { EventItem } from "../types/api";
import { getErrorMessage } from "../utils/error";
import { toDatetimeLocalValue, toIsoFromLocal } from "../utils/date";

const EVENT_LIMIT = 10;

const EventsPage = () => {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventService.list({ limit: EVENT_LIMIT, offset });
      setItems(response.items);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [offset]);

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: "", description: "", startTime: "", endTime: "" });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        startTime: toIsoFromLocal(form.startTime) || "",
        endTime: toIsoFromLocal(form.endTime) || "",
      };

      if (editingId) {
        await eventService.update(editingId, payload);
        setMessage("Event updated");
      } else {
        await eventService.create(payload);
        setMessage("Event created");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (event: EventItem) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description || "",
      startTime: toDatetimeLocalValue(event.startTime),
      endTime: toDatetimeLocalValue(event.endTime),
    });
  };

  const onDelete = async (id: string) => {
    try {
      await eventService.remove(id);
      setMessage("Event deleted");
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="Events"
        description="Plan meetings and time blocks in a clean, scannable list."
      />

      {message && <StatusMessage kind="success" message={message} />}
      {error && <StatusMessage kind="error" message={error} />}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <Surface className="overflow-hidden">
          <div className="border-b border-slate-200/70 px-5 py-4 sm:px-6">
            <h3 className="text-base font-semibold text-slate-900">
              Event list
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Upcoming and recent items shown in time order.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            {loading ? (
              <p className="text-slate-600">Loading events...</p>
            ) : items.length === 0 ? (
              <StatusMessage kind="empty" message="No events found" />
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 space-y-2">
                        <h4 className="truncate text-base font-semibold text-slate-900">
                          {item.title}
                        </h4>
                        <p className="text-sm leading-6 text-slate-600">
                          {item.description || "No description"}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                          {new Date(item.startTime).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(item.endTime).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                          onClick={() => onEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                          onClick={() => onDelete(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-slate-200/70 pt-4">
              <button
                type="button"
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={offset === 0}
                onClick={() =>
                  setOffset((prev) => Math.max(0, prev - EVENT_LIMIT))
                }
              >
                Previous
              </button>
              <span className="text-sm text-slate-500">
                Showing {items.length} events
              </span>
              <button
                type="button"
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={items.length < EVENT_LIMIT}
                onClick={() => setOffset((prev) => prev + EVENT_LIMIT)}
              >
                Next
              </button>
            </div>
          </div>
        </Surface>

        <Surface className="lg:sticky lg:top-24">
          <div className="border-b border-slate-200/70 px-5 py-4 sm:px-6">
            <h3 className="text-base font-semibold text-slate-900">
              {editingId ? "Edit event" : "New event"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Keep the editor focused on title and time range.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 p-5 sm:p-6">
            <input
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
            <textarea
              className="min-h-28 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />
            <input
              type="datetime-local"
              lang="en-US"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              value={form.startTime}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, startTime: e.target.value }))
              }
              required
            />
            <input
              type="datetime-local"
              lang="en-US"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              value={form.endTime}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, endTime: e.target.value }))
              }
              required
            />

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-200 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update event"
                    : "Create event"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </Surface>
      </div>
    </section>
  );
};

export default EventsPage;
