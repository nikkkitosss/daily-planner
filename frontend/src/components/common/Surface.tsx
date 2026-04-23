import { PropsWithChildren } from "react";

type SurfaceProps = PropsWithChildren<{
  className?: string;
}>;

const Surface = ({ className = "", children }: SurfaceProps) => {
  return (
    <div
      className={`rounded-3xl border border-slate-200/80 bg-white/95 shadow-sm shadow-slate-200/40 ${className}`}
    >
      {children}
    </div>
  );
};

export default Surface;
