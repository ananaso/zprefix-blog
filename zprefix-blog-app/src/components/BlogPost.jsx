const BlogPost = ({ postInfo }) => {
  const { title, username, content } = postInfo;
  const posted = new Date(Date.parse(postInfo.created_at));
  const updated = new Date(Date.parse(postInfo.updated_at));
  return (
    <article className="BlogPost">
      <header>
        <h1>{title}</h1>
        <address>Author: {username}</address>
        <time>Posted: {posted.toLocaleString()}</time>
        <br />
        <time>Last Updated: {updated.toLocaleString()}</time>
      </header>
      <p>{`${content.slice(0, 100)}...`}</p>
    </article>
  );
};

export default BlogPost;
