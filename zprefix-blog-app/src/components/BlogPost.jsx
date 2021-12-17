import { useState } from "react";
import { Button, Card, Typography, Input } from "antd";
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
      id="titleEdit"
      name="titleEdit"
      form="editForm"
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
      id="contentEdit"
      name="contentEdit"
      form="editForm"
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

  const actions = () => {
    const editToggleButton = (
      <Button
        type="default"
        onClick={
          isEditing ? () => cancelEdit() : () => setIsEditing(!isEditing)
        }
        icon={isEditing ? <EditTwoTone /> : <EditOutlined />}
      >
        Edit Post
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
        onClick={() => updatePost(id, title, content)}
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
      style={{ textAlign: "left" }}
      hoverable={hoverable}
    >
      {postContent}
    </Card>
  );
};

export default BlogPost;
