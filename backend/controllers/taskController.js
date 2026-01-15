const Task = require("../models/Task");

// CREATE TASK
exports.createTask = async (req, res) => {
    try {
        const task = await Task.create({
        user: req.user._id,
        title: req.body.title,
        reminderTime: req.body.reminderTime,
        repeat: req.body.repeat
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Failed to create task" });
    }
    };

    // GET ALL TASKS (for logged-in user)
    exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
    };

    // UPDATE TASK
    exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        req.body,
        { new: true }
        );

        if (!task) {
        return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Failed to update task" });
    }
    };

    // DELETE TASK
    exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
        });

        if (!task) {
        return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task" });
    }
};
