const BlogPost = ({ postInfo, selectPost, truncate }) => {
  const { title, username, content, id } = postInfo;
  const truncatedContent = `${content.slice(0, 100)}...`;
  const posted = new Date(Date.parse(postInfo.created_at));
  const displayedContent = truncate ? truncatedContent : content;

  return (
    <article
      className="BlogPost"
      onClick={selectPost ? () => selectPost(id) : undefined}
    >
      <header>
        <h1>{title}</h1>
        <address>Author: {username}</address>
        <time>Posted: {posted.toLocaleDateString()}</time>
      </header>
      <p>{displayedContent}</p>
    </article>
  );
};

export default BlogPost;
