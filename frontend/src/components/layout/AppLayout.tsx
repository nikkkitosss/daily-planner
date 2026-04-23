import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/tasks", label: "Tasks" },
  { to: "/events", label: "Events" },
  { to: "/reminders", label: "Reminders" },
  { to: "/tags", label: "Tags" },
  { to: "/profile", label: "Profile" },
];

const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">
              Daily Planner
            </p>
            <div className="mt-1 flex items-center gap-3">
              <h1 className="truncate text-lg font-semibold text-slate-900">
                Workspace
              </h1>
              <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-500 sm:inline-flex">
                {user?.email}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:px-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
        <aside className="lg:sticky lg:top-24">
          <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-sm shadow-slate-200/50">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Navigation
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Switch between your planner areas.
              </p>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200"
                        : "text-slate-700 hover:bg-slate-50"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
