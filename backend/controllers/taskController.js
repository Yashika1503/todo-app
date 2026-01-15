const Task = require("../models/Task");

// HANDLE REPEATING TASKS
const handleRepeatingTasks = async (userId) => {
    const now = new Date();

    const repeatingTasks = await Task.find({
        user: userId,
        repeat: { $ne: "none" },
        dueDate: { $lt: now }
    });

    for (let task of repeatingTasks) {
        let nextDueDate = new Date(task.dueDate);

        while (nextDueDate < now) {
            if (task.repeat === "daily") {
                nextDueDate.setDate(nextDueDate.getDate() + 1);
            }

            if (task.repeat === "weekly") {
                nextDueDate.setDate(nextDueDate.getDate() + 7);
            }
        }


        task.dueDate = nextDueDate;
        task.completed = false;
        task.reminderSent = false;

        await task.save();
    }
};

// GET DUE REMINDERS
const getDueReminders = async (userId) => {
    const now = new Date();

    const tasks = await Task.find({
        user: userId,
        reminderTime: { $lte: now },
        reminderSent: { $ne: true }
    });

    return tasks;
};


// CREATE TASK
exports.createTask = async (req, res) => {
    try {
        const { title, dueDate, repeat, reminderTime } = req.body;

        if (!title || title.trim() === "") {
            return res.status(400).json({ message: "Title is required" });
        }

        if (!dueDate) {
            return res.status(400).json({ message: "Due date is required" });
        }

        const parsedDueDate = new Date(dueDate);
        if (isNaN(parsedDueDate.getTime())) {
            return res.status(400).json({ message: "Invalid due date" });
        }

        if (reminderTime) {
            const parsedReminder = new Date(reminderTime);
            if (isNaN(parsedReminder.getTime())) {
                return res.status(400).json({ message: "Invalid reminder time" });
            }

            if (parsedReminder > parsedDueDate) {
                return res
                    .status(400)
                    .json({ message: "Reminder cannot be after due date" });
            }
        }

    if (repeat && !["none", "daily", "weekly"].includes(repeat)) {
        return res.status(400).json({ message: "Invalid repeat option" });
    }

    const task = await Task.create({
        user: req.user._id,
        title: title.trim(),
        dueDate: parsedDueDate,
        reminderTime,
        repeat: repeat || "none"
        });

    res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Failed to create task" });
    }
};


// GET ALL TASKS
exports.getTasks = async (req, res) => {
    try {
        await handleRepeatingTasks(req.user._id);

        const tasks = await Task.find({ user: req.user._id }).sort({
        createdAt: -1
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
};

// GET TODAY'S TASKS
exports.getTodayTasks = async (req, res) => {
    try {
        await handleRepeatingTasks(req.user._id);

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const tasks = await Task.find({
        user: req.user._id,
        dueDate: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ dueDate: 1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch today's tasks" });
    }
};

// GET PAST TASKS
exports.getPastTasks = async (req, res) => {
    try {
        await handleRepeatingTasks(req.user._id);

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const tasks = await Task.find({
        user: req.user._id,
        dueDate: { $lt: startOfDay }
        }).sort({ dueDate: -1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch past tasks" });
    }
};

// GET FUTURE TASKS
exports.getFutureTasks = async (req, res) => {
    try {
        await handleRepeatingTasks(req.user._id);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const tasks = await Task.find({
        user: req.user._id,
        dueDate: { $gt: endOfDay }
        }).sort({ dueDate: 1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch future tasks" });
    }
};

// GET REMINDERS
exports.getReminders = async (req, res) => {
    try {
        const reminders = await getDueReminders(req.user._id);

        for (let task of reminders) {
        task.reminderSent = true;
        await task.save();
        }

        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reminders" });
    }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
    try {
        const allowedFields = [
        "title",
        "dueDate",
        "completed",
        "repeat",
        "reminderTime"
        ];

        const updates = {};

        for (let key of allowedFields) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        if (updates.dueDate) {
            const parsedDate = new Date(updates.dueDate);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ message: "Invalid due date" });
            }
            updates.dueDate = parsedDate;
        }

        if (updates.repeat && !["none", "daily", "weekly"].includes(updates.repeat)) {
            return res.status(400).json({ message: "Invalid repeat option" });
        }

        if (updates.reminderTime) {
            updates.reminderSent = false;
        }

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            updates,
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
