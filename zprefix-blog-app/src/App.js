import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import LoginRegister from "./components/LoginRegister.jsx";

import BlogPost from "./components/BlogPost";
import LogoutButton from "./components/LogoutButton";

import "./styling/App.css";
import NavSwapper from "./components/NavSwapper.jsx";
import PublishForm from "./components/PublishForm";

const hostname = process.env.REACT_APP_SERVER_HOST;
const port = process.env.REACT_APP_SERVER_PORT;
const baseURL = `http://${hostname}:${port}`;

function App() {
  const [posts, setPosts] = useState([]);
  const [loggedIn, setLoggedIn] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = async () => {
    await fetch(`${baseURL}/`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((fetchedPosts) => setPosts(fetchedPosts));
  };

  const submitPost = async (event) => {
    event.preventDefault();
    const form = event.target;
    const title = form.elements["titleInput"].value;
    const content = form.elements["contentInput"].value;
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
        const newPost = {
          username: loggedIn,
          title: title,
          content: content,
          created_at: result.created_at,
          updated_at: result.created_at,
        };
        setPosts([...posts, newPost]);
      })
      .then(() => {
        // reset form and navigate back to see user's posts
        form.reset();
        navigate("/myPosts");
      });
  };

  // Accept registration info and receive response from server.
  // Will log user in if registration is successful
  const submitRegistration = async (event) => {
    event.preventDefault();
    const form = event.target;
    const username = form.elements["usernameInput"].value;
    const password = form.elements["passwordInput"].value;
    await fetch(`${baseURL}/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => ({ status: response.status, data: response.json() }))
      .then((result) => {
        result.status === 500
          ? alert("Username already taken")
          : console.log(result);
      });
    form.reset();
  };

  // Accept the login info and receive response from server.
  // Will navigate to home page on successful login, and alert
  // user on unsuccessful login
  const submitLogin = async (event) => {
    event.preventDefault();
    const form = event.target;
    const username = form.elements["usernameInput"].value;
    const password = form.elements["passwordInput"].value;
    await fetch(`${baseURL}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => response.json())
      .then((result) => {
        form.reset();
        return handleLoginOutcome(result.success, username);
      });
  };

  // silly helper function to allow alerting when invalid login
  const handleLoginOutcome = (success, username) => {
    let route = "";
    if (success) {
      route = "/myPosts";
      setLoggedIn(username);
    } else {
      alert("Invalid username or password");
      route = "/login";
    }
    return navigate(route, { replace: true });
  };

  const handleLogout = () => {
    setLoggedIn("");
  };

  /* Routes */
  const Home = () => {
    return (
      <div className="Home">
        <nav>
          <NavSwapper
            loggedIn={loggedIn}
            inLinks={[
              <Link to="/myPosts">My Posts</Link>,
              <Link to="/publish">Publish New Post</Link>,
              <LogoutButton handleLogout={handleLogout} />,
            ]}
            outLinks={[<Link to="/login">Create Account / Login</Link>]}
          />
        </nav>
        {posts.map((post, index) => (
          <BlogPost key={index} postInfo={post} />
        ))}
      </div>
    );
  };

  const Login = () => {
    return (
      <div className="LoginRegister">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
        <LoginRegister
          submitLogin={submitLogin}
          submitRegistration={submitRegistration}
        />
      </div>
    );
  };

  const MyPosts = () => {
    // crude method of rerouting folks that aren't logged in
    if (loggedIn === "") {
      return <Navigate to="/login" />;
    } else {
      return (
        <div className="MyPosts">
          <nav>
            <ul>
              <li>
                <Link to="/">All Posts</Link>
              </li>
              <li>
                <Link to="/publish">Publish New Post</Link>
              </li>
              <li>
                <LogoutButton handleLogout={handleLogout} />
              </li>
            </ul>
          </nav>
          {posts
            .filter((post) => post.username === loggedIn)
            .map((post, index) => (
              <BlogPost key={index} postInfo={post} />
            ))}
        </div>
      );
    }
  };

  const Publish = () => {
    // crude method of rerouting folks that aren't logged in
    if (loggedIn === "") {
      return <Navigate to="/login" />;
    } else {
      return (
        <div className="Publish">
          <nav>
            <ul>
              <li>
                <Link to="/">All Posts</Link>
              </li>
              <li>
                <Link to="/myPosts">My Posts</Link>
              </li>
              <LogoutButton loggedIn={loggedIn} handleLogout={handleLogout} />
            </ul>
          </nav>
          <PublishForm submitPost={submitPost} />
        </div>
      );
    }
  };

  /* Router */
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myPosts" element={<MyPosts />} />
        <Route path="/publish" element={<Publish />} />
      </Routes>
    </div>
  );
}

export default App;
