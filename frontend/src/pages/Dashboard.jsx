import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AlertTriangle, CheckCircle2, ClipboardList, Loader2, Plus, TimerReset } from "lucide-react";
import api from "../api/client";
import EmptyState from "../components/EmptyState";
import ProjectCard from "../components/ProjectCard";
import StatCard from "../components/StatCard";
import TaskCard from "../components/TaskCard";
import { getId, isOverdue } from "../utils/formatters";
import { useAuth } from "../context/AuthContext";

const initialProjectForm = {
  name: "",
  description: "",
  members: []
};

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [submitting, setSubmitting] = useState(false);

  const loadWorkspace = useCallback(async () => {
    setLoading(true);

    try {
      const requests = [api.get("/projects"), api.get("/tasks")];

      if (isAdmin) {
        requests.push(api.get("/auth/users"));
      }

      const [projectResponse, taskResponse, userResponse] = await Promise.all(requests);
      setProjects(projectResponse.data);
      setTasks(taskResponse.data);
      setUsers(userResponse?.data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "done").length;
    const pending = tasks.filter((task) => task.status !== "done").length;
    const overdue = tasks.filter(isOverdue).length;

    return {
      total: tasks.length,
      completed,
      pending,
      overdue
    };
  }, [tasks]);

  const assignedTasks = useMemo(() => tasks.filter((task) => getId(task.assignedTo) === getId(user)), [tasks, user]);

  const handleProjectField = (event) => {
    const { name, value } = event.target;
    setProjectForm((current) => ({ ...current, [name]: value }));
  };

  const handleMemberToggle = (memberId) => {
    setProjectForm((current) => {
      const exists = current.members.includes(memberId);
      return {
        ...current,
        members: exists ? current.members.filter((id) => id !== memberId) : [...current.members, memberId]
      };
    });
  };

  const createProject = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const { data } = await api.post("/projects", projectForm);
      setProjects((current) => [data, ...current]);
      setProjectForm(initialProjectForm);
      setShowProjectForm(false);
      toast.success("Project created");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`Delete "${project.name}" and all related tasks?`)) {
      return;
    }

    try {
      await api.delete(`/projects/${getId(project)}`);
      setProjects((current) => current.filter((item) => getId(item) !== getId(project)));
      setTasks((current) => current.filter((task) => getId(task.project) !== getId(project)));
      toast.success("Project deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateTaskStatus = async (task, status) => {
    try {
      const { data } = await api.put(`/tasks/${getId(task)}`, { status });
      setTasks((current) => current.map((item) => (getId(item) === getId(data) ? data : item)));
      toast.success("Task updated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTask = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) {
      return;
    }

    try {
      await api.delete(`/tasks/${getId(task)}`);
      setTasks((current) => current.filter((item) => getId(item) !== getId(task)));
      toast.success("Task deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ClipboardList} label="Total Tasks" value={stats.total} tone="sky" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} tone="emerald" />
        <StatCard icon={TimerReset} label="Pending" value={stats.pending} tone="amber" />
        <StatCard icon={AlertTriangle} label="Overdue" value={stats.overdue} tone="rose" />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">Projects</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{projects.length} active workspace{projects.length === 1 ? "" : "s"}</p>
          </div>
          {isAdmin ? (
            <button className="btn-primary" type="button" onClick={() => setShowProjectForm((current) => !current)}>
              <Plus className="h-5 w-5" aria-hidden="true" />
              New Project
            </button>
          ) : null}
        </div>

        {showProjectForm ? (
          <form className="surface grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto]" onSubmit={createProject}>
            <div className="space-y-2">
              <label className="label" htmlFor="project-name">
                Project Name
              </label>
              <input className="field" id="project-name" name="name" value={projectForm.name} onChange={handleProjectField} required />
            </div>
            <div className="space-y-2">
              <label className="label" htmlFor="project-description">
                Description
              </label>
              <input className="field" id="project-description" name="description" value={projectForm.description} onChange={handleProjectField} />
            </div>
            <div className="flex items-end">
              <button className="btn-primary w-full md:w-auto" type="submit" disabled={submitting}>
                {submitting ? "Creating" : "Create"}
              </button>
            </div>
            {users.length ? (
              <div className="md:col-span-3">
                <p className="label mb-3">Members</p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {users.map((member) => (
                    <label key={getId(member)} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
                      <input
                        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        type="checkbox"
                        checked={projectForm.members.includes(getId(member))}
                        onChange={() => handleMemberToggle(getId(member))}
                      />
                      <span className="min-w-0 truncate text-slate-700 dark:text-slate-200">{member.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}
          </form>
        ) : null}

        {projects.length ? (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={getId(project)} project={project} tasks={tasks} isAdmin={isAdmin} onDelete={deleteProject} />
            ))}
          </div>
        ) : (
          <EmptyState title="No projects yet" message={isAdmin ? "Create the first project to start assigning work." : "Assigned projects will appear here."} />
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">My Tasks</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{assignedTasks.length} assigned item{assignedTasks.length === 1 ? "" : "s"}</p>
        </div>

        {assignedTasks.length ? (
          <div className="grid gap-4">
            {assignedTasks.map((task) => (
              <TaskCard key={getId(task)} task={task} currentUser={user} isAdmin={isAdmin} onStatusChange={updateTaskStatus} onDelete={deleteTask} />
            ))}
          </div>
        ) : (
          <EmptyState title="No assigned tasks" message="Your assigned work queue is clear." />
        )}
      </section>
    </div>
  );
};

export default Dashboard;
