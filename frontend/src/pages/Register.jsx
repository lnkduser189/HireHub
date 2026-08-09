import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
const navigate = useNavigate();

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [role, setRole] = useState("candidate");

const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);

const handleRegister = async (event) => {
event.preventDefault();


setMessage("");
setLoading(true);

try {
  const response = await fetch(
    "http://localhost:5000/api/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    setMessage(data.message || "Registration failed");
    return;
  }

  setMessage("Registration successful! Redirecting to login...");

  setTimeout(() => {
    navigate("/login");
  }, 1000);

} catch (error) {
  console.error("Registration error:", error);
  setMessage("Unable to connect to server.");
} finally {
  setLoading(false);
}


};

return ( <div className="login-page">

```
  <div className="login-card register-card">

    <div className="login-header">
      <h1>
        Join <span>HireHub</span>
      </h1>

      <p>
        Create your account and start your journey
      </p>
    </div>

    <form
      className="login-form"
      onSubmit={handleRegister}
    >

      <div className="form-group">
        <label htmlFor="name">
          Full Name
        </label>

        <input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-email">
          Email Address
        </label>

        <input
          id="register-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-password">
          Password
        </label>

        <input
          id="register-password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />
      </div>

      <div className="form-group">
        <label htmlFor="role">
          Register As
        </label>

        <select
          id="role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
        >
          <option value="candidate">
            Candidate
          </option>

          <option value="recruiter">
            Recruiter
          </option>
        </select>
      </div>

      <button
        type="submit"
        className="login-submit-btn"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
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
        Already have an account?
      </p>

      <button
        type="button"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </div>

  </div>

</div>


);
}

export default Register;
