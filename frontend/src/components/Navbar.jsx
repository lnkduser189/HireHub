function Navbar() {
  return (
    <nav>
      <div>
        <h2>HireHub</h2>
      </div>

      <div>
        <a href="/">Home</a>
        <a href="/jobs">Jobs</a>
        <a href="/companies">Companies</a>
        <a href="/about">About</a>
      </div>

      <div>
        <button>Login</button>
        <button>Register</button>
      </div>
    </nav>
  );
}

export default Navbar;