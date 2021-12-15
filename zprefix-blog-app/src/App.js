import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
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
        // reset form and navigate back to see user's posts
        form.reset();
        navigate("/posts");
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
        form.reset();
        // this is brittle just like the rest of this app
        result.status === 201
          ? handleLogin(username)
          : alert("Username already taken");
      });
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
      <div className="Home">
        <nav>
          <NavSwapper
            loggedIn={loggedIn}
            inLinks={[
              <Link to="/posts">My Posts</Link>,
              <Link to="/publish">Publish New Post</Link>,
              <LogoutButton handleLogout={handleLogout} />,
            ]}
            outLinks={[<Link to="/login">Create Account / Login</Link>]}
          />
        </nav>
        {posts.map((post) => (
          <BlogPost
            key={post.id}
            postInfo={post}
            selectPost={selectPost}
            truncate={true}
          />
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

  const Posts = () => {
    // crude method of rerouting folks that aren't logged in
    if (loggedIn.length === 0) {
      return NotLoggedIn();
    } else {
      return (
        <div className="Posts">
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
            .map((post) => (
              <BlogPost
                key={post.id}
                postInfo={post}
                selectPost={selectPost}
                truncate={true}
              />
            ))}
        </div>
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
      <div className="SinglePost">
        <nav>
          <NavSwapper
            loggedIn={loggedIn}
            inLinks={[
              <Link to="/">All Posts</Link>,
              <Link to="/posts">My Posts</Link>,
              <Link to="/publish">Publish New Post</Link>,
              <LogoutButton handleLogout={handleLogout} />,
            ]}
            outLinks={[
              <Link to="/">All Posts</Link>,
              <Link to="/login">Create Account / Login</Link>,
            ]}
          />
        </nav>
        <BlogPost key={singlePost.id} postInfo={singlePost} truncate={false} />
      </div>
    );
  };

  const Publish = () => {
    // crude method of rerouting folks that aren't logged in
    if (loggedIn.length === 0) {
      return NotLoggedIn();
    } else {
      return (
        <div className="Publish">
          <nav>
            <ul>
              <li>
                <Link to="/">All Posts</Link>
              </li>
              <li>
                <Link to="/posts">My Posts</Link>
              </li>
              <LogoutButton loggedIn={loggedIn} handleLogout={handleLogout} />
            </ul>
          </nav>
          <PublishForm submitPost={submitPost} />
        </div>
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
