import { FormEvent, useEffect, useMemo, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import StatusMessage from "../components/common/StatusMessage";
import Surface from "../components/common/Surface";
import { tagService } from "../services/tag.service";
import { taskService } from "../services/task.service";
import { Tag, Task, TaskPriority, TaskStatus } from "../types/api";
import { getErrorMessage } from "../utils/error";

const TASK_LIMIT = 10;

const TasksPage = () => {
  const [items, setItems] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "TODO" as TaskStatus,
    priority: "MEDIUM" as TaskPriority,
    dueDate: "",
    tagIds: [] as string[],
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [tasksResponse, tagsResponse] = await Promise.all([
        taskService.list({ limit: TASK_LIMIT, offset }),
        tagService.list({ limit: 1000, offset: 0 }),
      ]);

      setItems(tasksResponse.items);
      setTags(tagsResponse.items);
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
    setForm({
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
      dueDate: "",
      tagIds: [],
    });
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
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate
          ? new Date(form.dueDate).toISOString()
          : undefined,
        tagIds: form.tagIds.length > 0 ? form.tagIds : undefined,
      };

      if (editingId) {
        await taskService.update(editingId, payload);
        setMessage("Task updated");
      } else {
        await taskService.create(payload);
        setMessage("Task created");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (task: Task) => {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.slice(0, 16) : "",
      tagIds: task.taskTags.map((tt) => tt.tagId),
    });
  };

  const onDelete = async (id: string) => {
    setError(null);
    setMessage(null);

    try {
      await taskService.remove(id);
      setMessage("Task deleted");
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const onStatus = async (id: string, status: TaskStatus) => {
    try {
      await taskService.updateStatus(id, status);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const selectedTags = useMemo(() => new Set(form.tagIds), [form.tagIds]);

  return (
    <section className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Create tasks, attach labels, and keep the queue easy to scan."
      />

      {message && <StatusMessage kind="success" message={message} />}
      {error && <StatusMessage kind="error" message={error} />}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <Surface className="overflow-hidden">
          <div className="border-b border-slate-200/70 px-5 py-4 sm:px-6">
            <h3 className="text-base font-semibold text-slate-900">
              Task list
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Latest items first, with quick status controls.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            {loading ? (
              <p className="text-slate-600">Loading tasks...</p>
            ) : items.length === 0 ? (
              <StatusMessage kind="empty" message="No tasks found" />
            ) : (
              <ul className="space-y-3">
                {items.map((task) => (
                  <li
                    key={task.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 space-y-2">
                        <div>
                          <h4 className="truncate text-base font-semibold text-slate-900">
                            {task.title}
                          </h4>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {task.description || "No description"}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                          <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-inset ring-slate-200">
                            {task.status}
                          </span>
                          <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-inset ring-slate-200">
                            {task.priority}
                          </span>
                          {task.dueDate ? (
                            <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-inset ring-slate-200">
                              Due{" "}
                              {new Date(task.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          ) : null}
                        </div>

                        {task.taskTags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {task.taskTags.map((tagRef) => (
                              <span
                                key={tagRef.tagId}
                                className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
                              >
                                {tagRef.tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        <select
                          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                          value={task.status}
                          onChange={(e) =>
                            onStatus(task.id, e.target.value as TaskStatus)
                          }
                        >
                          <option value="TODO">TODO</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="DONE">DONE</option>
                        </select>
                        <button
                          type="button"
                          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                          onClick={() => onEdit(task)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                          onClick={() => onDelete(task.id)}
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
                  setOffset((prev) => Math.max(0, prev - TASK_LIMIT))
                }
              >
                Previous
              </button>
              <span className="text-sm text-slate-500">
                Showing {items.length} tasks
              </span>
              <button
                type="button"
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={items.length < TASK_LIMIT}
                onClick={() => setOffset((prev) => prev + TASK_LIMIT)}
              >
                Next
              </button>
            </div>
          </div>
        </Surface>

        <Surface className="lg:sticky lg:top-24">
          <div className="border-b border-slate-200/70 px-5 py-4 sm:px-6">
            <h3 className="text-base font-semibold text-slate-900">
              {editingId ? "Edit task" : "New task"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Keep this form focused on the essentials.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 p-5 sm:p-6">
            <input
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              placeholder="Task title"
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

            <div className="grid grid-cols-2 gap-3">
              <select
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    status: e.target.value as TaskStatus,
                  }))
                }
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
              <select
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                value={form.priority}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    priority: e.target.value as TaskPriority,
                  }))
                }
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>

            <input
              type="datetime-local"
              lang="en-US"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              value={form.dueDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, dueDate: e.target.value }))
              }
            />

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Tags</p>
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? (
                  tags.map((tag) => {
                    const active = selectedTags.has(tag.id);

                    return (
                      <button
                        type="button"
                        key={tag.id}
                        onClick={() => {
                          setForm((prev) => {
                            const next = new Set(prev.tagIds);
                            if (next.has(tag.id)) {
                              next.delete(tag.id);
                            } else {
                              next.add(tag.id);
                            }

                            return { ...prev, tagIds: Array.from(next) };
                          });
                        }}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                          active
                            ? "border-brand-200 bg-brand-50 text-brand-700"
                            : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {tag.name}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500">
                    Create tags first to attach them here.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-200 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update task"
                    : "Create task"}
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

export default TasksPage;
