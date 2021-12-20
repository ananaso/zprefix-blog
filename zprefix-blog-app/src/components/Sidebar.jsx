import { Link } from "react-router-dom";

import { Layout, Typography, Menu } from "antd";
const { Sider } = Layout;
const { Title } = Typography;

const Sidebar = ({ loggedIn, location, handleLogout }) => {
  // links to show when logged in
  const inLinks = [
    <Link to="/">Home</Link>,
    <Link to="/posts">My Posts</Link>,
    <Link to="/publish">Publish New Post</Link>,
    <a href="/" onClick={handleLogout}>
      Log out
    </a>,
    <Link to="/about">About</Link>,
  ];
  // links to show when logged out
  const outLinks = [
    <Link to="/">Home</Link>,
    <Link to="/login">Create Account / Login</Link>,
    <Link to="/about">About</Link>,
  ];
  const selectedLinks = loggedIn.length > 0 ? inLinks : outLinks;

  // Allows us to highlight currently selected sidebar link.
  // Doesn't currently work if we navigate to an individual post
  const highlight = () => {
    const path = location.pathname;
    const foundIndex = selectedLinks.findIndex(
      (link) => link.props.to === path
    );
    return foundIndex;
  };

  return (
    <Sider
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
      }}
    >
      <Title className="logo" level={4}>
        Bloggy
      </Title>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[`${highlight()}`]}>
        {selectedLinks.map((link, index) => (
          <Menu.Item key={index}>{link}</Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
