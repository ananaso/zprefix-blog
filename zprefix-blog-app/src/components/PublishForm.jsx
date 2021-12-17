import { Form, Input, Button } from "antd";

const PublishForm = ({ submitPost }) => {
  return (
    <Form
      name="publishForm"
      layout="vertical"
      requiredMark={false}
      autoComplete="off"
      onFinish={submitPost}
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[
          { required: true, message: "Don't forget to title your post!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="content"
        label="Content"
        rules={[
          { required: true, message: "You forgot to write your post, silly" },
        ]}
      >
        <Input.TextArea autoSize={{ minRows: 6 }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Publish
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PublishForm;
