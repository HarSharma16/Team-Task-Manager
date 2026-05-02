import { Loader2 } from "lucide-react";

const LoadingScreen = ({ label = "Loading workspace" }) => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
      <Loader2 className="h-5 w-5 animate-spin text-sky-600" aria-hidden="true" />
      <span>{label}</span>
    </div>
  </div>
);

export default LoadingScreen;
