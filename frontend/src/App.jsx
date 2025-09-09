import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
  );
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setCurrentUser(null);
  };

  if (token && currentUser) {
    return <Dashboard token={token} logout={handleLogout} currentUser={currentUser} />;
  }

  return showRegister ? (
    <Register
      onRegister={() => setShowRegister(false)}
      switchToLogin={() => setShowRegister(false)}
    />
  ) : (
    <Login
      onLogin={handleLogin}
      switchToRegister={() => setShowRegister(true)}
    />
  );
}