const express = require("express");
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router
  .route("/")
  .post(protect, authorizeRoles("admin"), createProject)
  .get(protect, getProjects);

router
  .route("/:id")
  .put(protect, authorizeRoles("admin"), updateProject)
  .delete(protect, authorizeRoles("admin"), deleteProject);

module.exports = router;
