const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

const projectPopulate = [
  { path: "createdBy", select: "name email role" },
  { path: "members", select: "name email role" }
];

const uniqueIds = (ids = []) => [...new Set(ids.filter(Boolean).map(String))];

const ensureUsersExist = async (memberIds) => {
  if (!memberIds.length) {
    return;
  }

  const users = await User.find({ _id: { $in: memberIds } }).select("_id");
  if (users.length !== memberIds.length) {
    throw new Error("One or more selected members do not exist");
  }
};

const createProject = asyncHandler(async (req, res) => {
  const { name, description = "", members = [] } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Project name is required");
  }

  const memberIds = uniqueIds([...members, req.user._id]);
  await ensureUsersExist(memberIds);

  const project = await Project.create({
    name,
    description,
    createdBy: req.user._id,
    members: memberIds
  });

  const populatedProject = await project.populate(projectPopulate);
  res.status(201).json(populatedProject);
});

const getProjects = asyncHandler(async (req, res) => {
  const query =
    req.user.role === "admin"
      ? {}
      : {
          members: req.user._id
        };

  const projects = await Project.find(query)
    .populate(projectPopulate)
    .sort({ updatedAt: -1 });

  res.json(projects);
});

const updateProject = asyncHandler(async (req, res) => {
  const { name, description, members } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (typeof name === "string") {
    project.name = name;
  }

  if (typeof description === "string") {
    project.description = description;
  }

  if (Array.isArray(members)) {
    const memberIds = uniqueIds([...members, project.createdBy]);
    await ensureUsersExist(memberIds);
    project.members = memberIds;
  }

  await project.save();
  const populatedProject = await project.populate(projectPopulate);
  res.json(populatedProject);
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();

  res.json({ message: "Project and related tasks deleted" });
});

module.exports = { createProject, getProjects, updateProject, deleteProject };
