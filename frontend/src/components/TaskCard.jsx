import { AlertTriangle, CalendarDays, Trash2, UserRound } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate, getId, isOverdue, statusLabels } from "../utils/formatters";

const TaskCard = ({ task, currentUser, isAdmin, onStatusChange, onDelete }) => {
  const overdue = isOverdue(task);
  const canEditStatus = isAdmin || getId(task.assignedTo) === getId(currentUser);

  return (
    <article className="surface p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={task.status} />
            {overdue ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:ring-rose-800">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                Overdue
              </span>
            ) : null}
          </div>
          <h3 className="mt-3 text-base font-bold text-slate-950 dark:text-white">{task.title}</h3>
          {task.description ? <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{task.description}</p> : null}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="h-4 w-4" aria-hidden="true" />
              {task.assignedTo?.name || "Unassigned"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {formatDate(task.dueDate)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <select
            className="field min-w-36"
            value={task.status}
            onChange={(event) => onStatusChange(task, event.target.value)}
            disabled={!canEditStatus}
            title="Update status"
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {isAdmin ? (
            <button className="icon-btn text-rose-600 dark:text-rose-300" type="button" onClick={() => onDelete(task)} title="Delete task">
              <Trash2 className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
