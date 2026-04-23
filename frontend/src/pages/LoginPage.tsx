import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import StatusMessage from "../components/common/StatusMessage";
import Surface from "../components/common/Surface";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/error";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from =
    (location.state as { from?: string } | null)?.from || "/dashboard";

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-stretch gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <Surface className="overflow-hidden">
          <div className="flex h-full flex-col justify-between gap-8 bg-gradient-to-br from-brand-600 via-sky-600 to-cyan-700 p-8 text-white sm:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                Daily Planner
              </p>
              <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Plan the day without the clutter.
              </h1>
              <p className="mt-4 max-w-lg text-base leading-7 text-white/80">
                Sign in to manage tasks, events, reminders, and tags from one
                focused workspace.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {["Fast task edits", "Clear scheduling", "Simple reminders"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white/90 backdrop-blur"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </Surface>

        <Surface className="flex items-center">
          <div className="w-full p-6 sm:p-8">
            <div className="max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                Sign in
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use your planner account to continue where you left off.
              </p>

              <form className="mt-8 space-y-4" onSubmit={onSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </div>

                {error && <StatusMessage kind="error" message={error} />}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-200 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <p className="mt-6 text-sm text-slate-600">
                No account yet?{" "}
                <Link
                  to="/register"
                  className="font-medium text-brand-700 hover:underline"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </Surface>
      </div>
    </div>
  );
};

export default LoginPage;
