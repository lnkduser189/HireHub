function Register() {
  return (
    <div className="page">
      <h1>Create an Account</h1>

      <form>
        <input
          type="text"
          placeholder="Full Name"
        />

        <input
          type="email"
          placeholder="Email"
        />

        <input
          type="password"
          placeholder="Password"
        />

        <button type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;