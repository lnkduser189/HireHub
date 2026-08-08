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
localStorage.setItem("user", JSON.stringify(data.user));

window.dispatchEvent(new Event("authChange"));

setMessage("Login successful!");

navigate("/jobs");

} catch (error) {
  console.error("Login error:", error);
  setMessage("Unable to connect to server.");
} finally {
  setLoading(false);
}


};

return ( <div className="login-page">


  <h1>Login</h1>

  <form onSubmit={handleLogin}>

    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(event) => setEmail(event.target.value)}
      required
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(event) => setPassword(event.target.value)}
      required
    />

    <button
      type="submit"
      disabled={loading}
    >
      {loading ? "Logging in..." : "Login"}
    </button>

  </form>

  {message && (
    <p>{message}</p>
  )}

</div>


);
}

export default Login;
