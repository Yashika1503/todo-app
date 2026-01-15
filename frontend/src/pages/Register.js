import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await API.post("/auth/register", { email, password });
            navigate("/");
        } catch {
            alert("Register failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <h2>Register</h2>

        <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <button>Register</button>
        </form>
    );
}

export default Register;
