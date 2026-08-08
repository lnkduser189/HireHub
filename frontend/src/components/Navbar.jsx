import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        Hire<span>Hub</span>
      </div>

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/jobs">
          Jobs
        </Link>

        <Link to="/companies">
          Companies
        </Link>

        <Link to="/about">
          About
        </Link>

      </div>

      <div className="nav-buttons">

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

      </div>

    </nav>
  );
}

export default Navbar;