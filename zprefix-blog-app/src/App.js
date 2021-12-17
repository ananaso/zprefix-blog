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

import "./styling/App.css";

import { Button, Card, Col, Empty, Layout, Row, Space } from "antd";
import Sidebar from "./components/Sidebar.jsx";
const { Content } = Layout;

const hostname = process.env.REACT_APP_SERVER_HOST;
const port = process.env.REACT_APP_SERVER_PORT;
const baseURL = `http://${hostname}:${port}`;

function App() {
  const [posts, setPosts] = useState([]);
  const [singlePost, setSinglePost] = useState({});
  const [loggedIn, setLoggedIn] = useState("");
  const [previousPath, setPreviousPath] = useState("/");
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
          ? handleLogin(username)
          : alert("Username already taken");
      });
  };

  // Accept the login info and receive response from server.
  // Will navigate to home page on successful login, and alert
  // user on unsuccessful login
  const submitLogin = async ({ username, password }) => {
    await fetch(`${baseURL}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => response.json())
      .then((result) => {
        // form.reset();
        if (result.success) {
          handleLogin(username);
        } else {
          alert("Invalid username or password");
        }
      });
  };

  const handleLogin = (username) => {
    setLoggedIn(username);
    navigate("/posts", { replace: true });
  };

  const handleLogout = () => {
    setLoggedIn("");
    navigate("/");
  };

  /* Routes */
  const Home = () => {
    return (
      <Layout>
        <Sidebar
          loggedIn={loggedIn}
          location={location}
          handleLogout={handleLogout}
        />
        <Layout className="site-layout" style={{ marginLeft: 200 }}>
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
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
        <Sidebar
          loggedIn={loggedIn}
          location={location}
          handleLogout={handleLogout}
        />
        <Layout className="site-layout" style={{ marginLeft: 200 }}>
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
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
    // crude method of rerouting folks that aren't logged in
    if (loggedIn.length === 0) {
      return NotLoggedIn();
    } else {
      return (
        <Layout>
          <Sidebar
            loggedIn={loggedIn}
            location={location}
            handleLogout={handleLogout}
          />
          <Layout className="site-layout" style={{ marginLeft: 200 }}>
            <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
              <Space direction="vertical">{getUserPosts()}</Space>
            </Content>
          </Layout>
        </Layout>
      );
    }
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
        <Sidebar
          loggedIn={loggedIn}
          location={location}
          handleLogout={handleLogout}
        />
        <Layout className="site-layout" style={{ marginLeft: 200 }}>
          <Content style={{ margin: "24px 96px 0", overflow: "initial" }}>
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
    // crude method of rerouting folks that aren't logged in
    if (loggedIn.length === 0) {
      return NotLoggedIn();
    } else {
      return (
        <Layout>
          <Sidebar
            loggedIn={loggedIn}
            location={location}
            handleLogout={handleLogout}
          />
          <Layout className="site-layout" style={{ marginLeft: 200 }}>
            <Content style={{ margin: "24px 96px 0", overflow: "initial" }}>
              <PublishForm submitPost={submitPost} />
            </Content>
          </Layout>
        </Layout>
      );
    }
  };

  const NotLoggedIn = () => {
    alert("You have to be logged in to access this content");
    return <Navigate to="/login" />;
  };

  const NoMatch = () => {
    alert("Page not found");
    return <Navigate to={previousPath} />;
  };

  /* Router */
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/post">
          <Route path=":id" element={<SinglePost />} />
        </Route>
        <Route path="/publish" element={<Publish />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </div>
  );
}

export default App;
