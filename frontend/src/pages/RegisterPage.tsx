import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatusMessage from "../components/common/StatusMessage";
import Surface from "../components/common/Surface";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/error";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({ name, email, password });
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-stretch gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <Surface className="flex items-center">
          <div className="w-full p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
              Create account
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Start a cleaner planning flow
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Build your planner workspace and keep tasks, events, and reminders
              in one place.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              {[
                "Structured task editing",
                "Clear scheduling views",
                "Simple tag management",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Surface>

        <Surface className="flex items-center">
          <div className="w-full p-6 sm:p-8">
            <div className="max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                Register
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use your email and password to start using the planner.
              </p>

              <form className="mt-8 space-y-4" onSubmit={onSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </div>

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
                    minLength={6}
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
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>

              <p className="mt-6 text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-brand-700 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </Surface>
      </div>
    </div>
  );
};

export default RegisterPage;
