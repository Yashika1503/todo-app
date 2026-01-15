const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    createTask,
    getTasks,
    getTodayTasks,
    getPastTasks,
    getFutureTasks,
    getReminders,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const router = express.Router();

router.use(authMiddleware);

router.get("/past", getPastTasks);
router.get("/today", getTodayTasks);
router.get("/future", getFutureTasks);
router.get("/reminders", getReminders);
router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
