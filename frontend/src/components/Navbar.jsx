function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        Hire<span>Hub</span>
      </div>

      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/jobs">Jobs</a>
        <a href="/companies">Companies</a>
        <a href="/about">About</a>
      </div>

      <div className="nav-buttons">
        <button className="login-btn">Login</button>
        <button className="register-btn">Register</button>
      </div>
    </nav>
  );
}

export default Navbar;