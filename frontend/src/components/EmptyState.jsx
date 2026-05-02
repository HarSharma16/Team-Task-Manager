import { Inbox } from "lucide-react";

const EmptyState = ({ title, message }) => (
  <div className="surface flex flex-col items-center justify-center px-6 py-12 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
      <Inbox className="h-6 w-6" aria-hidden="true" />
    </div>
    <h3 className="mt-4 text-base font-semibold text-slate-950 dark:text-white">{title}</h3>
    {message ? <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{message}</p> : null}
  </div>
);

export default EmptyState;
