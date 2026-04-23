import { FormEvent, useEffect, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import StatusMessage from "../components/common/StatusMessage";
import Surface from "../components/common/Surface";
import { tagService } from "../services/tag.service";
import { taskService } from "../services/task.service";
import { Tag, Task } from "../types/api";
import { getErrorMessage } from "../utils/error";

const TAG_LIMIT = 10;

const TagsPage = () => {
  const [items, setItems] = useState<Tag[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [offset, setOffset] = useState(0);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [tagsResponse, tasksResponse] = await Promise.all([
        tagService.list({ limit: TAG_LIMIT, offset }),
        taskService.list({ limit: 1000, offset: 0 }),
      ]);
      setItems(tagsResponse.items);
      setTasks(tasksResponse.items);
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
    setName("");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      if (editingId) {
        await tagService.update(editingId, { name });
        setMessage("Tag updated");
      } else {
        await tagService.create({ name });
        setMessage("Tag created");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await tagService.remove(id);
      setMessage("Tag deleted");
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const onAttach = async () => {
    if (!selectedTagId || !selectedTaskId) {
      return;
    }

    try {
      await tagService.attachToTask(selectedTagId, selectedTaskId);
      setMessage("Tag attached to task");
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const onDetach = async () => {
    if (!selectedTagId || !selectedTaskId) {
      return;
    }

    try {
      await tagService.detachFromTask(selectedTagId, selectedTaskId);
      setMessage("Tag detached from task");
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="Tags"
        description="Create lightweight labels and attach them to tasks without cluttering the screen."
      />

      {message && <StatusMessage kind="success" message={message} />}
      {error && <StatusMessage kind="error" message={error} />}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <Surface className="overflow-hidden">
          <div className="border-b border-slate-200/70 px-5 py-4 sm:px-6">
            <h3 className="text-base font-semibold text-slate-900">Tag list</h3>
            <p className="mt-1 text-sm text-slate-500">
              Manage the labels you reuse across tasks.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            {loading ? (
              <p className="text-slate-600">Loading tags...</p>
            ) : items.length === 0 ? (
              <StatusMessage kind="empty" message="No tags found" />
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <span className="font-medium text-slate-900">
                      {item.name}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        onClick={() => {
                          setEditingId(item.id);
                          setName(item.name);
                        }}
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
                  setOffset((prev) => Math.max(0, prev - TAG_LIMIT))
                }
              >
                Previous
              </button>
              <span className="text-sm text-slate-500">
                Showing {items.length} tags
              </span>
              <button
                type="button"
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={items.length < TAG_LIMIT}
                onClick={() => setOffset((prev) => prev + TAG_LIMIT)}
              >
                Next
              </button>
            </div>
          </div>
        </Surface>

        <div className="space-y-6 lg:sticky lg:top-24">
          <Surface>
            <div className="border-b border-slate-200/70 px-5 py-4 sm:px-6">
              <h3 className="text-base font-semibold text-slate-900">
                {editingId ? "Edit tag" : "New tag"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Keep tag names short and reusable.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 p-5 sm:p-6">
              <input
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                placeholder="Tag name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-200 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update tag"
                      : "Create tag"}
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

          <Surface>
            <div className="border-b border-slate-200/70 px-5 py-4 sm:px-6">
              <h3 className="text-base font-semibold text-slate-900">
                Attach to task
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Quickly link or unlink a tag from a task.
              </p>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <select
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                value={selectedTagId}
                onChange={(e) => setSelectedTagId(e.target.value)}
              >
                <option value="">Select tag</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <select
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
              >
                <option value="">Select task</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  onClick={onAttach}
                >
                  Attach
                </button>
                <button
                  type="button"
                  className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  onClick={onDetach}
                >
                  Detach
                </button>
              </div>
            </div>
          </Surface>
        </div>
      </div>
    </section>
  );
};

export default TagsPage;
