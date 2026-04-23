type StatusMessageProps = {
  kind: "error" | "empty" | "success";
  message: string;
};

const styles: Record<StatusMessageProps["kind"], string> = {
  error: "border-red-200 bg-red-50 text-red-700",
  empty: "border-slate-200 bg-slate-50 text-slate-600",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const StatusMessage = ({ kind, message }: StatusMessageProps) => {
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles[kind]}`}>
      {message}
    </div>
  );
};

export default StatusMessage;
