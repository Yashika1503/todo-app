import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Profile() {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        API.get("/auth/me")
        .then(res => setUser(res.data))
        .catch(() => navigate("/login"));
    }, [navigate]);

    const handleUpdate = async () => {
        try {
            const res = await API.put("/auth/me", user);
            setUser(res.data);
            setEditing(false);
        } catch {
            alert("Update failed");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", {replace: true});
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete account permanently?")) return;
        await API.delete("/auth/me");
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div>
        <h2>Profile</h2>

        <input
            disabled={!editing}
            value={user.username}
            onChange={e => setUser({ ...user, username: e.target.value })}
        />

        <input
            disabled={!editing}
            value={user.email}
            onChange={e => setUser({ ...user, email: e.target.value })}
        />

        <input
            type="date"
            disabled={!editing}
            value={user.dob?.slice(0, 10)}
            onChange={e => setUser({ ...user, dob: e.target.value })}
        />

        {!editing ? (
            <button onClick={() => setEditing(true)}>Edit</button>
        ) : (
            <button onClick={handleUpdate}>Save</button>
        )}

        <button onClick={handleLogout}>Logout</button>
        <button onClick={handleDelete} style={{ color: "red" }}>
            Delete Account
        </button>
        </div>
    );
}

export default Profile;
