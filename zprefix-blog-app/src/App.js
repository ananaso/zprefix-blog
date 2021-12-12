import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import LoginRegister from "./components/LoginRegister.jsx";

import BlogPost from "./components/BlogPost";

import "./styling/App.css";

const hostname = process.env.REACT_APP_SERVER_HOST;
const port = process.env.REACT_APP_SERVER_PORT;
const baseURL = `http://${hostname}:${port}`;

function App() {
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
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
      route = "/";
      setLoggedIn(username);
      setUserPosts(posts.filter((post) => post.username === username));
    } else {
      alert("Invalid username or password");
      route = "/login";
    }
    return navigate(route, { replace: true });
  };

  /* Routes */
  const Home = () => {
    return (
      <div className="Home">
        <nav>
          <ul>
            {loggedIn !== "" ? (
              <li>
                <Link to="/MyPosts">My Posts</Link>
              </li>
            ) : (
              <></>
            )}
            <li>
              <Link to="/login">Create Account/Login</Link>
            </li>
          </ul>
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
            </ul>
          </nav>
          {userPosts.map((post, index) => (
            <BlogPost key={index} postInfo={post} />
          ))}
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
        <Route path="/MyPosts" element={<MyPosts />} />
      </Routes>
    </div>
  );
}

export default App;
