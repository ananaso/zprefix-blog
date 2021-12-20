import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import BlogPost from "./components/BlogPost";
import PublishForm from "./components/PublishForm";
import LoginForm from "./components/LoginForm";
import Sidebar from "./components/Sidebar.jsx";

import "./styling/App.css";

import {
  Button,
  Card,
  Col,
  Empty,
  Layout,
  Row,
  Space,
  Typography,
  message,
} from "antd";
const { Content } = Layout;
const { Title, Paragraph } = Typography;

const hostname = process.env.REACT_APP_SERVER_HOST;
const port = process.env.REACT_APP_SERVER_PORT;
const baseURL =
  process.env.NODE_ENV === "production"
    ? `http://${hostname}`
    : `http://${hostname}:${port}`;

const contentLayoutStyle = { marginLeft: 200 };

function App() {
  const [posts, setPosts] = useState([]);
  const [singlePost, setSinglePost] = useState({});
  const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("username"));
  const [previousPath, setPreviousPath] = useState("/");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    sessionStorage.getItem("sidebarCollapsed")
  );
  let navigate = useNavigate();
  let location = useLocation();

  // load all posts on initial render
  useEffect(() => {
    getAllPosts();
  }, []);

  // keep track of where user's last been for redirecting purposes
  useEffect(() => {
    setPreviousPath(location);
  }, [location]);

  // update the stored collapse state when sidebar is collapsed
  useEffect(() => {
    sessionStorage.setItem("collapsed", sidebarCollapsed);
  }, [sidebarCollapsed]);

  const getAllPosts = async () => {
    await fetch(`${baseURL}/`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((fetchedPosts) =>
        fetchedPosts.sort((postA, postB) => {
          if (postA.created_at > postB.created_at) {
            return -1;
          } else if (postA.created_at < postB.created_at) {
            return 1;
          } else {
            return 0;
          }
        })
      )
      .then((sortedPosts) => setPosts(sortedPosts));
  };

  const submitPost = async ({ title, content }) => {
    await fetch(`${baseURL}/publish`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author: loggedIn,
        title: title,
        content: content,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        // reconstruct new post and store it locally
        // to mask the tiny delay of grabbing posts again
        const newPost = {
          id: result.id,
          username: loggedIn,
          title: title,
          content: content,
          created_at: result.created_at,
          updated_at: result.created_at,
        };
        setPosts([newPost, ...posts]);
      })
      .then(() => {
        getAllPosts();
        navigate("/posts");
      });
  };

  const updatePost = async (id, title, content) => {
    await fetch(`${baseURL}/publish`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, title: title, content: content }),
    })
      .then((response) => response.json())
      .then((result) => {
        const newPost = {
          id: id,
          username: loggedIn,
          title: title,
          content: content,
          created_at: result.created_at,
          updated_at: result.updated_at,
        };
        setSinglePost(newPost);
      })
      .then(() => {
        getAllPosts();
      });
  };

  const deletePost = async (id) => {
    await fetch(`${baseURL}/publish`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result !== 1) {
          console.log(
            `Uhoh, something weird happened on the server when deleting.
            Deleted ${result} posts`
          );
        }
        // set posts to not have flicker while waiting
        //  for getAllPosts to resolve
        setPosts(posts.filter((post) => post.id !== id));
        getAllPosts();
        navigate("/posts");
      });
  };

  // Accept registration info and receive response from server.
  // Will log user in if registration is successful
  const submitRegistration = async ({ username, password }) => {
    await fetch(`${baseURL}/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => ({ status: response.status, data: response.json() }))
      .then((result) => {
        // this is brittle just like the rest of this app
        result.status === 201
          ? message
              .success("Account registered! Redirecting...", 0.5)
              .then(() => handleLogin(username))
          : message.error("Username already taken", 3);
      });
  };

  // Accept the login info and receive response from server.
  // Will navigate to home page on successful login, and alert
  // user on unsuccessful login
  const submitLogin = async ({ username, password }) => {
    await message
      .loading("Logging in...", 0.5)
      .then(() =>
        fetch(`${baseURL}/login`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username, password: password }),
        })
      )
      .then((response) => response.json())
      .then((result) => {
        // form.reset();
        if (result.success) {
          message
            .success("Successfully logged in! Redirecting...", 0.5)
            .then(() => handleLogin(username));
        } else {
          message.error("Invalid username or password", 3);
        }
      });
  };

  const handleLogin = (username) => {
    sessionStorage.setItem("username", username);
    setLoggedIn(username);
    navigate("/posts", { replace: true });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("username");
    setLoggedIn("");
    navigate("/");
  };

  // single sidebar for all pages, to make managing it easier
  const sidebar = (
    <Sidebar
      loggedIn={loggedIn}
      location={location}
      collapseState={{
        collapsed: sidebarCollapsed,
        setIsCollapsed: setSidebarCollapsed,
      }}
      handleLogout={handleLogout}
    />
  );

  /* Routes */
  const Home = () => {
    return (
      <Layout>
        {sidebar}
        <Layout className="site-layout" style={contentLayoutStyle}>
          <Content style={{ margin: "24px 16px 24px", overflow: "initial" }}>
            <Space direction="vertical">
              {posts.map((post) => (
                <BlogPost
                  key={post.id}
                  postInfo={post}
                  selectPost={selectPost}
                  truncate={true}
                  hoverable={true}
                  isEditable={false}
                />
              ))}
            </Space>
          </Content>
        </Layout>
      </Layout>
    );
  };

  const Login = () => {
    return (
      <Layout>
        {sidebar}
        <Layout className="site-layout" style={contentLayoutStyle}>
          <Content style={{ margin: "24px 16px 24px", overflow: "initial" }}>
            <Row gutter={48}>
              <Col flex="auto" />
              <Col flex="400px">
                <Card title="Login">
                  <LoginForm submitLogin={submitLogin} />
                </Card>
              </Col>
              <Col flex="400px">
                <Card title="Register">
                  <LoginForm submitLogin={submitRegistration} />
                </Card>
              </Col>
              <Col flex="auto" />
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  };

  const getUserPosts = () => {
    const userPosts = posts
      .filter((post) => post.username === loggedIn)
      .map((post) => (
        <BlogPost
          key={post.id}
          postInfo={post}
          selectPost={selectPost}
          truncate={true}
          hoverable={true}
          isEditable={false}
        />
      ));
    const noPosts = (
      <Empty description={<span>No blog posts :(</span>}>
        <Button type="primary" onClick={() => navigate("/publish")}>
          Write your first post!
        </Button>
      </Empty>
    );
    return userPosts.length > 0 ? userPosts : noPosts;
  };

  const Posts = () => {
    return (
      <Layout>
        {sidebar}
        <Layout className="site-layout" style={contentLayoutStyle}>
          <Content style={{ margin: "24px 16px 24px", overflow: "initial" }}>
            <Space direction="vertical">{getUserPosts()}</Space>
          </Content>
        </Layout>
      </Layout>
    );
  };

  const selectPost = (id) => {
    setSinglePost(posts.find((post) => post.id === id));
    navigate(`/post/${id}`);
  };

  // This is very brittle since you can't navigate directly to it.
  // Not exactly sure why this happens. Maybe because it starts processing
  //  `posts` before useEffect has a chance to kick in and call getAllPosts
  const SinglePost = () => {
    // ugly catch for direct navigation to a single post
    if (posts.length === 0) {
      console.log(
        "I'm just a poor little MVP, please go with the UI/UX flow :)"
      );
      return <Navigate to="/" replace={true} />;
    }

    return (
      <Layout>
        {sidebar}
        <Layout className="site-layout" style={contentLayoutStyle}>
          <Content style={{ margin: "24px 96px 24px", overflow: "initial" }}>
            <BlogPost
              key={singlePost.id}
              postInfo={singlePost}
              truncate={false}
              hoverable={false}
              updatePost={updatePost}
              deletePost={deletePost}
              isEditable={loggedIn === singlePost.username}
            />
          </Content>
        </Layout>
      </Layout>
    );
  };

  const Publish = () => {
    return (
      <Layout>
        {sidebar}
        <Layout className="site-layout" style={contentLayoutStyle}>
          <Content style={{ margin: "24px 96px 24px", overflow: "initial" }}>
            <PublishForm submitPost={submitPost} />
          </Content>
        </Layout>
      </Layout>
    );
  };

  const About = () => {
    return (
      <Layout>
        {sidebar}
        <Layout className="site-layout" style={contentLayoutStyle}>
          <Content style={{ margin: "24px 16px 24px", overflow: "initial" }}>
            <Title level={3}>
              This webapp was created by Alden Davidson in December 2021 to
              fulfill Step 3 of the USSF Z-prefix Award Pipeline.
            </Title>
            <Paragraph>
              The seed data is a small collection of messages sampled from one
              of my all-time favorite games, The Talos Principle.
            </Paragraph>
          </Content>
        </Layout>
      </Layout>
    );
  };

  const NotLoggedIn = () => {
    message.info("You have to be logged in to access this content", 3);
    return <Navigate to="/login" />;
  };

  const NoMatch = () => {
    message.error("Page not found", 3);
    return <Navigate to={previousPath} />;
  };

  /* Router */
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={loggedIn ? <Navigate to="/" /> : <Login />}
        />
        <Route path="/posts" element={loggedIn ? <Posts /> : <NotLoggedIn />} />
        <Route path="/post">
          <Route path=":id" element={<SinglePost />} />
        </Route>
        <Route
          path="/publish"
          element={loggedIn ? <Publish /> : <NotLoggedIn />}
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </div>
  );
}

export default App;
