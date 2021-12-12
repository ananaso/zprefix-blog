const LoginRegister = ({ submitLogin, submitRegistration }) => {
  return (
    <div className="LoginRegister">
      <label htmlFor="loginForm">Login</label>
      <form
        id="loginForm"
        className="loginForm"
        onSubmit={(e) => submitLogin(e)}
      >
        <div className="loginForm">
          <label htmlFor="usernameInput">Username:</label>
          <input type="text" id="usernameInput" name="usernameInput" />
        </div>
        <div className="loginForm">
          <label htmlFor="passwordInput">Password:</label>
          <input type="password" id="passwordInput" name="passwordInput" />
        </div>
        <div className="loginForm">
          <button type="submit">Login</button>
        </div>
      </form>
      <label htmlFor="registrationForm">Create Account</label>
      <form
        id="registrationForm"
        className="registrationForm"
        onSubmit={(e) => submitRegistration(e)}
      >
        <div className="registrationForm">
          <label htmlFor="usernameInput">Username:</label>
          <input type="text" id="usernameInput" name="usernameInput" />
        </div>
        <div className="registrationForm">
          <label htmlFor="passwordInput">Password:</label>
          <input type="password" id="passwordInput" name="passwordInput" />
        </div>
        <div className="registrationForm">
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default LoginRegister;
