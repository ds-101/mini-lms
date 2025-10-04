import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ background: "#333", padding: "10px" }}>
      <Link to="/" style={{ color: "white", marginRight: "15px" }}>Home</Link>
      <Link to="/courses" style={{ color: "white", marginRight: "15px" }}>Courses</Link>
      {user ? (
        <>
          <span style={{ color: "yellow", marginRight: "15px" }}>
            Welcome, {user.username}
          </span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: "white", marginRight: "15px" }}>Login</Link>
          <Link to="/register" style={{ color: "white" }}>Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
