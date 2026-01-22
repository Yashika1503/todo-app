import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App */}
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/profile" element={<Profile />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;