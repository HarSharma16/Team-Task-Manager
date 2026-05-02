import { Link } from "react-router-dom";
import { ArrowRight, Trash2, UsersRound } from "lucide-react";
import { getId, initials } from "../utils/formatters";

const ProjectCard = ({ project, tasks = [], isAdmin, onDelete }) => {
  const projectTasks = tasks.filter((task) => getId(task.project) === getId(project));
  const completeCount = projectTasks.filter((task) => task.status === "done").length;
  const progress = projectTasks.length ? Math.round((completeCount / projectTasks.length) * 100) : 0;
  const visibleMembers = project.members?.slice(0, 4) || [];
  const extraMemberCount = Math.max((project.members?.length || 0) - visibleMembers.length, 0);

  return (
    <article className="surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to={`/projects/${getId(project)}`} className="text-lg font-bold text-slate-950 hover:text-sky-700 dark:text-white dark:hover:text-sky-300">
            {project.name}
          </Link>
          {project.description ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{project.description}</p> : null}
        </div>
        {isAdmin ? (
          <button className="icon-btn shrink-0 text-rose-600 dark:text-rose-300" type="button" onClick={() => onDelete(project)} title="Delete project">
            <Trash2 className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-600 dark:text-slate-300">Progress</span>
          <span className="font-bold text-slate-950 dark:text-white">{progress}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <UsersRound className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <div className="flex -space-x-2">
            {visibleMembers.map((member) => (
              <div
                key={getId(member)}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-700 text-xs font-bold text-white dark:border-slate-900"
                title={member.name}
              >
                {initials(member.name)}
              </div>
            ))}
            {extraMemberCount ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-xs font-bold text-slate-700 dark:border-slate-900 dark:bg-slate-800 dark:text-slate-200">
                +{extraMemberCount}
              </div>
            ) : null}
          </div>
        </div>
        <Link to={`/projects/${getId(project)}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-700 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200">
          Open
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};

export default ProjectCard;
