const LogoutButton = ({ handleLogout }) => {
  return (
    <a href="/" onClick={handleLogout}>
      Log out
    </a>
  );
};

export default LogoutButton;
