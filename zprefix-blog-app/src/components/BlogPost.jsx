import { useState } from "react";

const BlogPost = ({
  postInfo,
  truncate,
  isEditable,
  selectPost,
  updatePost,
}) => {
  const { title, content, id } = postInfo;
  const truncatedContent = `${content.slice(0, 100)}...`;
  const posted = new Date(Date.parse(postInfo.created_at));
  const displayedContent = truncate ? truncatedContent : content;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="BlogPost">
      {isEditable ? (
        <button
          type="button"
          className="editToggle"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel Edit" : "Edit Post"}
        </button>
      ) : (
        <></>
      )}
      <article
        className="BlogPost"
        onClick={selectPost ? () => selectPost(id) : undefined}
      >
        <header>
          {isEditing ? (
            <div className="postEdit">
              <input
                type="text"
                id="titleEdit"
                name="titleEdit"
                form="editForm"
                required
                defaultValue={title}
              />
            </div>
          ) : (
            <h1>{title}</h1>
          )}
          <time>Posted: {posted.toLocaleDateString()}</time>
        </header>
        {isEditing ? (
          <div className="postEdit">
            <textarea
              id="contentEdit"
              name="contentEdit"
              form="editForm"
              required
              defaultValue={content}
            />
          </div>
        ) : (
          <p>{displayedContent}</p>
        )}
      </article>
      {isEditing ? (
        <form
          id="editForm"
          className="editForm"
          onSubmit={(e) => updatePost(e)}
        >
          {/* Pass the post ID through the form just to be sure
              that we PATCH the correct post in the DB */}
          <input
            type="number"
            value={id}
            id="editedPostID"
            name="editedPostID"
            readOnly
            hidden
          />
          <button type="submit">Update Post</button>
        </form>
      ) : (
        <></>
      )}
    </div>
  );
};

export default BlogPost;
