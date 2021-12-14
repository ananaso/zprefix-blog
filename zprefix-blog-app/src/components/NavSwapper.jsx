const NavSwapper = ({ loggedIn, inLinks, outLinks }) => {
  const selectedLinks = loggedIn.length > 0 ? inLinks : outLinks;
  return (
    <ul>
      {selectedLinks.map((link, index) => (
        <li key={index}>{link}</li>
      ))}
    </ul>
  );
};

export default NavSwapper;
