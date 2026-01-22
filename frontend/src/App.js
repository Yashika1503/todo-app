import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={isAuthenticated() ? <Navigate to="/tasks" /> : <Login />}
        />
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/tasks" /> : <Login />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={isAuthenticated() ? <Navigate to="/tasks" /> : <Register />}
        />

        {/* Tasks */}
        <Route
          path="/tasks"
          element={isAuthenticated() ? <Tasks /> : <Navigate to="/login" />}
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
