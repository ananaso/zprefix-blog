import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

import BlogPost from "./BlogPost.jsx";

import "./styling/App.css";

const hostname = process.env.REACT_APP_SERVER_HOST;
const port = process.env.REACT_APP_SERVER_PORT;
const baseURL = `http://${hostname}:${port}`;

function App() {
  const [posts, setPosts] = useState("");

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
      .then((fetchedPosts) =>
        fetchedPosts.map((post, index) => (
          <BlogPost key={index} postInfo={post} />
        ))
      )
      .then((blogpost) => setPosts(blogpost));
  };

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
      .then((result) => console.log(result));
  };

  /* Routes */
  const Home = () => {
    return (
      <div className="Home">
        <nav>
          <Link to="/login">Create Account/Login</Link>
        </nav>
        <main>{posts}</main>
      </div>
    );
  };

  const Login = () => {
    return (
      <div className="LoginRegister">
        <nav>
          <Link to="/">Home</Link>
        </nav>
        <label htmlFor="loginForm">Login</label>
        <form
          id="loginForm"
          className="loginForm"
          onSubmit={(e) => submitLogin(e)}
        >
          <div className="loginForm">
            <label htmlFor="usernameInput">Username:</label>
            <input type="text" id="usernameInput" name="usernameInput" />
          </div>
          <div className="loginForm">
            <label htmlFor="passwordInput">Password:</label>
            <input type="password" id="passwordInput" name="passwordInput" />
          </div>
          <div className="loginForm">
            <button type="submit">Login</button>
          </div>
        </form>
        <label htmlFor="registrationForm">Create Account</label>
        <form
          id="registrationForm"
          className="registrationForm"
          onSubmit={(e) => submitRegistration(e)}
        >
          <div className="registrationForm">
            <label htmlFor="usernameInput">Username:</label>
            <input type="text" id="usernameInput" name="usernameInput" />
          </div>
          <div className="registrationForm">
            <label htmlFor="passwordInput">Password:</label>
            <input type="password" id="passwordInput" name="passwordInput" />
          </div>
          <div className="registrationForm">
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    );
  };

  /* Router */
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
