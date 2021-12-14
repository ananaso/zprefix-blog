const BlogPost = ({ postInfo }) => {
  const { title, username, content } = postInfo;
  const posted = new Date(Date.parse(postInfo.created_at));
  return (
    <article className="BlogPost">
      <header>
        <h1>{title}</h1>
        <address>Author: {username}</address>
        <time>Posted: {posted.toLocaleDateString()}</time>
      </header>
      <p>
        {content.length > 100 ? `${content.slice(0, 100)}...` : `${content}`}
      </p>
    </article>
  );
};

export default BlogPost;
