import { useState } from "react";
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import LoginRegister from "./components/LoginRegister.jsx";

import PostStream from "./components/PostStream.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

import "./styling/App.css";

const hostname = process.env.REACT_APP_SERVER_HOST;
const port = process.env.REACT_APP_SERVER_PORT;
const baseURL = `http://${hostname}:${port}`;

function App() {
  const [loggedIn, setLoggedIn] = useState("");
  let navigate = useNavigate();

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
        <PostStream username={loggedIn} baseURL={baseURL} />
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
    if (loggedIn === "") {
      console.log("navigating");
      return <Navigate to="/login" />;
    } else {
      return (
        <div className="MyPosts">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
            </ul>
          </nav>
        </div>
      );
    }
  };

  const ProtectedPage = () => {
    return <h3>Protected</h3>;
  };

  /* Router */
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute loggedIn={loggedIn} />}>
          <Route path="/protected" element={<ProtectedPage />} />
          <Route path="/MyPosts" element={<MyPosts />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
