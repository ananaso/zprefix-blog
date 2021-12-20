import { useState } from "react";
import { Button, Card, Typography, Input, message } from "antd";
import {
  EditOutlined,
  EditTwoTone,
  SaveOutlined,
  DeleteTwoTone,
} from "@ant-design/icons";
import "../styling/App.css";
const { Text, Paragraph } = Typography;
const { TextArea } = Input;

const BlogPost = ({
  postInfo,
  truncate,
  hoverable,
  isEditable,
  selectPost,
  updatePost,
  deletePost,
}) => {
  const [title, setTitle] = useState(postInfo.title);
  const [content, setContent] = useState(postInfo.content);
  const [isEditing, setIsEditing] = useState(false);

  const id = postInfo.id;
  const posted = new Date(Date.parse(postInfo.created_at));

  const displayedContent =
    truncate && content.length > 100 ? `${content.slice(0, 100)}...` : content;
  const postTitle = isEditing ? (
    <Input
      size="small"
      bordered={false}
      required
      defaultValue={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  ) : (
    <Text strong>{title}</Text>
  );
  const postContent = isEditing ? (
    <TextArea
      autoSize
      bordered={false}
      showCount
      required
      defaultValue={content}
      onChange={(e) => setContent(e.target.value)}
    />
  ) : (
    <Paragraph>{displayedContent}</Paragraph>
  );

  // reset all values when cancelling an edit
  const cancelEdit = () => {
    setIsEditing(!isEditing);
    setTitle(postInfo.title);
    setContent(postInfo.content);
  };

  // check update for invalid inputs before submitting
  const checkUpdates = () => {
    if (title.length > 0 && content.length > 0) {
      updatePost(id, title, content);
    } else {
      message.error("You cannot submit posts with empty titles or content", 3);
    }
  };

  const actions = () => {
    const editToggleButton = (
      <Button
        type="default"
        onClick={
          isEditing ? () => cancelEdit() : () => setIsEditing(!isEditing)
        }
        icon={isEditing ? <EditTwoTone /> : <EditOutlined />}
      >
        {isEditing ? "Cancel Edit" : "Edit Post"}
      </Button>
    );

    const deleteButton = (
      <Button
        type="default"
        danger
        icon={<DeleteTwoTone twoToneColor="#ff0000" />}
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this post?")) {
            deletePost(id);
          }
        }}
      >
        Delete Post
      </Button>
    );

    const editSubmitButton = (
      <Button
        type="submit"
        onClick={() => checkUpdates()}
        icon={<SaveOutlined />}
      >
        Save Changes
      </Button>
    );

    const editActions = isEditing
      ? [editToggleButton, editSubmitButton, <></>, deleteButton]
      : [editToggleButton, <></>, <></>, deleteButton];

    return isEditable ? [...editActions] : [];
  };

  return (
    <Card
      title={postTitle}
      onClick={selectPost ? () => selectPost(id) : undefined}
      actions={actions()}
      extra={
        <Text type="secondary" italic>
          Posted: {posted.toLocaleDateString()}
        </Text>
      }
      style={{ textAlign: "left", whiteSpace: "pre-line" }}
      hoverable={hoverable}
    >
      <Paragraph>{postContent}</Paragraph>
    </Card>
  );
};

export default BlogPost;
