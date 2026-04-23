import { Link } from "react-router-dom";
import Surface from "../components/common/Surface";

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center px-4 py-8">
    <Surface>
      <div className="max-w-md p-8 text-center sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
          Error
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">404</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Page not found.</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-200 transition hover:bg-brand-700"
        >
          Go to dashboard
        </Link>
      </div>
    </Surface>
  </div>
);

export default NotFoundPage;
