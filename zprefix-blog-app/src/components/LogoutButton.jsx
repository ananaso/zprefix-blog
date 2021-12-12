const LogoutButton = (loggedIn, handleLogout) => {
  return loggedIn !== "" ? (
    <li>
      <a href="/" onClick={() => handleLogout()}>
        Log out
      </a>
    </li>
  ) : (
    <></>
  );
};

export default LogoutButton;
