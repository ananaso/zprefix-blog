const PublishForm = ({ submitPost }) => {
  return (
    <div className="PublishForm">
      <label htmlFor="publishForm">Login</label>
      <form
        id="publishForm"
        className="publishForm"
        onSubmit={(e) => submitPost(e)}
      >
        <div className="publishForm">
          <label htmlFor="titleInput">Title:</label>
          <input type="text" id="titleInput" name="titleInput" required />
        </div>
        <div className="publishForm">
          <label htmlFor="contentInput">Password:</label>
          <textarea id="contentInput" name="contentInput" required />
        </div>
        <div className="publishForm">
          <button type="submit">Publish</button>
        </div>
      </form>
    </div>
  );
};

export default PublishForm;
