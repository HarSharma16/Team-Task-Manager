const express = require("express");
const {
  createTask,
  getTasks,
  getTasksByProject,
  updateTask,
  deleteTask
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router
  .route("/")
  .post(protect, authorizeRoles("admin"), createTask)
  .get(protect, getTasks);

router.get("/project/:projectId", protect, getTasksByProject);

router
  .route("/:id")
  .put(protect, updateTask)
  .delete(protect, authorizeRoles("admin"), deleteTask);

module.exports = router;
