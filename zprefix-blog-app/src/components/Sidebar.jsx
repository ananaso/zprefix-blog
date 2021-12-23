import { Link } from "react-router-dom";

import { Layout, Typography, Menu } from "antd";
import {
  EditOutlined,
  FolderOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
const { Sider } = Layout;
const { Title } = Typography;

const Sidebar = ({ loggedIn, location, handleLogout, collapseState }) => {
  // links to show when logged in
  const loggedInMenuItems = [
    <Menu.Item key={0} icon={<HomeOutlined />}>
      <Link to="/">Home</Link>
    </Menu.Item>,
    <Menu.Item key={1} icon={<FolderOutlined />}>
      <Link to="/posts">My Posts</Link>
    </Menu.Item>,
    <Menu.Item key={2} icon={<EditOutlined />}>
      <Link to="/publish">Publish New Post</Link>
    </Menu.Item>,
    <Menu.Item key={3} icon={<LogoutOutlined />}>
      <a href="/" onClick={handleLogout}>
        Log out
      </a>
    </Menu.Item>,
    <Menu.Item key={4} icon={<InfoCircleOutlined />}>
      <Link to="/about">About</Link>
    </Menu.Item>,
  ];

  // links to show when logged out
  const loggedOutMenuItems = [
    <Menu.Item key={0} icon={<HomeOutlined />}>
      <Link to="/">Home</Link>
    </Menu.Item>,
    <Menu.Item key={1} icon={<LoginOutlined />}>
      <Link to="/login">Register / Login</Link>
    </Menu.Item>,
    <Menu.Item key={2} icon={<InfoCircleOutlined />}>
      <Link to="/about">About</Link>
    </Menu.Item>,
  ];

  // determine which menu items to show
  const selectedMenuItems = loggedIn ? loggedInMenuItems : loggedOutMenuItems;

  // Allows us to highlight currently selected sidebar link.
  // Doesn't currently work if we navigate to an individual post
  const highlight = () => {
    const path = location.pathname;
    const foundIndex = selectedMenuItems.findIndex(
      (item) => item.props.children.props.to === path
    );
    return foundIndex;
  };

  return (
    <Sider
      collapsible
      collapsed={collapseState.collapsed}
      onCollapse={() => collapseState.setIsCollapsed(!collapseState.collapsed)}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
      }}
    >
      <Title className="logo" level={4}>
        {collapseState.collapsed ? "B" : "Bloggy"}
      </Title>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[`${highlight()}`]}>
        {selectedMenuItems}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
