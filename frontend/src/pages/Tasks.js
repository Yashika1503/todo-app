import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import API from "../api/axios";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [filter, setFilter] = useState("today");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
        navigate("/", { replace: true });
        }
    }, [navigate]);

    // Fetch all tasks and filter in frontend
    const fetchTasks = useCallback(async () => {
        try {
            const res = await API.get("/tasks");
            let filtered = res.data;

            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            if (filter === "today") {
                filtered = filtered.filter(
                (t) => new Date(t.dueDate) >= startOfDay && new Date(t.dueDate) <= endOfDay
                );
            } else if (filter === "past") {
                filtered = filtered.filter((t) => new Date(t.dueDate) < startOfDay);
            } else if (filter === "future") {
                filtered = filtered.filter((t) => new Date(t.dueDate) > endOfDay);
            }

            // Sort tasks by dueDate ascending
            filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

            setTasks(filtered);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch tasks");
        }
    }, [filter]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Add new task
    const addTask = async (e) => {
        e.preventDefault();
        if (!title || !dueDate) return alert("Title and due date required");

        try {
            await API.post("/tasks", { title, dueDate });
            setTitle("");
            setDueDate("");
            fetchTasks();
        } catch {
            alert("Failed to add task");
        }
    };

    // Toggle complete
    const toggleComplete = async (task) => {
        try {
            await API.put(`/tasks/${task._id}`, { completed: !task.completed });
            fetchTasks();
        } catch {
            alert("Failed to update task");
        }
    };

    // Delete task
    const deleteTask = async (id) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await API.delete(`/tasks/${id}`);
            fetchTasks();
        } catch {
            alert("Failed to delete task");
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "20px auto", fontFamily: "Arial" }}>
        <h2>To-Do List</h2>

        {/* Filter buttons */}
        <div style={{ marginBottom: "15px" }}>
            <button onClick={() => setFilter("today")} disabled={filter === "today"}>Today</button>
            <button onClick={() => setFilter("past")} disabled={filter === "past"}>Past</button>
            <button onClick={() => setFilter("future")} disabled={filter === "future"}>Future</button>
        </div>

        {/* Add task form */}
        <form onSubmit={addTask} style={{ marginBottom: "20px" }}>
            <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginRight: "10px" }}
            />
            <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ marginRight: "10px" }}
            />
            <button>Add</button>
        </form>

        {/* Task list */}
        <div>
            {tasks.length === 0 && <p>No tasks!</p>}
            {tasks.map((task) => (
            <div
                key={task._id}
                style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "5px 0",
                borderBottom: "1px solid #ccc"
                }}
            >
                <span
                style={{
                    textDecoration: task.completed ? "line-through" : "none",
                    cursor: "pointer"
                }}
                onClick={() => toggleComplete(task)}
                >
                {task.title} ({new Date(task.dueDate).toLocaleDateString()})
                </span>

                <button onClick={() => deleteTask(task._id)} style={{ color: "red" }}>
                Delete
                </button>
            </div>
            ))}
        </div>
        </div>
    );
}

export default Tasks;