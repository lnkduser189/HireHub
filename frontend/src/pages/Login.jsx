import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);

const handleLogin = async (event) => {
event.preventDefault();


setMessage("");
setLoading(true);

try {
  const response = await fetch(
    "http://localhost:5000/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    setMessage(data.message || "Login failed");
    return;
  }

  // Save JWT token
  localStorage.setItem("token", data.token);

  // Save logged-in user
  localStorage.setItem("user", JSON.stringify(data.user));

  // Update Navbar immediately
  window.dispatchEvent(new Event("authChange"));

  setMessage("Login successful!");

  // Redirect after successful login
  setTimeout(() => {
    navigate("/jobs");
  }, 500);

} catch (error) {
  console.error("Login error:", error);
  setMessage("Unable to connect to server.");
} finally {
  setLoading(false);
}

};

return ( <div className="login-page">


  <div className="login-card">

    <div className="login-header">
      <h1>
        Welcome to <span>HireHub</span>
      </h1>

      <p>
        Login to continue your job search
      </p>
    </div>

    <form
      className="login-form"
      onSubmit={handleLogin}
    >

      <div className="form-group">
        <label htmlFor="email">
          Email Address
        </label>

        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">
          Password
        </label>

        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="login-submit-btn"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {message && (
        <p
          className={`login-message ${
            message.includes("successful")
              ? "success"
              : "error"
          }`}
        >
          {message}
        </p>
      )}

    </form>

    <div className="login-footer">
      <p>
        Don't have an account?
      </p>

      <button
        type="button"
        onClick={() => navigate("/register")}
      >
        Create an account
      </button>
    </div>

  </div>

</div>


);
}

export default Login;
