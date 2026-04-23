import { FormEvent, useEffect, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import StatusMessage from "../components/common/StatusMessage";
import Surface from "../components/common/Surface";
import { reminderService } from "../services/reminder.service";
import { Reminder } from "../types/api";
import { getErrorMessage } from "../utils/error";
import { toDatetimeLocalValue, toIsoFromLocal } from "../utils/date";

const REMINDER_LIMIT = 10;

const RemindersPage = () => {
  const [items, setItems] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const [form, setForm] = useState({
    message: "",
    remindAt: "",
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await reminderService.list({
        limit: REMINDER_LIMIT,
        offset,
      });
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
    setForm({ message: "", remindAt: "" });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const payload = {
        message: form.message,
        remindAt: toIsoFromLocal(form.remindAt) || "",
      };

      if (editingId) {
        await reminderService.update(editingId, payload);
        setMessage("Reminder updated");
      } else {
        await reminderService.create(payload);
        setMessage("Reminder created");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (item: Reminder) => {
    setEditingId(item.id);
    setForm({
      message: item.message,
      remindAt: toDatetimeLocalValue(item.remindAt),
    });
  };

  const onDelete = async (id: string) => {
    try {
      await reminderService.remove(id);
      setMessage("Reminder deleted");
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="Reminders"
        description="Track one-off notifications and whether they have already been sent."
      />

      {message && <StatusMessage kind="success" message={message} />}
      {error && <StatusMessage kind="error" message={error} />}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <Surface className="overflow-hidden">
          <div className="border-b border-slate-200/70 px-5 py-4 sm:px-6">
            <h3 className="text-base font-semibold text-slate-900">
              Reminder list
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Upcoming reminders are shown with their state.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            {loading ? (
              <p className="text-slate-600">Loading reminders...</p>
            ) : items.length === 0 ? (
              <StatusMessage kind="empty" message="No reminders found" />
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
                          {item.message}
                        </h4>
                        <p className="text-xs font-medium text-slate-500">
                          {new Date(item.remindAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}{" "}
                          · {item.isSent ? "Sent" : "Pending"}
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
                  setOffset((prev) => Math.max(0, prev - REMINDER_LIMIT))
                }
              >
                Previous
              </button>
              <span className="text-sm text-slate-500">
                Showing {items.length} reminders
              </span>
              <button
                type="button"
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={items.length < REMINDER_LIMIT}
                onClick={() => setOffset((prev) => prev + REMINDER_LIMIT)}
              >
                Next
              </button>
            </div>
          </div>
        </Surface>

        <Surface className="lg:sticky lg:top-24">
          <div className="border-b border-slate-200/70 px-5 py-4 sm:px-6">
            <h3 className="text-base font-semibold text-slate-900">
              {editingId ? "Edit reminder" : "New reminder"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              A focused form for short, actionable reminders.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 p-5 sm:p-6">
            <input
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              placeholder="Reminder message"
              value={form.message}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, message: e.target.value }))
              }
              required
            />
            <input
              type="datetime-local"
              lang="en-US"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              value={form.remindAt}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, remindAt: e.target.value }))
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
                    ? "Update reminder"
                    : "Create reminder"}
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

export default RemindersPage;
