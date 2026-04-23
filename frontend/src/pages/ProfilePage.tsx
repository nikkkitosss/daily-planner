import { FormEvent, useEffect, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import StatusMessage from "../components/common/StatusMessage";
import Surface from "../components/common/Surface";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/user.service";
import { getErrorMessage } from "../utils/error";

const ProfilePage = () => {
  const { user, refreshMe } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      await userService.updateProfile({ name, email });
      await refreshMe();
      setMessage("Profile updated");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="Profile"
        description="Keep your account details up to date. Changes are applied immediately."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <Surface>
          <div className="border-b border-slate-200/70 px-5 py-4 sm:px-6">
            <h3 className="text-base font-semibold text-slate-900">
              Account details
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Edit the name and email tied to your session.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 p-5 sm:p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {message && <StatusMessage kind="success" message={message} />}
            {error && <StatusMessage kind="error" message={error} />}

            <button
              className="rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-200 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {loading ? "Saving..." : "Save profile"}
            </button>
          </form>
        </Surface>

        <Surface>
          <div className="p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Signed in as
            </p>
            <p className="mt-2 break-words text-lg font-semibold text-slate-900">
              {user?.email}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your profile powers the planner account and controls which data
              appears in the workspace.
            </p>
          </div>
        </Surface>
      </div>
    </section>
  );
};

export default ProfilePage;
