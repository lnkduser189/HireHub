import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const getUser = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(getUser);

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getUser());
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    window.dispatchEvent(new Event("authChange"));

    navigate("/login");
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        Hire<span>Hub</span>
      </Link>

      <div className="nav-links">

        <Link to="/">Home</Link>

        <Link to="/jobs">Jobs</Link>

        <Link to="/companies">Companies</Link>

        <Link to="/about">About</Link>

        {user?.role === "candidate" && (
          <Link to="/my-applications">
            My Applications
          </Link>
        )}

        {user?.role === "recruiter" && (
          <>
            <Link to="/recruiter/dashboard">
              Dashboard
            </Link>

            <Link to="/recruiter/applications">
              Applications
            </Link>
          </>
        )}

      </div>

      <div className="nav-buttons">

        {user ? (
          <>
            <span className="welcome-user">
              Hi, {user.name}
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="login-btn">
                Login
              </button>
            </Link>

            <Link to="/register">
              <button className="register-btn">
                Register
              </button>
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;