import { Menu } from "antd";

const NavSwapper = ({ loggedIn, inLinks, outLinks }) => {
  const selectedLinks = loggedIn.length > 0 ? inLinks : outLinks;
  return (
    <Menu theme="dark" mode="inline">
      {selectedLinks.map((link, index) => (
        <Menu.Item key={index}>{link}</Menu.Item>
      ))}
    </Menu>
  );
};

export default NavSwapper;
