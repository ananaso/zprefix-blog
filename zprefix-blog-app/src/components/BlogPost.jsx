import { useState } from "react";
import { Button } from "antd";
import "../styling/App.css";

const BlogPost = ({
  postInfo,
  truncate,
  isEditable,
  selectPost,
  updatePost,
  deletePost,
}) => {
  const { title, content, id } = postInfo;
  const truncatedContent = `${content.slice(0, 100)}...`;
  const posted = new Date(Date.parse(postInfo.created_at));
  const displayedContent = truncate ? truncatedContent : content;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="BlogPost">
      {isEditable ? (
        <div className="postControls">
          <Button
            type="default"
            className="editToggle"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel Edit" : "Edit Post"}
          </Button>
          <Button
            type="default"
            danger
            className="deletePost"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this post?")
              ) {
                deletePost(id);
              }
            }}
          >
            Delete Post
          </Button>
        </div>
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
          <Button type="submit">Update Post</Button>
        </form>
      ) : (
        <></>
      )}
    </div>
  );
};

export default BlogPost;
