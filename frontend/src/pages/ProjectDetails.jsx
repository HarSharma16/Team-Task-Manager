import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, Save, Trash2, UsersRound } from "lucide-react";
import api from "../api/client";
import EmptyState from "../components/EmptyState";
import TaskCard from "../components/TaskCard";
import { getId, initials } from "../utils/formatters";
import { useAuth } from "../context/AuthContext";

const todayInputValue = () => new Date().toISOString().slice(0, 10);

const initialTaskForm = {
  title: "",
  description: "",
  assignedTo: "",
  status: "todo",
  dueDate: todayInputValue()
};

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [taskForm, setTaskForm] = useState(initialTaskForm);
  const [loading, setLoading] = useState(true);
  const [savingProject, setSavingProject] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);

  const loadProject = useCallback(async () => {
    setLoading(true);

    try {
      const requests = [api.get("/projects"), api.get(`/tasks/project/${projectId}`)];

      if (isAdmin) {
        requests.push(api.get("/auth/users"));
      }

      const [projectResponse, taskResponse, userResponse] = await Promise.all(requests);
      const currentProject = projectResponse.data.find((item) => getId(item) === projectId);

      if (!currentProject) {
        throw new Error("Project not found or unavailable");
      }

      const memberIds = currentProject.members?.map(getId) || [];
      const loadedUsers = userResponse?.data || [];

      setProject(currentProject);
      setProjectForm({
        name: currentProject.name,
        description: currentProject.description || ""
      });
      setSelectedMembers(memberIds);
      setTasks(taskResponse.data);
      setUsers(loadedUsers);
      setTaskForm((current) => ({
        ...current,
        assignedTo: current.assignedTo || loadedUsers[0]?.id || loadedUsers[0]?._id || ""
      }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const progress = useMemo(() => {
    if (!tasks.length) {
      return 0;
    }

    return Math.round((tasks.filter((task) => task.status === "done").length / tasks.length) * 100);
  }, [tasks]);

  const handleProjectChange = (event) => {
    const { name, value } = event.target;
    setProjectForm((current) => ({ ...current, [name]: value }));
  };

  const handleTaskChange = (event) => {
    const { name, value } = event.target;
    setTaskForm((current) => ({ ...current, [name]: value }));
  };

  const toggleMember = (memberId) => {
    setSelectedMembers((current) => (current.includes(memberId) ? current.filter((id) => id !== memberId) : [...current, memberId]));
  };

  const saveProject = async (event) => {
    event.preventDefault();
    setSavingProject(true);

    try {
      const { data } = await api.put(`/projects/${projectId}`, {
        ...projectForm,
        members: selectedMembers
      });
      setProject(data);
      setSelectedMembers(data.members?.map(getId) || []);
      toast.success("Project updated");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSavingProject(false);
    }
  };

  const deleteProject = async () => {
    if (!window.confirm(`Delete "${project.name}" and all related tasks?`)) {
      return;
    }

    try {
      await api.delete(`/projects/${projectId}`);
      toast.success("Project deleted");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const createTask = async (event) => {
    event.preventDefault();
    setCreatingTask(true);

    try {
      const { data } = await api.post("/tasks", {
        ...taskForm,
        project: projectId
      });
      setTasks((current) => [...current, data].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
      setTaskForm((current) => ({
        ...initialTaskForm,
        assignedTo: current.assignedTo
      }));
      toast.success("Task assigned");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCreatingTask(false);
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

  if (!project) {
    return <EmptyState title="Project unavailable" message="The project may have been removed or your access changed." />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <Link to="/" className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-sky-700 hover:text-sky-800 dark:text-sky-300">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Dashboard
          </Link>
          <h2 className="text-3xl font-bold text-slate-950 dark:text-white">{project.name}</h2>
          {project.description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{project.description}</p> : null}
        </div>

        <div className="surface w-full p-4 lg:w-72">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Completion</span>
            <span className="font-bold text-slate-950 dark:text-white">{progress}%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <UsersRound className="h-4 w-4" aria-hidden="true" />
            {project.members?.length || 0} member{project.members?.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">Tasks</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tasks.length} task{tasks.length === 1 ? "" : "s"} in this project</p>
          </div>

          {tasks.length ? (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <TaskCard key={getId(task)} task={task} currentUser={user} isAdmin={isAdmin} onStatusChange={updateTaskStatus} onDelete={deleteTask} />
              ))}
            </div>
          ) : (
            <EmptyState title="No tasks yet" message={isAdmin ? "Create a task for this project from the admin panel." : "Assigned tasks for this project will appear here."} />
          )}
        </div>

        <aside className="space-y-6">
          {isAdmin ? (
            <>
              <form className="surface space-y-4 p-5" onSubmit={createTask}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-slate-950 dark:text-white">Assign Task</h3>
                  <Plus className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>

                <div className="space-y-2">
                  <label className="label" htmlFor="task-title">
                    Title
                  </label>
                  <input className="field" id="task-title" name="title" value={taskForm.title} onChange={handleTaskChange} required />
                </div>

                <div className="space-y-2">
                  <label className="label" htmlFor="task-description">
                    Description
                  </label>
                  <textarea className="field min-h-24 resize-y" id="task-description" name="description" value={taskForm.description} onChange={handleTaskChange} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="space-y-2">
                    <label className="label" htmlFor="assigned-to">
                      Assignee
                    </label>
                    <select className="field" id="assigned-to" name="assignedTo" value={taskForm.assignedTo} onChange={handleTaskChange} required>
                      <option value="" disabled>
                        Select user
                      </option>
                      {users.map((member) => (
                        <option key={getId(member)} value={getId(member)}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="label" htmlFor="due-date">
                      Due Date
                    </label>
                    <input className="field" id="due-date" name="dueDate" type="date" value={taskForm.dueDate} onChange={handleTaskChange} required />
                  </div>
                </div>

                <button className="btn-primary w-full" type="submit" disabled={creatingTask || !users.length}>
                  <Plus className="h-5 w-5" aria-hidden="true" />
                  {creatingTask ? "Assigning" : "Assign Task"}
                </button>
              </form>

              <form className="surface space-y-4 p-5" onSubmit={saveProject}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-slate-950 dark:text-white">Project Settings</h3>
                  <Save className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>

                <div className="space-y-2">
                  <label className="label" htmlFor="project-name">
                    Name
                  </label>
                  <input className="field" id="project-name" name="name" value={projectForm.name} onChange={handleProjectChange} required />
                </div>

                <div className="space-y-2">
                  <label className="label" htmlFor="project-description">
                    Description
                  </label>
                  <textarea
                    className="field min-h-24 resize-y"
                    id="project-description"
                    name="description"
                    value={projectForm.description}
                    onChange={handleProjectChange}
                  />
                </div>

                <div>
                  <p className="label mb-3">Members</p>
                  <div className="grid gap-2">
                    {users.map((member) => (
                      <label key={getId(member)} className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
                        <input
                          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                          type="checkbox"
                          checked={selectedMembers.includes(getId(member))}
                          onChange={() => toggleMember(getId(member))}
                        />
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-xs font-bold text-white">
                          {initials(member.name)}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-slate-700 dark:text-slate-200">{member.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <button className="btn-primary w-full" type="submit" disabled={savingProject}>
                    <Save className="h-5 w-5" aria-hidden="true" />
                    {savingProject ? "Saving" : "Save"}
                  </button>
                  <button className="btn-danger w-full" type="button" onClick={deleteProject}>
                    <Trash2 className="h-5 w-5" aria-hidden="true" />
                    Delete Project
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="surface p-5">
              <h3 className="text-base font-bold text-slate-950 dark:text-white">Members</h3>
              <div className="mt-4 grid gap-2">
                {project.members?.map((member) => (
                  <div key={getId(member)} className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 text-xs font-bold text-white">{initials(member.name)}</span>
                    <span className="min-w-0 truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
};

export default ProjectDetails;
