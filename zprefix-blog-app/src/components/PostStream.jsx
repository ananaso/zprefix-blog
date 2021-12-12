import { useEffect, useState } from "react";
import BlogPost from "./BlogPost";

const PostStream = ({ username, baseURL }) => {
  const [posts, setPosts] = useState([]);

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

  return <div className="PostStream">{posts}</div>;
};

export default PostStream;
