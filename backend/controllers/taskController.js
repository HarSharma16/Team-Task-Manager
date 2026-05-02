const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

const taskPopulate = [
  { path: "assignedTo", select: "name email role" },
  { path: "project", select: "name description members" }
];

const canAccessProject = (project, user) =>
  user.role === "admin" || project.members.some((memberId) => memberId.toString() === user._id.toString());

const createTask = asyncHandler(async (req, res) => {
  const { title, description = "", project, assignedTo, status = "todo", dueDate } = req.body;

  if (!title || !project || !assignedTo || !dueDate) {
    res.status(400);
    throw new Error("Title, project, assignedTo, and dueDate are required");
  }

  const [existingProject, assignee] = await Promise.all([
    Project.findById(project),
    User.findById(assignedTo)
  ]);

  if (!existingProject) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (!assignee) {
    res.status(404);
    throw new Error("Assigned user not found");
  }

  const isProjectMember = existingProject.members.some((memberId) => memberId.toString() === assignee._id.toString());
  if (!isProjectMember) {
    existingProject.members.push(assignee._id);
    await existingProject.save();
  }

  const task = await Task.create({
    title,
    description,
    project,
    assignedTo,
    status,
    dueDate
  });

  const populatedTask = await task.populate(taskPopulate);
  res.status(201).json(populatedTask);
});

const getTasks = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? {} : { assignedTo: req.user._id };
  const tasks = await Task.find(query).populate(taskPopulate).sort({ dueDate: 1 });
  res.json(tasks);
});

const getTasksByProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (!canAccessProject(project, req.user)) {
    res.status(403);
    throw new Error("Forbidden: you are not a member of this project");
  }

  const query =
    req.user.role === "admin"
      ? { project: project._id }
      : {
          project: project._id,
          assignedTo: req.user._id
        };

  const tasks = await Task.find(query).populate(taskPopulate).sort({ dueDate: 1 });
  res.json(tasks);
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (req.user.role === "member") {
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Forbidden: you can update only tasks assigned to you");
    }

    const allowedKeys = ["status"];
    const requestedKeys = Object.keys(req.body);
    const hasDisallowedUpdate = requestedKeys.some((key) => !allowedKeys.includes(key));

    if (hasDisallowedUpdate) {
      res.status(403);
      throw new Error("Members can update task status only");
    }
  }

  const allowedAdminFields = ["title", "description", "assignedTo", "status", "dueDate"];
  const fields = req.user.role === "admin" ? allowedAdminFields : ["status"];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  });

  if (req.body.assignedTo) {
    const assignee = await User.findById(req.body.assignedTo);
    if (!assignee) {
      res.status(404);
      throw new Error("Assigned user not found");
    }

    const project = await Project.findById(task.project);
    const isProjectMember = project.members.some((memberId) => memberId.toString() === assignee._id.toString());
    if (!isProjectMember) {
      project.members.push(assignee._id);
      await project.save();
    }
  }

  await task.save();
  const populatedTask = await task.populate(taskPopulate);
  res.json(populatedTask);
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  await task.deleteOne();
  res.json({ message: "Task deleted" });
});

module.exports = { createTask, getTasks, getTasksByProject, updateTask, deleteTask };
